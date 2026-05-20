import { db, rowToPrompt, type PromptRow } from './db';

export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM prompts').get() as { c: number };
  if (count.c > 0) return;

  const demos = [
    {
      type: 'image' as const,
      title: 'Cyberpunk Temple',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: '',
      prompt: 'A serene cyberpunk temple at twilight, neon lotus lanterns floating on misty water, volumetric lighting, octane render, highly detailed, 8k, artstation trending',
      content: '',
      tags: JSON.stringify(['midjourney', 'cyberpunk', 'temple']),
      notes: '',
      likes: 12,
      views: 145
    },
    {
      type: 'markdown' as const,
      title: 'React Component Scaffold',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      description: 'Generates a fully typed React component with Storybook stories and unit tests.',
      prompt: '',
      content: `# React Component Generator\n\n## Role\nYou are an expert React developer specializing in TypeScript and modern best practices.\n\n## Task\nCreate a production-ready React component based on the user's requirements.\n\n## Output Structure\n1. **Component** (\`ComponentName.tsx\`): Fully typed with interfaces\n2. **Styles** (\`ComponentName.module.css\` or styled-components)\n3. **Stories** (\`ComponentName.stories.tsx\`): Storybook CSF 3.0\n4. **Tests** (\`ComponentName.test.tsx\`): React Testing Library + Jest`,
      tags: JSON.stringify(['claude', 'react', 'typescript']),
      notes: 'Great for scaffolding new UI components quickly.',
      likes: 8,
      views: 89
    },
    {
      type: 'image' as const,
      title: 'Futuristic Cityscape',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
      description: '',
      prompt: 'Oil painting of a futuristic cityscape seen through an ancient stone window frame, golden hour lighting, impasto technique, rich textures, dramatic shadows, museum quality fine art',
      content: '',
      tags: JSON.stringify(['dalle', 'painting', 'cityscape']),
      notes: '',
      likes: 24,
      views: 312
    },
    {
      type: 'image' as const,
      title: 'Neon Samurai Portrait',
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      description: '',
      prompt: 'Portrait of a cyberpunk samurai warrior, neon blue and magenta lighting reflecting off polished chrome armor, rain-soaked Tokyo street background, cinematic composition, 8k render, art by WLOP and Beeple',
      content: '',
      tags: JSON.stringify(['midjourney', 'portrait', 'samurai', 'neon']),
      notes: '',
      likes: 31,
      views: 420
    },
    {
      type: 'code' as const,
      title: 'Python Data Pipeline',
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      description: '',
      prompt: 'You are a senior Python data engineer. Build a robust ETL pipeline using pandas and SQLAlchemy that ingests CSV files, cleans null values, deduplicates records, and upserts into a PostgreSQL warehouse. Include logging, error handling, and unit tests.',
      content: '',
      tags: JSON.stringify(['python', 'data-engineering', 'etl']),
      notes: 'Production-ready data pipeline template.',
      likes: 15,
      views: 198
    },
    {
      type: 'text' as const,
      title: 'SaaS Landing Page Copy',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: '',
      prompt: 'Write high-converting landing page copy for a B2B SaaS product. Structure: Hero headline + subheadline, 3 feature sections with benefit-driven bullets, social proof section, pricing CTA, and FAQ. Tone: confident but approachable. Target audience: startup founders.',
      content: '',
      tags: JSON.stringify(['copywriting', 'saas', 'marketing']),
      notes: 'Use this as a starting framework, then customize for the specific product.',
      likes: 19,
      views: 267
    }
  ];

  const insert = db.prepare(`
    INSERT INTO prompts (type, title, imageUrl, description, prompt, content, tags, notes, likes, views)
    VALUES (@type, @title, @imageUrl, @description, @prompt, @content, @tags, @notes, @likes, @views)
  `);

  for (const d of demos) insert.run(d);
}
