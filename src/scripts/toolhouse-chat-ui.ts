/**
 * Chat UI client: streams Toolhouse agent replies via `/api/toolhouse-chat` proxy.
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { thLog } from './toolhouse-chat-debug';

marked.use({ breaks: true, gfm: true });

function markdownToSafeHtml(markdown: string): string {
  const html = marked.parse(markdown.trimEnd(), { async: false }) as string;
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Streams response body — supports SSE (`text/event-stream`) or plain text chunks.
 */
async function consumeAssistantStream(response: Response, onDelta: (chunk: string) => void): Promise<void> {
  const ct = response.headers.get('content-type') || '';
  const isSSE = ct.includes('text/event-stream');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();

  if (!isSSE) {
    let streamDone = false;
    while (!streamDone) {
      const { value, done } = await reader.read();
      const chunk = decoder.decode(value ?? new Uint8Array(), { stream: !done });
      if (chunk) onDelta(chunk);
      streamDone = done;
    }
    const tail = decoder.decode();
    if (tail) onDelta(tail);
    return;
  }

  let buffer = '';
  let eventLines: string[] = [];

  const flushEvent = (): void => {
    if (!eventLines.length) return;
    const payload = eventLines.join('\n').trimEnd();
    eventLines = [];
    if (payload && payload !== '[DONE]') onDelta(payload);
  };

  let streamFinished = false;
  while (!streamFinished) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

    while (buffer.includes('\n')) {
      const idx = buffer.indexOf('\n');
      const line = buffer.slice(0, idx).replace(/\r$/, '');
      buffer = buffer.slice(idx + 1);
      if (line === '') flushEvent();
      else if (line.startsWith('data:')) eventLines.push(line.slice(5).trimStart());
    }

    streamFinished = done;
  }

  buffer += decoder.decode();
  const last = buffer.replace(/\r$/, '').trimEnd();
  if (last.startsWith('data:')) eventLines.push(last.slice(5).trimStart());
  flushEvent();
}

