/**
 * Lightweight cookie helpers for client-side use.
 * - Safe encoding/decoding
 * - SameSite=Lax by default
 * - Secure flag when running over HTTPS
 * - Optional JSON helpers for consent storage
 */

export type ConsentState = {
  essential: true;
  analytics?: boolean;
  marketing?: boolean;
};

const isBrowser = (): boolean => typeof document !== 'undefined';

const getSecureFlag = (): boolean => {
  try {
    return typeof location !== 'undefined' && location.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get a cookie value by name.
 */
export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;

  const needle = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');
  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (part.startsWith(needle)) {
      const value = part.slice(needle.length);
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return undefined;
}

/**
 * Set a cookie value.
 * @param days Expiration in days (defaults to 180 days)
 */
export function setCookie(name: string, value: string, days: number = 180): void {
  if (!isBrowser()) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  const secure = getSecureFlag() ? '; Secure' : '';

  document.cookie =
    `${encodedName}=${encodedValue}` +
    `; Expires=${expires.toUTCString()}` +
    `; Path=/` +
    `; SameSite=Lax` +
    secure;
}

/**
 * Delete a cookie by name.
 */
export function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  const encodedName = encodeURIComponent(name);
  const secure = getSecureFlag() ? '; Secure' : '';
  document.cookie = `${encodedName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax${secure}`;
}

/**
 * Read a JSON cookie and parse it safely.
 */
export function getJsonCookie<T>(name: string): T | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/**
 * Stringify JSON and store it in a cookie.
 */
export function setJsonCookie(name: string, value: unknown, days?: number): void {
  try {
    setCookie(name, JSON.stringify(value), days);
  } catch {
    // If serialization fails, do nothing
  }
}

