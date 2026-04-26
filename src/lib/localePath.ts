/**
 * Path pairs for IT/EN when slugs are not symmetric.
 * Use with Layout's languageSwitchHref when the default /en + path is wrong.
 */
export const localePathPairs: Record<string, { it: string; en: string }> = {
  itHome: { it: '/', en: '/en' },
  cosa: { it: '/cosa-facciamo', en: '/en/what-we-do' },
  metodo: { it: '/metodo', en: '/en/method' },
  ai: { it: '/ai-governata', en: '/en/governed-ai' },
  compliance: { it: '/compliance-auditabilita', en: '/en/compliance-auditability' },
  prodotti: { it: '/prodotti', en: '/en/products' },
  auditready: { it: '/prodotti/auditready', en: '/en/products/auditready' },
  company: { it: '/chi-siamo', en: '/en/about' },
  contatti: { it: '/contatti', en: '/en/contact' },
};

export function switchLocalePath(
  currentPath: string,
  from: 'it' | 'en'
): string | null {
  const n = currentPath.length > 1 ? currentPath.replace(/\/$/, '') : currentPath;
  for (const pair of Object.values(localePathPairs)) {
    if (from === 'it' && pair.it === n) return pair.en;
    if (from === 'en' && pair.en === n) return pair.it;
  }
  return null;
}

/**
 * Correct hreflang it/en URLs when slugs are not symmetric.
 */
export function getHreflangPaths(
  pathname: string
): { itPath: string; enPath: string } {
  const n = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  for (const pair of Object.values(localePathPairs)) {
    if (pair.it === n || pair.en === n) {
      return { itPath: pair.it, enPath: pair.en };
    }
  }
  if (n.startsWith('/en')) {
    const stripped = n.replace(/^\/en(?=\/|$)/, '') || '/';
    return { itPath: stripped, enPath: n };
  }
  return { itPath: n, enPath: n === '/' ? '/en' : `/en${n}` };
}
