'use client';

import { Pencil, Type, Image, Send, Eye, MessageSquare } from 'lucide-react';

export function InfoPanel() {
  return (
    <>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">How it works</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <Pencil className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Start typing</p>
            <p className="text-xs text-gray-500">Click any field and type. The placeholder text will disappear.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 flex-shrink-0 mt-0.5">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="12" x2="20" y2="12" transform="rotate(15 12 12)" />
            <line x1="4" y1="12" x2="20" y2="12" transform="rotate(-15 12 12)" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-800">No backspace</p>
            <p className="text-xs text-gray-500">Like a real letter. Mistakes get crossed out, not erased.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Type className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Format text</p>
            <p className="text-xs text-gray-500">Select text to see formatting options: bold, italic, or scribble out.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Image className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Add images</p>
            <p className="text-xs text-gray-500">Select text and click the image icon to insert a photo.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Send className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Save & send</p>
            <p className="text-xs text-gray-500">Enter emails on the left, then save your draft or send it directly.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2 mt-2 border-t border-gray-100">
          <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Privacy note</p>
            <p className="text-xs text-gray-500">Letters are stored on a server and not fully private. For anything sensitive, send a real letter.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Feedback</p>
            <p className="text-xs text-gray-500">Have thoughts on how to make the experience closer to the joys of sending a real letter? Please <a href="https://forms.gle/DqtZoLHG3hMzmTwW9" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">share them here</a>.</p>
          </div>
        </div>
      </div>
    </>
  );
}
