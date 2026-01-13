'use client';

import { LetterConfig } from '@/config/defaults';
import { ScribbleText } from './ScribbleText';
import { Postmark } from './Postmark';

interface LetterProps {
  config: LetterConfig;
  date: string;
  fontFamily?: string;
  inkColor?: string;
}

export function Letter({ config, date, fontFamily, inkColor }: LetterProps) {
  const style: React.CSSProperties = {};
  if (fontFamily) style.fontFamily = fontFamily;
  if (inkColor) style.color = inkColor;

  return (
    <div className="letter" style={style}>
      <Postmark />
      {/* Main content */}
      <main className="letter-main">
        <ScribbleText
          className="letter-subject"
          initialContent={config.placeholders.subject}
        />
        <ScribbleText
          className="letter-text"
          initialContent={config.placeholders.text}
        />
        <div className="letter-signature">
          <ScribbleText
            className="signature-closing"
            initialContent={config.closing}
          />
          <ScribbleText
            className="signature-name"
            initialContent={config.name}
          />
          {config.signatureEmail && (
            <ScribbleText
              className="signature-email"
              initialContent={config.signatureEmail}
            />
          )}
          {config.signature && (
            <img src={config.signature} alt="Signature" />
          )}
        </div>
      </main>
    </div>
  );
}
