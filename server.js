const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'));
    }
    cb(null, true);
  }
});

app.use(express.json());
app.use(express.static('public'));

// Session middleware for anonymous users
const sessions = new Map();
app.use((req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { likes: new Map(), views: new Set() });
  }
  req.session = sessions.get(sessionId);
  req.sessionId = sessionId;
  res.setHeader('X-Session-Id', sessionId);
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/promptvault')
  .then(() => console.log('[MongoDB] Connected to promptvault'))
  .catch(err => console.error('[MongoDB] Error:', err.message));

const PromptSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'markdown'], required: true },
  imageUrl: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  prompt: { type: String, default: '' },
  content: { type: String, default: '' },
  tags: [{ type: String }],
  notes: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', PromptSchema);

async function seedDemos() {
  const count = await Prompt.countDocuments();
  if (count > 0) return;
  const demos = [
    {
      type: 'image',
      title: 'Cyberpunk Temple',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      prompt: 'A serene cyberpunk temple at twilight, neon lotus lanterns floating on misty water, volumetric lighting, octane render, highly detailed, 8k, artstation trending',
      tags: ['midjourney', 'cyberpunk', 'temple'],
      notes: '',
      likes: 12,
      views: 145,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      type: 'markdown',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      title: 'React Component Scaffold',
      description: 'Generates a fully typed React component with Storybook stories and unit tests.',
      content: `# React Component Generator\n\n## Role\nYou are an expert React developer specializing in TypeScript and modern best practices.\n\n## Task\nCreate a production-ready React component based on the user's requirements.\n\n## Output Structure\n1. **Component** (\`ComponentName.tsx\`): Fully typed with interfaces\n2. **Styles** (\`ComponentName.module.css\` or styled-components)\n3. **Stories** (\`ComponentName.stories.tsx\`): Storybook CSF 3.0\n4. **Tests** (\`ComponentName.test.tsx\`): React Testing Library + Jest\n\n## Rules\n- Use functional components with hooks\n- Include JSDoc comments for all props\n- Ensure accessibility (ARIA labels, keyboard navigation)\n- Follow the project's existing naming conventions`,
      tags: ['claude', 'react', 'typescript'],
      notes: 'Great for scaffolding new UI components quickly.',
      likes: 8,
      views: 89,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000)
    },
    {
      type: 'image',
      title: 'Futuristic Cityscape',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      prompt: 'Oil painting of a futuristic cityscape seen through an ancient stone window frame, golden hour lighting, impasto technique, rich textures, dramatic shadows, museum quality fine art',
      tags: ['dalle', 'painting', 'cityscape'],
      notes: '',
      likes: 24,
      views: 312,
      createdAt: new Date(Date.now() - 200000),
      updatedAt: new Date(Date.now() - 200000)
    }
  ];
  await Prompt.insertMany(demos);
  console.log('[Seed] Demo data inserted');
}

app.get('/api/prompts', async (req, res) => {
  try {
    const { type, tag, search } = req.query;
    const query = {};
    if (type && type !== 'all') query.type = type;
    if (tag && tag !== 'all') query.tags = tag;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex }, { description: regex },
        { prompt: regex }, { content: regex }, { tags: regex }, { notes: regex }
      ];
    }
    const prompts = await Prompt.find(query).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Prompt.distinct('tags');
    res.json(tags.filter(Boolean).sort());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/prompts', (req, res, next) => {
  upload.single('imageFile')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
    data.updatedAt = new Date();
    const item = new Prompt(data);
    await item.save();
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/prompts/:id', (req, res, next) => {
  upload.single('imageFile')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
    data.updatedAt = new Date();
    const item = await Prompt.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/prompts/:id', async (req, res) => {
  try {
    const item = await Prompt.findByIdAndDelete(req.params.id);
    if (item && item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
      const fp = path.join(__dirname, 'public', item.imageUrl);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/prompts/:id/view', async (req, res) => {
  try {
    const item = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json({ views: item.views });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/prompts/:id/like', async (req, res) => {
  try {
    const promptId = req.params.id;
    const today = new Date().toISOString().split('T')[0];
    const likeKey = `${promptId}_${today}`;

    if (req.session.likes.has(likeKey)) {
      return res.status(429).json({ error: 'You can only like this once per day' });
    }

    const item = await Prompt.findByIdAndUpdate(
      promptId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    req.session.likes.set(likeKey, true);
    res.json({ likes: item.likes });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/import', async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected array' });
    const cleaned = items.map(({ _id, __v, ...rest }) => ({
      ...rest,
      createdAt: rest.createdAt ? new Date(rest.createdAt) : new Date(),
      updatedAt: rest.updatedAt ? new Date(rest.updatedAt) : new Date()
    }));
    const result = await Prompt.insertMany(cleaned);
    res.json({ imported: result.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.use((err, req, res, next) => {
  console.error('[Error]', err.code || err.message);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Image too large. Please upload an image smaller than 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`[Server] http://localhost:${PORT}`);
  await seedDemos();
});
