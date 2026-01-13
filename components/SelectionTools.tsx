'use client';

import { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

// Helper to wrap each character in a scribble span
function scribbleText(text: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const char of text) {
    if (char === ' ') {
      const span = document.createElement('span');
      span.className = 'scribbled-char';
      span.innerHTML = '&nbsp;';
      fragment.appendChild(span);
    } else if (char === '\n') {
      fragment.appendChild(document.createElement('br'));
    } else {
      const span = document.createElement('span');
      span.className = 'scribbled-char';
      span.textContent = char;
      fragment.appendChild(span);
    }
  }
  return fragment;
}

export function SelectionTools() {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const toolsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleBold = () => {
    const sel = window.getSelection();
    if (!sel) return;
    
    let range: Range | undefined;
    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }
    
    document.designMode = 'on';
    document.execCommand('enableObjectResizing', false, 'false');
    document.execCommand('enableInlineTableEditing', false, 'false');
    
    if (range) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    
    document.execCommand('bold', false);
    document.designMode = 'off';
  };

  const toggleItalic = () => {
    const sel = window.getSelection();
    if (!sel) return;
    
    let range: Range | undefined;
    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }
    
    document.designMode = 'on';
    document.execCommand('enableObjectResizing', false, 'false');
    document.execCommand('enableInlineTableEditing', false, 'false');
    
    if (range) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    
    document.execCommand('italic', false);
    document.designMode = 'off';
  };

  const scribbleSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const selectedText = range.toString();
    
    // Check if already scribbled
    const container = range.commonAncestorContainer;
    if (container.nodeType === Node.ELEMENT_NODE && (container as Element).classList?.contains('scribbled-char')) {
      return;
    }
    if (container.parentElement?.classList?.contains('scribbled-char')) {
      return;
    }

    // Create scribbled characters
    const scribbledFragment = scribbleText(selectedText);
    
    range.deleteContents();
    range.insertNode(scribbledFragment);
    
    // Move cursor after - add zero-width space
    const cursorAnchor = document.createTextNode('\u200B');
    range.collapse(false);
    range.insertNode(cursorAnchor);
    
    range.setStartAfter(cursorAnchor);
    range.setEndAfter(cursorAnchor);
    sel.removeAllRanges();
    sel.addRange(range);

    setIsActive(false);
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      
      const range = sel.getRangeAt(0);
      
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10pt 0';
      
      range.deleteContents();
      range.insertNode(img);
      
      // Move cursor after the image
      range.setStartAfter(img);
      range.setEndAfter(img);
      sel.removeAllRanges();
      sel.addRange(range);
      
      setIsActive(false);
    };
    
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getSelectionCoords = (): Position => {
    const toolsHeight = 50;
    let x = 0;
    let y = 0;

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rects = range.getClientRects();
      
      if (rects.length > 0) {
        const rect = rects[0];
        x = rect.right;
        y = rect.top - toolsHeight + window.scrollY;
      }
      
      if (x === 0 && y === 0) {
        const span = document.createElement('span');
        span.appendChild(document.createTextNode('\u200b'));
        range.insertNode(span);
        const rect = span.getBoundingClientRect();
        x = rect.right;
        y = rect.top - toolsHeight + window.scrollY;
        const spanParent = span.parentNode;
        if (spanParent) {
          spanParent.removeChild(span);
          spanParent.normalize();
        }
      }
    }

    return { x, y };
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) {
          const coords = getSelectionCoords();
          setPosition(coords);
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (toolsRef.current?.contains(e.target as Node)) return;
      setIsActive(false);
    };

    const handleKeyDown = () => {
      setIsActive(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBoldClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBold();
  };

  const handleItalicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItalic();
  };

  const handleScribbleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scribbleSelection();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    insertImage();
  };

  return (
    <>
      <div
        ref={toolsRef}
        className={`selection-tools ${isActive ? 'active' : ''}`}
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
        }}
      >
        <button
          onMouseDown={handleBoldClick}
          onMouseUp={(e) => e.stopPropagation()}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onMouseDown={handleItalicClick}
          onMouseUp={(e) => e.stopPropagation()}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onMouseDown={handleScribbleClick}
          onMouseUp={(e) => e.stopPropagation()}
          title="Scribble out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="12" x2="20" y2="12" transform="rotate(15 12 12)" />
            <line x1="4" y1="12" x2="20" y2="12" transform="rotate(-15 12 12)" />
          </svg>
        </button>
        <button
          onMouseDown={handleImageClick}
          onMouseUp={(e) => e.stopPropagation()}
          title="Insert image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelected}
      />
    </>
  );
}
