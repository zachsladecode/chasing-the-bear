# Authoring Guide — Chasing the Bear

Everything you need to write and publish a post on [chasingthebear.net](https://chasingthebear.net).

---

## Creating a New Post

1. Copy the template file:
   ```bash
   cp src/content/blog/_template.md src/content/blog/your-post-slug.md
   ```
2. Fill in the frontmatter fields (see reference below).
3. Write your post in Markdown below the closing `---`.
4. Set `draft: true` while writing. Flip to `false` when ready to publish.
5. Commit and push — GitHub Actions deploys automatically.

---

## Filename Convention

Use the slug only — no date prefix. The date lives in frontmatter.

```
src/content/blog/what-is-a-git-worktree.md   ✓
src/content/blog/2026-03-21-git-worktree.md  ✗
```

**Slug rules:**
- Lowercase letters, numbers, and hyphens only
- No spaces or underscores
- Should match the URL you want: `slug.md` → `/blog/slug`

---

## Frontmatter Reference

Every post must include these fields at the top of the file, wrapped in `---`:

```yaml
---
title: "Your Post Title"
date: "2026-03-21"
category: "Software Engineering"
tags: ["git", "tooling"]
summary: "One or two sentences. Shown in post cards and RSS."
draft: false
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Shown in the post header, `<title>` tag, and OG tags |
| `date` | string (`YYYY-MM-DD`) | Yes | Publication date. Used for sorting and display |
| `category` | string | Yes | Must be an exact match from the allowed list below |
| `tags` | string array | No | Lowercase, hyphenated. Used for filtering (CTB-013) |
| `summary` | string | Yes | 1–2 sentences. Shown in post cards, RSS, and meta description |
| `draft` | boolean | No | Defaults to `false`. Set to `true` to hide from the site |

---

## Allowed Categories

Use these exact strings — they are case-sensitive:

- `Software Engineering`
- `AI / Machine Learning`
- `Meta`

If you need a new category, add it to this list and update the Zod schema in `src/content.config.ts` if you add validation for it.

---

## Draft Workflow

- `draft: true` — post is excluded from the homepage, `/blog`, RSS, and sitemap at build time
- `draft: false` — post is live on the next deploy

You can push a draft to the repo safely; it will never appear on the public site until you change the flag and push again.

---

## From Notion to Markdown

1. Write and refine the post in Notion.
2. When ready, copy the content and paste it into your new `.md` file under `src/content/blog/`.
3. Clean up any Notion-specific formatting (e.g., callout blocks → blockquotes, toggles → headings with content).
4. Set the frontmatter fields manually — Notion exports don't produce the schema this blog expects.
5. Check that code blocks have the correct language tag (e.g., ` ```bash `, ` ```typescript `).

---

## Publishing

Publishing is just a `git push`:

```bash
git add src/content/blog/your-post-slug.md
git commit -m "content: publish your-post-slug"
git push origin main
```

GitHub Actions picks up the push, builds the site, and deploys to GitHub Pages. The post is live within ~1 minute.

To publish a draft you have already pushed, update `draft: false` and push again.