export function initToolhouseChat(root: HTMLElement | null): void {
  thLog('initToolhouseChat', { root: Boolean(root), hasFetch: typeof fetch !== 'undefined' });
  if (!root || typeof fetch === 'undefined') {
    thLog('init abort: missing root or fetch');
    return;
  }

  const form = root.querySelector<HTMLFormElement>('[data-toolhouse-chat-form]');
  const input = root.querySelector<HTMLTextAreaElement>('[data-toolhouse-chat-input]');
  const sendBtn = root.querySelector<HTMLButtonElement>('[data-toolhouse-chat-send]');
  const thread = root.querySelector<HTMLElement>('[data-toolhouse-chat-thread]');

  if (!form || !input || !sendBtn || !thread) {
    const missingPieces = [];
    if (!form) missingPieces.push('form');
    if (!input) missingPieces.push('input');
    if (!sendBtn) missingPieces.push('sendBtn');
    if (!thread) missingPieces.push('thread');
    thLog('init abort: missing DOM refs', missingPieces.join(', '));
    return;
  }

  const toggle = root.querySelector<HTMLButtonElement>('[data-toolhouse-chat-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-toolhouse-chat-panel]');
  const backdrop = root.querySelector<HTMLElement>('[data-toolhouse-chat-backdrop]');
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-toolhouse-chat-close]');
  const widgetMode = Boolean(toggle && panel && backdrop);
  thLog('widget refs', {
    widgetMode,
    toggle: Boolean(toggle),
    panel: Boolean(panel),
    backdrop: Boolean(backdrop),
    closeBtn: Boolean(closeBtn),
  });

  let lastFocused: HTMLElement | null = null;

  const isCompactViewport = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 47.99rem)').matches;

  const setBodyLock = (lock: boolean): void => {
    if (!lock || !isCompactViewport()) {
      document.documentElement.removeAttribute('data-chat-widget-lock');
      return;
    }
    document.documentElement.setAttribute('data-chat-widget-lock', '');
  };

  const panelIsOpen = (): boolean => (panel ? !panel.hidden : false);

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getPanelFocusable = (): HTMLElement[] => {
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (el) => el.getClientRects().length > 0 && el.getAttribute('aria-hidden') !== 'true'
    );
  };

  const openPanel = (): void => {
    if (!widgetMode || !panel || !backdrop || !toggle) return;
    const ae = document.activeElement;
    lastFocused = ae instanceof HTMLElement && ae !== document.body && ae.isConnected ? ae : null;
    panel.hidden = false;
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    setBodyLock(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        input.focus();
      });
    });
  };

  const closePanel = (): void => {
    if (!widgetMode || !panel || !backdrop || !toggle) return;
    panel.hidden = true;
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    setBodyLock(false);
    if (lastFocused && document.documentElement.contains(lastFocused)) {
      try {
        lastFocused.focus();
      } catch {
        toggle.focus();
      }
    } else {
      toggle.focus();
    }
    lastFocused = null;
  };

  if (widgetMode && toggle && panel && backdrop) {
    thLog('attaching FAB toggle handlers');

    toggle.addEventListener('click', () => {
      const open = panelIsOpen();
      thLog('FAB click', open ? 'close' : 'open');
      open ? closePanel() : openPanel();
    });
    closeBtn?.addEventListener('click', () => closePanel());
    backdrop.addEventListener('click', () => closePanel());

    panel.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Tab') return;

      const focusable = getPanelFocusable();
      if (!focusable.length) {
        ev.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (ev.shiftKey && (active === first || !panel.contains(active))) {
        ev.preventDefault();
        last.focus();
        return;
      }

      if (!ev.shiftKey && active === last) {
        ev.preventDefault();
        first.focus();
      }
    });

    document.addEventListener(
      'keydown',
      (ev) => {
        if (ev.key === 'Escape' && panelIsOpen()) {
          ev.preventDefault();
          closePanel();
        }
      },
      true
    );

    window.addEventListener(
      'resize',
      () => {
        setBodyLock(panelIsOpen());
      },
      { passive: true }
    );
  }

  /** Conversation id returned by Toolhouse after first POST. */
  let runId: string | null = null;

  const statusEl = root.querySelector<HTMLElement>('[data-toolhouse-chat-status]');

  const setBusy = (busy: boolean): void => {
    input.disabled = busy;
    sendBtn.disabled = busy;
    form.setAttribute('aria-busy', busy ? 'true' : 'false');
  };

  const setStatus = (text: string): void => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.hidden = !text.trim();
  };

  const escapeText = (s: string): string => {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  };

  const pageLang = (): 'it' | 'en' =>
    document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'it';

  const appendUserMessage = (text: string): void => {
    const wrap = document.createElement('div');
    wrap.className = 'ds-chat-msg ds-chat-msg--user';
    wrap.innerHTML = `<div class="ds-chat-bubble">${escapeText(text)}</div>`;
    thread.appendChild(wrap);
  };

  const appendAssistantPlaceholder = (): { body: HTMLElement; loading: HTMLElement } => {
    const loadingLabel = pageLang() === 'en' ? 'Devisia is writing' : 'Devisia sta scrivendo';
    const wrap = document.createElement('div');
    wrap.className = 'ds-chat-msg ds-chat-msg--assistant';

    const loading = document.createElement('div');
    loading.className = 'ds-chat-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-label', loadingLabel);
    loading.innerHTML =
      '<span class="ds-chat-loading-dot" aria-hidden="true"></span><span class="ds-chat-loading-dot" aria-hidden="true"></span><span class="ds-chat-loading-dot" aria-hidden="true"></span>';

    const body = document.createElement('div');
    body.className = 'ds-chat-bubble ds-chat-bubble--md ds-chat-md';

    wrap.appendChild(loading);
    wrap.appendChild(body);
    thread.appendChild(wrap);

    return { body, loading };
  };

  const scrollThread = (): void => {
    thread.scrollTop = thread.scrollHeight;
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    setStatus('');
    appendUserMessage(text);
    input.value = '';
    scrollThread();

    const { body: assistantBody, loading } = appendAssistantPlaceholder();
    scrollThread();

    setBusy(true);
    const lang = pageLang();
    const waitMsg = lang === 'en' ? 'Waiting for response…' : 'In attesa della risposta…';
    const streamMsg = lang === 'en' ? 'Receiving content…' : 'Ricezione contenuto…';

    setStatus(waitMsg);

    let accumulated = '';

    try {
      const response = await fetch('/api/toolhouse-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, ...(runId ? { runId } : {}) }),
      });

      const nextRun = response.headers.get('x-toolhouse-run-id');
      if (nextRun) runId = nextRun;

      if (!response.ok) {
        const errSnippet = await response.text();
        loading.remove();
        let msg = `${response.status} ${response.statusText}`;
        try {
          const parsed = JSON.parse(errSnippet) as { error?: string };
          if (parsed.error) msg = parsed.error;
        } catch {
          if (errSnippet.trim()) msg = `${msg}: ${errSnippet.slice(0, 280)}`;
        }
        assistantBody.innerHTML = `<p class="ds-chat-error">${escapeText(msg)}</p>`;
        setStatus('');
        scrollThread();
        return;
      }

      setStatus(streamMsg);

      let firstChunk = true;
      await consumeAssistantStream(response, (delta) => {
        if (firstChunk) {
          setStatus('');
          loading.remove();
          firstChunk = false;
        }
        accumulated += delta;
        assistantBody.innerHTML = markdownToSafeHtml(accumulated);
        scrollThread();
      });

      assistantBody.setAttribute('aria-live', 'polite');

      if (!accumulated.trim()) {
        loading.remove();
        setStatus('');
        const emptyMsg = lang === 'en' ? '(Empty response)' : '(Nessun contenuto nella risposta)';
        assistantBody.innerHTML = `<p class="ds-chat-muted">${escapeText(emptyMsg)}</p>`;
      }
    } catch (e) {
      loading.remove();
      const msg = e instanceof Error ? e.message : 'Request failed';
      assistantBody.innerHTML = `<p class="ds-chat-error">${escapeText(msg)}</p>`;
      setStatus('');
    } finally {
      setBusy(false);
      setStatus('');
      scrollThread();
    }
  });

  /** Enter submits; Shift+Enter newline */
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      form.requestSubmit();
    }
  });

  thLog('ready: composer + FAB listeners wired');
}
