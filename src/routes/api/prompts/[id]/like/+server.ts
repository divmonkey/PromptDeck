import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(400, 'Invalid ID');

  const sessionId = request.headers.get('x-session-id') || 'anon';
  const today = new Date().toISOString().split('T')[0];

  const existing = db.prepare(
    'SELECT 1 FROM likes WHERE promptId = ? AND date = ? AND sessionId = ?'
  ).get(id, today, sessionId);

  if (existing) {
    throw error(429, 'You can only like this once per day');
  }

  db.prepare('INSERT INTO likes (promptId, date, sessionId) VALUES (?, ?, ?)').run(id, today, sessionId);
  db.prepare('UPDATE prompts SET likes = likes + 1 WHERE id = ?').run(id);

  const row = db.prepare('SELECT likes FROM prompts WHERE id = ?').get(id) as { likes: number };
  return json({ likes: row.likes });
};
