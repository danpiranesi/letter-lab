'use client';

import { useState, useRef, useCallback } from 'react';
import { Letter } from '@/components/Letter';
import { SelectionTools } from '@/components/SelectionTools';
import { EmailPanel } from '@/components/EmailPanel';
import { FontSelector, FontOption, InkColor, getFontFamily, getInkColor } from '@/components/FontSelector';
import { InfoPanel } from '@/components/InfoPanel';
import { defaultConfig } from '@/config/defaults';

export default function Home() {
  const [myEmail, setMyEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedFont, setSelectedFont] = useState<FontOption>('times-new-roman');
  const [selectedInk, setSelectedInk] = useState<InkColor>('black');
  const letterRef = useRef<HTMLDivElement>(null);

  // Format the current date
  const date = new Date().toLocaleDateString(
    defaultConfig.locale,
    defaultConfig.dateFormat
  );

  const getLetterContent = useCallback(() => {
    if (letterRef.current) {
      return letterRef.current.innerHTML;
    }
    return '';
  }, []);

  const getSenderName = useCallback(() => {
    if (letterRef.current) {
      const signatureName = letterRef.current.querySelector('.signature-name');
      if (signatureName) {
        return signatureName.textContent?.trim() || defaultConfig.name;
      }
    }
    return defaultConfig.name;
  }, []);

  const getSubject = useCallback(() => {
    if (letterRef.current) {
      const subject = letterRef.current.querySelector('.letter-subject');
      if (subject) {
        return subject.textContent?.trim() || 'You received a letter';
      }
    }
    return 'You received a letter';
  }, []);

  const handleSave = useCallback(async () => {
    const letterContent = getLetterContent();
    
    const response = await fetch('/api/letters/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: myEmail,
        recipientEmail,
        letterContent,
      }),
    });

    if (!response.ok) {
      console.error('Failed to save letter');
    }
  }, [myEmail, recipientEmail, getLetterContent]);

  const handleSend = useCallback(async () => {
    const letterContent = getLetterContent();
    const senderName = getSenderName();
    const subject = getSubject();
    
    const response = await fetch('/api/letters/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderEmail: myEmail,
        senderName,
        recipientEmail,
        letterContent,
        subject,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert(`Failed to send: ${data.error}`);
      throw new Error(data.error);
    }
    
    alert(`Letter sent successfully to ${recipientEmail}!`);
  }, [myEmail, recipientEmail, getLetterContent, getSenderName, getSubject]);

  const handleLetterFound = useCallback((content: string) => {
    // When a saved letter is found, we could restore it
    // For now, just log - the user can choose to load it
    console.log('Found saved letter for this email');
  }, []);

  return (
    <>
      <div className="email-panel">
        <EmailPanel
          myEmail={myEmail}
          recipientEmail={recipientEmail}
          onMyEmailChange={setMyEmail}
          onRecipientEmailChange={setRecipientEmail}
          onSave={handleSave}
          onSend={handleSend}
          onLetterFound={handleLetterFound}
        />
        <div className="pt-4 mt-4 border-t border-gray-200">
          <FontSelector 
            selectedFont={selectedFont} 
            onFontChange={setSelectedFont}
            selectedInk={selectedInk}
            onInkChange={setSelectedInk}
          />
        </div>
      </div>
      <div ref={letterRef}>
        <Letter 
          config={defaultConfig} 
          date={date} 
          fontFamily={getFontFamily(selectedFont)}
          inkColor={getInkColor(selectedInk)}
        />
      </div>
      <SelectionTools />
      <InfoPanel />
      <div className="attribution">
        <a 
          href="https://github.com/danpiranesi/letter-lab" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View this project on GitHub
        </a>
        <span className="attribution-divider">·</span>
        <a 
          href="https://github.com/bastianallgeier/letter" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Based on Letter by Bastian Allgeier
        </a>
      </div>
    </>
  );
}
