'use client';

import { useRef, useEffect } from 'react';

interface ScribbleTextProps {
  initialContent: string;
  className?: string;
}

// Helper to wrap each character in a scribble span
function scribbleText(text: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const char of text) {
    if (char === ' ') {
      // Keep spaces as-is but still scribbled
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

export function ScribbleText({ initialContent, className = '' }: ScribbleTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const hasStartedTypingRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleBeforeInput = (e: InputEvent) => {
      // On first text insertion, clear the default content
      if (!hasStartedTypingRef.current && (e.inputType === 'insertText' || e.inputType === 'insertParagraph')) {
        if (e.inputType === 'insertText' && e.data) {
          e.preventDefault();
          hasStartedTypingRef.current = true;
          
          // Clear default content and insert the typed character
          element.textContent = e.data;
          
          // Move cursor to end
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          return;
        }
        
        if (e.inputType === 'insertParagraph') {
          e.preventDefault();
          hasStartedTypingRef.current = true;
          
          element.innerHTML = '<br>';
          
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          return;
        }
      }

      // Handle deletion by scribbling out instead
      if (
        e.inputType === 'deleteContentBackward' ||
        e.inputType === 'deleteContentForward' ||
        e.inputType === 'deleteByCut' ||
        e.inputType === 'deleteByDrag' ||
        e.inputType === 'deleteWordBackward' ||
        e.inputType === 'deleteWordForward' ||
        e.inputType === 'deleteSoftLineBackward' ||
        e.inputType === 'deleteSoftLineForward' ||
        e.inputType === 'deleteHardLineBackward' ||
        e.inputType === 'deleteHardLineForward'
      ) {
        e.preventDefault();
        
        // Only scribble if user has typed something
        if (!hasStartedTypingRef.current) return;
        
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        
        // If there's a text selection, scribble it out character by character
        if (!range.collapsed) {
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
          
          // Move cursor after the scribbled text - insert a zero-width space to position cursor
          const cursorAnchor = document.createTextNode('\u200B');
          range.collapse(false);
          range.insertNode(cursorAnchor);
          
          range.setStartAfter(cursorAnchor);
          range.setEndAfter(cursorAnchor);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        
        // Single character deletion (backspace/delete with no selection)
        const node = range.startContainer;
        const offset = range.startOffset;
        
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteWordBackward') {
          if (node.nodeType === Node.TEXT_NODE && offset > 0) {
            const text = node.textContent || '';
            const charToScribble = text[offset - 1];
            
            // Don't scribble if already in scribbled span
            if (node.parentElement?.classList?.contains('scribbled-char')) {
              return;
            }
            
            const beforeText = text.slice(0, offset - 1);
            const afterText = text.slice(offset);
            
            const scribbleSpan = document.createElement('span');
            scribbleSpan.className = 'scribbled-char';
            scribbleSpan.textContent = charToScribble;
            
            const parent = node.parentNode;
            if (parent) {
              // Create nodes
              const beforeNode = document.createTextNode(beforeText);
              const afterNode = document.createTextNode(afterText);
              const cursorAnchor = document.createTextNode('\u200B');
              
              parent.insertBefore(beforeNode, node);
              parent.insertBefore(scribbleSpan, node);
              parent.insertBefore(cursorAnchor, node);
              parent.insertBefore(afterNode, node);
              parent.removeChild(node);
              
              // Position cursor after the zero-width space (which is after the scribbled span)
              const newRange = document.createRange();
              newRange.setStartAfter(cursorAnchor);
              newRange.setEndAfter(cursorAnchor);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        } else if (e.inputType === 'deleteContentForward' || e.inputType === 'deleteWordForward') {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            if (offset < text.length) {
              const charToScribble = text[offset];
              
              if (node.parentElement?.classList?.contains('scribbled-char')) {
                return;
              }
              
              const beforeText = text.slice(0, offset);
              const afterText = text.slice(offset + 1);
              
              const scribbleSpan = document.createElement('span');
              scribbleSpan.className = 'scribbled-char';
              scribbleSpan.textContent = charToScribble;
              
              const parent = node.parentNode;
              if (parent) {
                const beforeNode = document.createTextNode(beforeText);
                const afterNode = document.createTextNode(afterText);
                const cursorAnchor = document.createTextNode('\u200B');
                
                parent.insertBefore(beforeNode, node);
                parent.insertBefore(scribbleSpan, node);
                parent.insertBefore(cursorAnchor, node);
                parent.insertBefore(afterNode, node);
                parent.removeChild(node);
                
                const newRange = document.createRange();
                newRange.setStartAfter(cursorAnchor);
                newRange.setEndAfter(cursorAnchor);
                selection.removeAllRanges();
                selection.addRange(newRange);
              }
            }
          }
        }
      }
    };

    element.addEventListener('beforeinput', handleBeforeInput);
    
    return () => {
      element.removeEventListener('beforeinput', handleBeforeInput);
    };
  }, []);

  // Set initial content once on mount
  useEffect(() => {
    if (!isInitializedRef.current && ref.current) {
      ref.current.innerHTML = initialContent;
      isInitializedRef.current = true;
    }
  }, [initialContent]);

  return (
    <div
      ref={ref}
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
    />
  );
}
