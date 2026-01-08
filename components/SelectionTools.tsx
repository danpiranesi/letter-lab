'use client';

import { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export function SelectionTools() {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const toolsRef = useRef<HTMLDivElement>(null);

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
      
      // Fallback to inserting a temporary element
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
      // Don't hide if clicking on the tools themselves
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

  return (
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
      >
        <strong>B</strong>
      </button>
      <button
        onMouseDown={handleItalicClick}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <em>I</em>
      </button>
    </div>
  );
}

