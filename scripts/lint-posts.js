import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';
import matter from 'gray-matter';

const POSTS_DIR = 'src/content/blog';
const PLACEHOLDERS = ['TODO', 'FIXME', 'TK', 'INSERT', 'PLACEHOLDER'];
const MIN_WORDS = 300;
const MAX_WORDS_WARN = 3000;
const STALE_DRAFT_DAYS = 90;
const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

const errors = [];
const warnings = [];

function error(file, msg) {
  errors.push(`  ERROR  ${file}: ${msg}`);
}

function warn(file, msg) {
  warnings.push(`  WARN   ${file}: ${msg}`);
}

// Files starting with _ are templates/partials — skip them
const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.md') && !f.startsWith('_'));

// Build set of known slugs for internal link checking
const slugs = new Set(files.map((f) => f.replace(/\.md$/, '')));

for (const file of files) {
  const filePath = join(POSTS_DIR, file);
  const raw = await readFile(filePath, 'utf-8');
  const { data: fm, content } = matter(raw);

  // --- Hard fails ---

  // Filename convention: kebab-case only
  if (!KEBAB_RE.test(file)) {
    error(file, `Filename must be kebab-case with no uppercase or spaces (got: ${file})`);
  }

  // Minimum word count
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (words < MIN_WORDS) {
    error(file, `Body too short: ${words} words (minimum ${MIN_WORDS})`);
  }

  // Placeholder text
  for (const placeholder of PLACEHOLDERS) {
    const re = new RegExp(`\\b${placeholder}\\b`);
    if (re.test(content) || re.test(JSON.stringify(fm))) {
      error(file, `Contains placeholder text: "${placeholder}"`);
    }
  }

  // Internal /blog/slug links must resolve to an existing post
  const internalLinks = [...content.matchAll(/\(\/blog\/([a-z0-9-]+)\)/g)];
  for (const [, slug] of internalLinks) {
    if (!slugs.has(slug)) {
      error(file, `Broken internal link: /blog/${slug} (no matching post file)`);
    }
  }

  // --- Warnings ---

  // High word count
  if (words >= MAX_WORDS_WARN) {
    warn(file, `Long post: ${words} words — consider splitting`);
  }

  // Stale draft
  if (fm.draft === true && fm.date) {
    const postDate = new Date(fm.date);
    const ageMs = Date.now() - postDate.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > STALE_DRAFT_DAYS) {
      warn(file, `Stale draft: marked draft:true and dated ${Math.floor(ageDays)} days ago`);
    }
  }

  // Tag casing
  if (Array.isArray(fm.tags)) {
    const upperTags = fm.tags.filter((t) => t !== t.toLowerCase());
    if (upperTags.length > 0) {
      warn(file, `Tags should be lowercase: ${upperTags.join(', ')}`);
    }
  }
}

// --- Summary ---
const total = files.length;
console.log(`\nChecked ${total} post${total !== 1 ? 's' : ''}\n`);

if (warnings.length > 0) {
  console.log('Warnings:');
  warnings.forEach((w) => console.log(w));
  console.log('');
}

if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach((e) => console.log(e));
  console.log(`\n${errors.length} error${errors.length !== 1 ? 's' : ''} found — fix before deploying.\n`);
  process.exit(1);
}

console.log(`All posts passed.${warnings.length > 0 ? ` (${warnings.length} warning${warnings.length !== 1 ? 's' : ''})` : ''}\n`);
