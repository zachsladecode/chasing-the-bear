import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Chasing the Bear',
    description: 'Notes on AI, software, and learning in public.',
    site: context.site,
    // CTB-011: items will be populated from Astro content collections
    items: [],
    customData: '<language>en-us</language>',
  });
}
