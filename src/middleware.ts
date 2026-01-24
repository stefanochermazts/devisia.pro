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

  // If the header is missing, do not guess. Serve default (Italian) to avoid unstable redirects.
  if (!acceptLanguage.trim()) {
    return next();
  }
  
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

  // Check only the top preference to avoid mis-detecting users with multiple languages configured.
  const top = languages[0]?.locale || '';
  const prefersItalian = top.startsWith('it');

  // If Italian is preferred, serve the Italian version (root)
  if (prefersItalian) {
    return next();
  }

  // Otherwise, redirect to English version
  return Response.redirect(new URL('/en', url), 302);
});
