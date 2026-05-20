import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(400, 'Invalid ID');

  db.prepare('UPDATE prompts SET views = views + 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT views FROM prompts WHERE id = ?').get(id) as { views: number };
  return json({ views: row.views });
};
