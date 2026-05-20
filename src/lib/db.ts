import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.DB_PATH || 'promptvault.db';
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('image', 'markdown', 'text', 'code')),
    imageUrl TEXT DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    prompt TEXT DEFAULT '',
    content TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    notes TEXT DEFAULT '',
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    promptId INTEGER NOT NULL,
    date TEXT NOT NULL,
    sessionId TEXT NOT NULL,
    UNIQUE(promptId, date, sessionId)
  );
`);

export interface PromptRow {
  id: number;
  type: 'image' | 'markdown' | 'text' | 'code';
  imageUrl: string;
  title: string;
  description: string;
  prompt: string;
  content: string;
  tags: string;
  notes: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export function rowToPrompt(row: unknown) {
  const r = row as PromptRow;
  return {
    ...r,
    tags: JSON.parse(r.tags || '[]')
  };
}

export { db, UPLOAD_DIR };
