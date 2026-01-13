import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, recipientEmail, letterContent } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await initDb();

    // Upsert the letter
    await db.execute({
      sql: `
        INSERT INTO letters (email, recipient_email, letter_content, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(email) DO UPDATE SET
          recipient_email = excluded.recipient_email,
          letter_content = excluded.letter_content,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [email, recipientEmail || null, letterContent],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

