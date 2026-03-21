import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORIES = ['Software Engineering', 'AI/ML', 'Meta'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z
      .string()
      .min(10, 'Title must be at least 10 characters')
      .max(60, 'Title must be 60 characters or fewer (SEO limit)'),
    date: z.coerce
      .date()
      .refine((d) => d <= new Date(Date.now() + 86_400_000), {
        message: 'Date cannot be more than 1 day in the future',
      }),
    category: z.enum(CATEGORIES, {
      message: `Category must be one of: ${CATEGORIES.join(', ')}`,
    }),
    tags: z
      .array(z.string().min(1))
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags per post'),
    summary: z
      .string()
      .min(50, 'Summary must be at least 50 characters')
      .max(155, 'Summary must be 155 characters or fewer (meta description limit)'),
    author: z.string().optional(),
    draft: z.boolean(), // no default — must be explicitly set in every post
  }),
});

export const collections = { blog };
