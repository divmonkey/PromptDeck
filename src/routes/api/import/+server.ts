import { json, error } from '@sveltejs/kit';
import { db, rowToPrompt } from '$lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const items = await request.json();
  if (!Array.isArray(items)) throw error(400, 'Expected array');

  const insert = db.prepare(`
    INSERT INTO prompts (type, title, imageUrl, description, prompt, content, tags, notes, likes, views, createdAt, updatedAt)
    VALUES (@type, @title, @imageUrl, @description, @prompt, @content, @tags, @notes, @likes, @views, @createdAt, @updatedAt)
  `);

  const result = db.transaction(() => {
    for (const item of items) {
      const { id, _id, __v, ...rest } = item;
      insert.run({
        type: rest.type || 'text',
        title: rest.title || '',
        imageUrl: rest.imageUrl || '',
        description: rest.description || '',
        prompt: rest.prompt || '',
        content: rest.content || '',
        tags: JSON.stringify(rest.tags || []),
        notes: rest.notes || '',
        likes: rest.likes || 0,
        views: rest.views || 0,
        createdAt: rest.createdAt ? new Date(rest.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: rest.updatedAt ? new Date(rest.updatedAt).toISOString() : new Date().toISOString()
      });
    }
    return items.length;
  })();

  return json({ imported: result });
};
