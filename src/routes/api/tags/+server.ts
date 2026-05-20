import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const rows = db.prepare('SELECT tags FROM prompts').all() as { tags: string }[];
  const set = new Set<string>();
  for (const r of rows) {
    try {
      const arr = JSON.parse(r.tags || '[]');
      for (const t of arr) if (t) set.add(t);
    } catch { /* ignore */ }
  }
  return json(Array.from(set).sort());
};
