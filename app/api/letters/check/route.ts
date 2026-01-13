import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const db = await initDb();
    
    // If no database, just return no letter found
    if (!db) {
      return NextResponse.json({ exists: false, hasLetter: false });
    }
    
    const result = await db.execute({
      sql: 'SELECT id, letter_content FROM letters WHERE email = ?',
      args: [email],
    });

    if (result.rows.length > 0) {
      const hasLetter = !!result.rows[0].letter_content;
      return NextResponse.json({ 
        exists: true, 
        hasLetter,
        letterContent: result.rows[0].letter_content,
      });
    }

    return NextResponse.json({ exists: false, hasLetter: false });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ exists: false, hasLetter: false });
  }
}
