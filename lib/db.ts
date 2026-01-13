import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

// Initialize the database only if Turso is configured
export async function initDb(): Promise<Client | null> {
  if (db) return db;
  
  // Only initialize if Turso URL is provided (required for Vercel)
  if (!process.env.TURSO_DATABASE_URL) {
    console.warn('TURSO_DATABASE_URL not set - database features disabled');
    return null;
  }

  try {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    await db.execute(`
      CREATE TABLE IF NOT EXISTS letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        recipient_email TEXT,
        letter_content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}

export { db };
