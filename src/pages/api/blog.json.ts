import { getCollection } from 'astro:content';

type BlogLang = 'it' | 'en';

const slugFromId = (id: string) => id.replace(/^(it|en)\//, '');

export const GET = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  const langParam = (url.searchParams.get('lang') ?? 'it').toLowerCase();
  const lang: BlogLang = langParam === 'en' ? 'en' : 'it';

  const offsetRaw = Number.parseInt(url.searchParams.get('offset') ?? '0', 10);
  const limitRaw = Number.parseInt(url.searchParams.get('limit') ?? '8', 10);

  const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? offsetRaw : 0;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 24) : 8;

  const collection = lang === 'en' ? 'blogEn' : 'blogIt';
  const allPosts = await getCollection(collection);

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
  });

  const total = sortedPosts.length;
  const slice = sortedPosts.slice(offset, offset + limit);
  const nextOffset = Math.min(total, offset + slice.length);

  const payload = {
    lang,
    total,
    offset,
    limit,
    nextOffset,
    hasMore: nextOffset < total,
    posts: slice.map((post) => ({
      id: post.id,
      slug: slugFromId(post.id),
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate).toISOString(),
      heroImage: post.data.heroImage ?? null,
      author: post.data.author,
      tags: post.data.tags ?? [],
    })),
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
};

