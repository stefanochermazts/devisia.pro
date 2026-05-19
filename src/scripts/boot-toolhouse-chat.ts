import { thLog } from './toolhouse-chat-debug';
import { initToolhouseChat } from './toolhouse-chat-ui';

function run(): void {
  thLog('boot run', {
    readyState: document.readyState,
    pathname: typeof location !== 'undefined' ? location.pathname : '',
  });
  const roots = Array.from(document.querySelectorAll('[data-toolhouse-chat]'));
  thLog(
    '[data-toolhouse-chat] roots found:',
    roots.length,
    roots.map((r) => ({
      layout: r.getAttribute('data-chat-layout'),
      tag: r.tagName,
    }))
  );
  const root = document.querySelector<HTMLElement>('[data-toolhouse-chat]');
  if (!root) {
    thLog('abort init: root element missing');
    return;
  }
  initToolhouseChat(root);
}

if (typeof document !== 'undefined') {
  thLog('boot script evaluated');
  if (document.readyState === 'loading') {
    thLog('defer until DOMContentLoaded');
    document.addEventListener(
      'DOMContentLoaded',
      () => run(),
      { once: true }
    );
  } else {
    run();
  }
}
