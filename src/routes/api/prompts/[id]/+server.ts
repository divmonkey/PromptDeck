import { json, error } from '@sveltejs/kit';
import { db, rowToPrompt, UPLOAD_DIR } from '$lib/db';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(400, 'Invalid ID');

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

  db.prepare(`
    UPDATE prompts SET
      type = @type, title = @title, imageUrl = @imageUrl, description = @description,
      prompt = @prompt, content = @content, tags = @tags, notes = @notes, updatedAt = datetime('now')
    WHERE id = @id
  `).run({
    id,
    type: data.type || 'text',
    title: data.title || '',
    imageUrl,
    description: data.description || '',
    prompt: data.prompt || '',
    content: data.content || '',
    tags: JSON.stringify(data.tags || []),
    notes: data.notes || ''
  });

  const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
  return json(rowToPrompt(row));
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(400, 'Invalid ID');

  const row = db.prepare('SELECT imageUrl FROM prompts WHERE id = ?').get(id) as { imageUrl: string } | undefined;
  if (row?.imageUrl?.startsWith('/uploads/')) {
    const fp = join(UPLOAD_DIR, row.imageUrl.replace('/uploads/', ''));
    if (existsSync(fp)) unlinkSync(fp);
  }

  db.prepare('DELETE FROM prompts WHERE id = ?').run(id);
  return json({ ok: true });
};
