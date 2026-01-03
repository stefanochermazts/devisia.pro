import { defineMiddleware } from 'astro:middleware';

/**
 * Detects browser language and redirects to appropriate locale.
 * - If browser language is Italian (it, it-IT, it-CH, etc.), serves Italian version (/)
 * - Otherwise, redirects to English version (/en/)
 * Only intercepts root path (/) to avoid interfering with existing routes.
 */
export const onRequest = defineMiddleware((context, next) => {
  const { url, request } = context;
  
  // Only handle root path - let all other routes pass through
  if (url.pathname !== '/') {
    return next();
  }

  // Get Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Parse Accept-Language header to find preferred language
  // Format: "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      return { locale: locale.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Check if Italian is the preferred language
  const prefersItalian = languages.some(
    (lang) => lang.locale.startsWith('it')
  );

  // If Italian is preferred, serve the Italian version (root)
  if (prefersItalian) {
    return next();
  }

  // Otherwise, redirect to English version
  return Response.redirect(new URL('/en/', url), 302);
});
