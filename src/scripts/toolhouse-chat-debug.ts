/** Dev-only console tracing (stripped/minified in prod where possible). */
const enabled =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true;

const prefix = '[toolhouse-chat]';

export function thLog(...args: unknown[]): void {
  if (!enabled) return;
  console.log(prefix, ...args);
}
