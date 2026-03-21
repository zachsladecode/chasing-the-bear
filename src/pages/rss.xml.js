import rss from '@astrojs/rss';
import { publishedPosts } from '../data/posts';

export async function GET(context) {
  return rss({
    title: 'Chasing the Bear',
    description: 'Notes on AI, software, and learning in public.',
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.summary,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
