'use client';

import { LetterConfig } from '@/config/defaults';

interface LetterProps {
  config: LetterConfig;
  date: string;
}

export function Letter({ config, date }: LetterProps) {
  return (
    <div className="letter">
      {/* Header with addresses */}
      <header className="letter-header">
        <address>
          <div className="from-address">
            <span>{config.name}</span>
            <span>{config.street}</span>
            <span>{config.city}</span>
            {config.country && <span>{config.country}</span>}
          </div>
          <div
            className="to-address"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: config.placeholders.address }}
          />
        </address>
      </header>

      {/* Main content */}
      <main className="letter-main">
        <div
          className="letter-subject"
          contentEditable
          suppressContentEditableWarning
        >
          {config.placeholders.subject}
        </div>
        <div
          className="letter-date"
          contentEditable
          suppressContentEditableWarning
        >
          {date}
        </div>
        <div
          className="letter-text"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: config.placeholders.text }}
        />
        <div className="letter-signature">
          <div
            className="signature-closing"
            contentEditable
            suppressContentEditableWarning
          >
            {config.closing}
          </div>
          <div
            className="signature-name"
            contentEditable
            suppressContentEditableWarning
          >
            {config.name}
          </div>
          {config.signature && (
            <img src={config.signature} alt="Signature" />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="letter-footer">
        <div className="footer-address">
          <div className="footer-name">{config.name}</div>
          <div>{config.street}</div>
          <div>{config.city}</div>
          {config.country && <div>{config.country}</div>}
        </div>

        <div className="footer-contact">
          {config.phone && (
            <div>
              <span className="footer-label">{config.labels.phone}</span> {config.phone}
            </div>
          )}
          {config.mobile && (
            <div>
              <span className="footer-label">{config.labels.mobile}</span> {config.mobile}
            </div>
          )}
          {config.email && (
            <div>
              <span className="footer-label">{config.labels.email}</span> {config.email}
            </div>
          )}
          {config.website && (
            <div>
              <span className="footer-label">{config.labels.website}</span> {config.website}
            </div>
          )}
        </div>

        {config.bank !== false && (
          <div className="footer-bank">
            {config.bank && (
              <div>
                <span className="footer-label">{config.labels.bank}</span> {config.bank}
              </div>
            )}
            {config.iban && (
              <div>
                <span className="footer-label">{config.labels.iban}</span> {config.iban}
              </div>
            )}
            {config.bic && (
              <div>
                <span className="footer-label">{config.labels.bic}</span> {config.bic}
              </div>
            )}
          </div>
        )}

        {(config.vatId || config.taxId) && (
          <div className="footer-info">
            {config.vatId && (
              <div>
                <span className="footer-label">{config.labels.vatId}</span> {config.vatId}
              </div>
            )}
            {config.taxId && (
              <div>
                <span className="footer-label">{config.labels.taxId}</span> {config.taxId}
              </div>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}

