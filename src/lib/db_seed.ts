import { db, rowToPrompt, type PromptRow } from './db';

export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM prompts').get() as { c: number };
  if (count.c > 0) return;

  const demos = [
    {
      type: 'image' as const,
      title: 'Cyberpunk Temple',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      prompt: 'A serene cyberpunk temple at twilight, neon lotus lanterns floating on misty water, volumetric lighting, octane render, highly detailed, 8k, artstation trending',
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
      prompt: 'Oil painting of a futuristic cityscape seen through an ancient stone window frame, golden hour lighting, impasto technique, rich textures, dramatic shadows, museum quality fine art',
      tags: JSON.stringify(['dalle', 'painting', 'cityscape']),
      notes: '',
      likes: 24,
      views: 312
    }
  ];

  const insert = db.prepare(`
    INSERT INTO prompts (type, title, imageUrl, description, prompt, content, tags, notes, likes, views)
    VALUES (@type, @title, @imageUrl, @description, @prompt, @content, @tags, @notes, @likes, @views)
  `);

  for (const d of demos) insert.run(d);
}
