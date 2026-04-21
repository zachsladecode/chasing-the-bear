# Chasing the Bear — Claude Guidelines

## Images

Blog post images go in `src/assets/blog/[post-slug]/`, not in `public/` or the project root.

- When a user drops image files anywhere in the repo, move them to `src/assets/blog/[post-slug]/` immediately.
- Reference them from markdown using a relative path: `../../assets/blog/[post-slug]/image.png`
- This lets Astro optimize images at build time (compression, format conversion). Images in `public/` bypass this.

## Blog Posts

- Drafts use `draft: true` in frontmatter and are excluded from the build.
- Use the publish date (not the drafting date) in the `date` field before marking a post live.
- Slugs come from the filename — keep them descriptive and kebab-cased.
