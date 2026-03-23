import { useState } from 'preact/hooks';
import type { TreeNode, CategoryNode, SeriesNode, PostNode } from '../lib/buildTree';

interface Props {
  tree: TreeNode[];
  currentSlug?: string;
}

function PostItem({ node, currentSlug }: { node: PostNode; currentSlug?: string }) {
  const isActive = node.slug === currentSlug;
  return (
    <li>
      <a
        href={`/blog/${node.slug}`}
        class={`tree-post${isActive ? ' tree-post--active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span class="tree-icon" aria-hidden="true">{isActive ? '►' : '□'}</span>
        <span class="tree-label">{node.label}</span>
      </a>
    </li>
  );
}

function SeriesItem({
  node,
  currentSlug,
  defaultOpen,
}: {
  node: SeriesNode;
  currentSlug?: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <li>
      <button
        class="tree-folder"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span class="tree-icon" aria-hidden="true">{open ? 'v' : '>'}</span>
        <span class="tree-label">{node.label}/</span>
      </button>
      {open && (
        <ul class="tree-children">
          {node.children.map((post) => (
            <PostItem key={post.slug} node={post} currentSlug={currentSlug} />
          ))}
        </ul>
      )}
    </li>
  );
}

function CategoryItem({
  node,
  currentSlug,
  defaultOpen,
}: {
  node: CategoryNode;
  currentSlug?: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <li>
      <button
        class="tree-folder tree-folder--category"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span class="tree-icon" aria-hidden="true">{open ? 'v' : '>'}</span>
        <span class="tree-label">{node.label}/</span>
      </button>
      {open && (
        <ul class="tree-children">
          {node.children.map((child) =>
            child.type === 'series' ? (
              <SeriesItem
                key={child.label}
                node={child}
                currentSlug={currentSlug}
                defaultOpen={child.children.some((p) => p.slug === currentSlug)}
              />
            ) : (
              <PostItem key={child.slug} node={child} currentSlug={currentSlug} />
            )
          )}
        </ul>
      )}
    </li>
  );
}

export default function DirTree({ tree, currentSlug }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function containsSlug(node: CategoryNode): boolean {
    return node.children.some((child) =>
      child.type === 'series'
        ? child.children.some((p) => p.slug === currentSlug)
        : child.slug === currentSlug
    );
  }

  return (
    <>
      <button
        class="sidebar-toggle"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      <nav
        class={`dir-tree${mobileOpen ? ' dir-tree--open' : ''}`}
        aria-label="Site navigation"
      >
        <p class="tree-root">~/chasing-the-bear</p>
        <ul class="tree-root-list">
          {tree.map((category) => (
            <CategoryItem
              key={category.label}
              node={category}
              currentSlug={currentSlug}
              defaultOpen={containsSlug(category) || tree.length === 1}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}
