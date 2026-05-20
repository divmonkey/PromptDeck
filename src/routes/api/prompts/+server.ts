import { json } from '@sveltejs/kit';
import { db, rowToPrompt, UPLOAD_DIR } from '$lib/db';
import { seedIfEmpty } from '$lib/db_seed';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

seedIfEmpty();

export const GET: RequestHandler = async ({ url }) => {
  const type = url.searchParams.get('type');
  const tag = url.searchParams.get('tag');
  const search = url.searchParams.get('search');

  let where = 'WHERE 1=1';
  const params: (string | number)[] = [];

  if (type && type !== 'all') {
    where += ' AND type = ?';
    params.push(type);
  }
  if (tag && tag !== 'all') {
    where += ' AND tags LIKE ?';
    params.push(`%"${tag}"%`);
  }
  if (search) {
    where += ' AND (title LIKE ? OR description LIKE ? OR prompt LIKE ? OR content LIKE ? OR notes LIKE ? OR tags LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s, s, s);
  }

  const rows = db.prepare(`SELECT * FROM prompts ${where} ORDER BY createdAt DESC`).all(...params);
  return json(rows.map(rowToPrompt));
};

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const dataRaw = formData.get('data') as string;
  const data = JSON.parse(dataRaw || '{}');
  const imageFile = formData.get('imageFile') as File | null;

  let imageUrl = data.imageUrl || '';
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    writeFileSync(join(UPLOAD_DIR, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const insert = db.prepare(`
    INSERT INTO prompts (type, title, imageUrl, description, prompt, content, tags, notes)
    VALUES (@type, @title, @imageUrl, @description, @prompt, @content, @tags, @notes)
  `);
  const result = insert.run({
    type: data.type || 'text',
    title: data.title || '',
    imageUrl,
    description: data.description || '',
    prompt: data.prompt || '',
    content: data.content || '',
    tags: JSON.stringify(data.tags || []),
    notes: data.notes || ''
  });

  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(result.lastInsertRowid);
  return json(rowToPrompt(row));
};
