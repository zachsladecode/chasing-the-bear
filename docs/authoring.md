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

Use the slug only — no date prefix. The date lives in frontmatter and drives sorting and display.

```
src/content/blog/what-is-a-git-worktree.md   ✓
src/content/blog/2026-03-21-git-worktree.md  ✗
```

**Slug rules (aligned with [Google's URL structure guidelines](https://developers.google.com/search/docs/crawling-indexing/url-structure)):**
- Lowercase letters, numbers, and hyphens only — no spaces, underscores, or special characters
- Keep slugs short and descriptive — they appear directly in the URL (`/blog/your-slug`)
- Avoid repeating words unnecessarily; prefer `/git-worktrees` over `/what-is-a-git-worktree-explained`
- Do not use query parameters or session IDs in filenames
- Slugs are permanent once published — changing a slug breaks inbound links and loses SEO value

> **Future:** Hierarchical URL structure (`/blog/2026/03/what-is-a-git-worktree`) is a potential improvement for discoverability and crawling. This requires routing changes and is tracked separately.

---

## Frontmatter Reference

Every post must include these fields at the top of the file, wrapped in `---`:

```yaml
---
title: "Your Post Title"
date: "2026-03-21"
category: "Software Engineering"
tags: ["git", "tooling"]
summary: "One or two sentences. Used as the page meta description and shown in post cards and RSS."
author: "Zach Slade"
draft: false
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Shown in the post header, `<title>` tag, and OG/Twitter cards |
| `date` | string (`YYYY-MM-DD`) | Yes | Publication date. Used for sorting and display |
| `category` | string | Yes | Must be an exact match from the allowed list below |
| `tags` | string array | No | Lowercase, hyphenated. Used for filtering (CTB-013) |
| `summary` | string | Yes | 1–2 sentences. Used as the page `<meta name="description">`, OG description, post cards, and RSS |
| `author` | string | No | Author display name. Shown in the post header. Supports multiple authors as the blog grows |
| `draft` | boolean | No | Defaults to `false`. Set to `true` to hide from the site |

---

## Allowed Categories

Use these exact strings — they are case-sensitive:

- `Software Engineering`
- `AI/ML`
- `Meta`

If you need a new category, add it to this list and discuss before publishing — categories drive filtering and should stay stable.

---

## Draft Workflow

- `draft: true` — post is excluded from the homepage, `/blog`, RSS, and sitemap at build time
- `draft: false` — post is live on the next deploy

**Draft posts in a public repo:** Since this repo is public, any committed file — including drafts — is visible in the git history. For posts you want to keep private until publication:

- **Option A (recommended):** Write in Notion and only commit to the repo on publication day, with `draft: false` from the start.
- **Option B:** Commit as `draft: true` on a non-`main` branch; merge to main only when ready to publish.
- **Option C:** Use a private fork for drafts and open a PR to the public repo when ready.

Option A is the simplest and keeps the public repo clean.

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

---

## Multiple Authors

The `author` field in frontmatter supports multiple contributors. Each author sets their own name in their posts. If you invite collaborators:

1. Add them as a contributor in the GitHub repo settings.
2. Ask them to follow this guide and set `author` in their frontmatter.
3. Per-author archive pages and filtering are a future enhancement.
