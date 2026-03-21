// Placeholder post data — will be replaced by Astro content collections in CTB-011
export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  body: string;
  draft: boolean;
}

export const posts: Post[] = [
  {
    slug: 'what-is-a-git-worktree',
    title: 'What Even Is a Git Worktree?',
    date: '2026-03-21',
    category: 'Software Engineering',
    tags: ['git', 'tooling', 'workflow'],
    summary: 'You have been switching branches and stashing work for years. There is a better way — and it has been in Git the whole time.',
    body: 'You have been switching branches and stashing work for years. There is a better way.',
    draft: false,
  },
  {
    slug: 'building-in-public',
    title: 'Building in Public: Why I Started This Blog',
    date: '2026-03-10',
    category: 'Meta',
    tags: ['writing', 'learning'],
    summary: 'Learning happens in scattered notes. This blog gives it a home, an audience, and a forcing function to go deeper.',
    body: 'Learning happens in scattered notes. This blog gives it a home, an audience, and a forcing function to go deeper.',
    draft: false,
  },
  {
    slug: 'mental-model-for-ai',
    title: 'The Mental Model That Changed How I Think About AI',
    date: '2026-02-28',
    category: 'AI/ML',
    tags: ['ai', 'mental-models'],
    summary: 'Stop thinking about models as magic boxes. Start thinking about them as very fast, very confident pattern matchers.',
    body: 'Stop thinking about models as magic boxes. Start thinking about them as very fast, very confident pattern matchers.',
    draft: false,
  },
  {
    slug: 'fine-tuning-vs-rag',
    title: 'Fine-Tuning vs RAG — When to Use Each',
    date: '2026-03-15',
    category: 'AI/ML',
    tags: ['ai', 'rag', 'fine-tuning'],
    summary: 'Placeholder draft post — should not appear in the list.',
    body: 'Placeholder draft post.',
    draft: true,
  },
];

export const publishedPosts = posts
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
