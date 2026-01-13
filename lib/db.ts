import { createClient } from '@libsql/client';

// For local development, use a local SQLite file
// For production with Turso, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize the database schema
export async function initDb() {
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
}

export { db };

