import type { CollectionEntry } from 'astro:content';

export type PostNode = {
  type: 'post';
  label: string;
  slug: string;
};

export type SeriesNode = {
  type: 'series';
  label: string;
  children: PostNode[];
};

export type CategoryNode = {
  type: 'category';
  label: string;
  children: (SeriesNode | PostNode)[];
};

export type TreeNode = CategoryNode;

export function buildTree(posts: CollectionEntry<'blog'>[]): TreeNode[] {
  const categoryMap = new Map<string, Map<string, PostNode[]> | PostNode[]>();

  const sorted = [...posts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  for (const post of sorted) {
    const category = post.data.category;
    const series = post.data.series;
    const node: PostNode = {
      type: 'post',
      label: post.data.title,
      slug: post.id,
    };

    if (!categoryMap.has(category)) {
      categoryMap.set(category, series ? new Map() : []);
    }

    const bucket = categoryMap.get(category)!;

    if (series) {
      const seriesMap = bucket instanceof Map ? bucket : new Map<string, PostNode[]>();
      if (!categoryMap.has(category) || !(categoryMap.get(category) instanceof Map)) {
        categoryMap.set(category, seriesMap);
      }
      if (!seriesMap.has(series)) seriesMap.set(series, []);
      seriesMap.get(series)!.push(node);
    } else {
      if (Array.isArray(bucket)) {
        bucket.push(node);
      } else {
        // Category had series before; add as loose post under a pseudo-series
        bucket.set('__loose__', [...(bucket.get('__loose__') ?? []), node]);
      }
    }
  }

  const tree: TreeNode[] = [];

  for (const [category, bucket] of categoryMap) {
    const children: (SeriesNode | PostNode)[] = [];

    if (Array.isArray(bucket)) {
      children.push(...bucket);
    } else {
      for (const [seriesLabel, seriesPosts] of bucket) {
        if (seriesLabel === '__loose__') {
          children.push(...seriesPosts);
        } else {
          children.push({ type: 'series', label: seriesLabel, children: seriesPosts });
        }
      }
    }

    tree.push({ type: 'category', label: category, children });
  }

  // Sort categories alphabetically
  tree.sort((a, b) => a.label.localeCompare(b.label));

  return tree;
}
