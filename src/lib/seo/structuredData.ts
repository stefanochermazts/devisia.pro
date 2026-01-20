export type JsonLd = Record<string, unknown>;

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function absUrl(site: URL, urlOrPath?: string | null): string | undefined {
  if (!urlOrPath) return undefined;
  if (isAbsoluteUrl(urlOrPath)) return urlOrPath;
  return new URL(urlOrPath, site).toString();
}

export function organizationJsonLd(site: URL): JsonLd {
  const url = site.toString().replace(/\/$/, '');
  const logo = absUrl(site, '/images/monogramma.svg') ?? url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: 'Devisia',
    url,
    logo,
    email: 'info@devisia.it',
    sameAs: ['https://github.com/stefanochermazts'],
  };
}

export function websiteJsonLd(site: URL, lang: 'it' | 'en'): JsonLd {
  const url = site.toString().replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    url,
    name: 'Devisia',
    inLanguage: lang,
    publisher: { '@id': `${url}#organization` },
  };
}

export function webPageJsonLd(params: {
  site: URL;
  lang: 'it' | 'en';
  url: string;
  name: string;
  description?: string | null;
}): JsonLd {
  const siteUrl = params.site.toString().replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${params.url}#webpage`,
    url: params.url,
    name: params.name,
    description: params.description ?? undefined,
    inLanguage: params.lang,
    isPartOf: { '@id': `${siteUrl}#website` },
    about: { '@id': `${siteUrl}#organization` },
  };
}

export function breadcrumbListJsonLd(params: {
  site: URL;
  items: Array<{ name: string; url: string }>;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: params.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absUrl(params.site, item.url) ?? item.url,
    })),
  };
}

export function blogPostingJsonLd(params: {
  site: URL;
  lang: 'it' | 'en';
  url: string;
  headline: string;
  description: string;
  datePublished: string; // ISO
  authorName: string;
  image?: string | null;
}): JsonLd {
  const siteUrl = params.site.toString().replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
    headline: params.headline,
    description: params.description,
    image: absUrl(params.site, params.image),
    datePublished: params.datePublished,
    author: { '@type': 'Person', name: params.authorName },
    publisher: { '@id': `${siteUrl}#organization` },
    inLanguage: params.lang,
  };
}

export function softwareApplicationJsonLd(params: {
  site: URL;
  lang: 'it' | 'en';
  url: string;
  name: string;
  description: string;
  websiteUrl: string;
  image?: string | null;
  keywords?: string[];
}): JsonLd {
  const siteUrl = params.site.toString().replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    description: params.description,
    url: params.websiteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    image: absUrl(params.site, params.image),
    keywords: params.keywords?.length ? params.keywords.join(', ') : undefined,
    inLanguage: params.lang,
    publisher: { '@id': `${siteUrl}#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
  };
}

