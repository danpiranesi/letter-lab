import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { initDb } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { senderEmail, senderName, recipientEmail, letterContent, subject } = await request.json();

    if (!senderEmail || !recipientEmail) {
      return NextResponse.json(
        { error: 'Sender and recipient emails are required' },
        { status: 400 }
      );
    }

    if (!letterContent) {
      return NextResponse.json(
        { error: 'Letter content is required' },
        { status: 400 }
      );
    }

    // Try to save the letter (optional - doesn't block sending)
    try {
      const db = await initDb();
      if (db) {
        await db.execute({
          sql: `
            INSERT INTO letters (email, recipient_email, letter_content, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(email) DO UPDATE SET
              recipient_email = excluded.recipient_email,
              letter_content = excluded.letter_content,
              updated_at = CURRENT_TIMESTAMP
          `,
          args: [senderEmail, recipientEmail, letterContent],
        });
      }
    } catch (dbError) {
      console.warn('Failed to save letter to database:', dbError);
      // Continue with sending - database save is optional
    }

    // Use sender name for the from field, fallback to "Letter Lab"
    const fromName = senderName || 'Letter Lab';
    
    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: `${fromName} <s@letterlab.danschmidt.life>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: subject || 'You received a letter',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .letter-container {
              background: #fff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 30px;
              margin: 20px 0;
            }
            .footer {
              font-size: 12px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .scribbled-char {
              text-decoration: line-through;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="letter-container">
            ${letterContent}
          </div>
          <div class="footer">
            <p>This letter was sent via Letter Lab from ${fromName}</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id 
    });
  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
