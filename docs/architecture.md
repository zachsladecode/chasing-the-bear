# Architecture Notes — Chasing the Bear

Design decisions and conventions for engineers working on this codebase.

---

## Styling

### Pattern: component-scoped `<style>` blocks

Every `.astro` file owns its styles via a `<style>` block at the bottom of the file. Astro automatically scopes these at build time by hashing class names, so there are no naming collisions between components.

```astro
<style>
  /* These rules only apply to elements in this component */
  .my-class { color: red; }
</style>
```

**What belongs in a component `<style>` block:**
- Layout, spacing, and visual rules specific to that component
- Responsive overrides for that component's elements
- `:global()` wrappers for styling slotted or rendered Markdown content (e.g. `PostLayout`)

**What belongs in `src/styles/global.css`:**
- CSS custom property tokens (colors, type scale, spacing)
- Base resets (`*, box-sizing`, `body`, `html`)
- Element-level defaults (`a`, `code`, `pre`, `h1–h6`, `img`)

If you find yourself copying the same rule into multiple components, consider whether it belongs in `global.css` as a token or base style instead.

---

## Content Collections

Blog posts live in `src/content/blog/` as Markdown files. The schema is defined in `src/content.config.ts` using Zod. See [docs/authoring.md](./authoring.md) for the full authoring workflow.

---

## Filtering

The `/blog` filter bar (`src/components/PostFilter.astro`) is a zero-dependency vanilla JS implementation. Post metadata is embedded as a JSON build-time prop — there are no API calls. Filtering updates the URL via `history.replaceState` so filtered views are shareable.
