const LOCAL_CHAT_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

export function isLocalChatDevRequest(request: Request): boolean {
  if (import.meta.env.DEV) return true;

  try {
    const hostname = new URL(request.url).hostname.toLowerCase();
    return LOCAL_CHAT_HOSTNAMES.has(hostname);
  } catch {
    return false;
  }
}
