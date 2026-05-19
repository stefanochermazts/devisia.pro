/**
 * Chat UI client: streams Toolhouse agent replies via `/api/toolhouse-chat` proxy.
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { thLog } from './toolhouse-chat-debug';

marked.use({ breaks: true, gfm: true });

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (!(node instanceof HTMLAnchorElement)) return;
  if (node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

type ConsentEventType = 'accepted' | 'withdrawn';
type ConsentLocale = 'it' | 'en';
type ConsentSurface = 'widget' | 'standalone';

interface StoredConsent {
  consentId: string;
  acceptedAt: string;
  locale: ConsentLocale;
  surface: ConsentSurface;
  privacyPath: '/privacy' | '/en/privacy';
  consentTextVersion: string;
  aiDisclosureVersion: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface PendingConsentEvent {
  eventType: ConsentEventType;
  consentId: string;
}

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
  const consentPanel = root.querySelector<HTMLElement>('[data-toolhouse-chat-consent]');
  const consentCheckbox = root.querySelector<HTMLInputElement>('[data-toolhouse-chat-consent-checkbox]');
  const consentAccept = root.querySelector<HTMLButtonElement>('[data-toolhouse-chat-consent-accept]');
  const consentWithdraw = root.querySelector<HTMLButtonElement>('[data-toolhouse-chat-consent-withdraw]');

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
  const pageLang = (): 'it' | 'en' =>
    document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'it';
  const lang = pageLang();
  const surface: ConsentSurface = root.dataset.chatSurface === 'standalone' ? 'standalone' : 'widget';
  const privacyPath: StoredConsent['privacyPath'] =
    root.dataset.privacyPath === '/en/privacy' ? '/en/privacy' : '/privacy';
  const consentTextVersion = root.dataset.consentTextVersion || 'chat-consent-v1';
  const aiDisclosureVersion = root.dataset.aiDisclosureVersion || 'ai-disclosure-v1';
  const consentRequiredText =
    root.dataset.consentRequired ||
    (lang === 'en' ? 'Accept the privacy notice to use the chat.' : 'Accetta l’informativa privacy per usare la chat.');
  const consentRegisteringText =
    lang === 'en' ? 'Registering consent…' : 'Registrazione del consenso…';
  const consentRegisterError =
    lang === 'en'
      ? 'Unable to register consent. Please try again.'
      : 'Impossibile registrare il consenso. Riprova.';
  const consentWithdrawError =
    lang === 'en'
      ? 'Consent was withdrawn locally, but the server log could not be updated.'
      : 'Il consenso è stato revocato localmente, ma il registro server non è stato aggiornato.';
  const consentKey = `devisia-toolhouse-chat-consent-v2:${lang}`;
  const pendingConsentEventKey = `devisia-toolhouse-chat-consent-pending-v1:${lang}`;

  const readStoredConsent = (): StoredConsent | null => {
    try {
      const raw = window.localStorage.getItem(consentKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredConsent>;
      if (
        !parsed ||
        !parsed.consentId ||
        !UUID_RE.test(parsed.consentId) ||
        parsed.locale !== lang ||
        parsed.surface !== surface ||
        parsed.privacyPath !== privacyPath ||
        parsed.consentTextVersion !== consentTextVersion ||
        parsed.aiDisclosureVersion !== aiDisclosureVersion
      ) {
        window.localStorage.removeItem(consentKey);
        return null;
      }
      return parsed as StoredConsent;
    } catch {
      return null;
    }
  };

  const storeConsent = (nextConsentId: string): void => {
    try {
      const value: StoredConsent = {
        consentId: nextConsentId,
        acceptedAt: new Date().toISOString(),
        locale: lang,
        surface,
        privacyPath,
        consentTextVersion,
        aiDisclosureVersion,
      };
      window.localStorage.setItem(consentKey, JSON.stringify(value));
    } catch {
      // If storage is blocked, consent still holds for this page lifecycle.
    }
  };

  const removeStoredConsent = (): void => {
    try {
      window.localStorage.removeItem(consentKey);
    } catch {
      // Storage may be blocked; the in-memory flag is still reset below.
    }
  };

  const readPendingConsentEvent = (): PendingConsentEvent | null => {
    try {
      const raw = window.localStorage.getItem(pendingConsentEventKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<PendingConsentEvent>;
      if (
        (parsed.eventType !== 'accepted' && parsed.eventType !== 'withdrawn') ||
        !parsed.consentId ||
        !UUID_RE.test(parsed.consentId)
      ) {
        window.localStorage.removeItem(pendingConsentEventKey);
        return null;
      }
      return parsed as PendingConsentEvent;
    } catch {
      return null;
    }
  };

  const storePendingConsentEvent = (event: PendingConsentEvent): void => {
    try {
      window.localStorage.setItem(pendingConsentEventKey, JSON.stringify(event));
    } catch {
      // Best-effort retry support only.
    }
  };

  const clearPendingConsentEvent = (): void => {
    try {
      window.localStorage.removeItem(pendingConsentEventKey);
    } catch {
      // Best-effort cleanup only.
    }
  };

  const createConsentId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    throw new Error('crypto.randomUUID is unavailable');
  };

  const registerConsentEvent = async (eventType: ConsentEventType, nextConsentId: string): Promise<void> => {
    const response = await fetch('/api/chat-consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        consentId: nextConsentId,
        locale: lang,
        surface,
        privacyPath,
        consentTextVersion,
        aiDisclosureVersion,
      }),
    });

    if (!response.ok) {
      throw new Error(`Consent event failed: ${response.status}`);
    }
  };

  const flushPendingConsentEvent = (): void => {
    const pending = readPendingConsentEvent();
    if (!pending) return;

    void registerConsentEvent(pending.eventType, pending.consentId)
      .then(() => clearPendingConsentEvent())
      .catch((error) => {
        console.error('Failed to flush pending chat consent event', error);
      });
  };

  /** Conversation id returned by Toolhouse after first POST. */
  let runId: string | null = null;
  let activeRequest: AbortController | null = null;

  const storedConsent = consentPanel ? readStoredConsent() : null;
  let consentId: string | null = storedConsent?.consentId ?? null;
  let consentAccepted = consentPanel ? Boolean(storedConsent) : true;

  const focusWithoutScrolling = (el: HTMLElement | null | undefined): void => {
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }
  };

  const resetConsentViewport = (alignPage = false): void => {
    if (!consentPanel || consentAccepted) return;
    consentPanel.scrollTop = 0;
    if (!widgetMode && alignPage) {
      consentPanel.scrollIntoView({ block: 'start', inline: 'nearest' });
    }
  };

  const focusConsentIntro = (alignPage = false): void => {
    resetConsentViewport(alignPage);
    focusWithoutScrolling(consentPanel ?? panel);
    resetConsentViewport();
  };

  const syncConsentUi = (): void => {
    const needsConsent = Boolean(consentPanel);
    if (consentPanel) consentPanel.hidden = consentAccepted;
    if (consentCheckbox) consentCheckbox.checked = consentAccepted ? true : consentCheckbox.checked;
    if (consentAccept) consentAccept.disabled = !consentAccepted && !consentCheckbox?.checked;
    if (consentWithdraw) consentWithdraw.hidden = !consentAccepted;
    thread.hidden = needsConsent && !consentAccepted;
    input.disabled = !consentAccepted;
    sendBtn.disabled = !consentAccepted;
  };

  syncConsentUi();

  if (!widgetMode && !consentAccepted) {
    requestAnimationFrame(() => focusConsentIntro(true));
  }

  flushPendingConsentEvent();

  consentCheckbox?.addEventListener('change', () => {
    if (consentAccept) consentAccept.disabled = !consentCheckbox.checked;
  });

  consentAccept?.addEventListener('click', async () => {
    if (!consentCheckbox?.checked) {
      consentCheckbox?.focus();
      return;
    }

    const nextConsentId = consentId ?? createConsentId();
    if (consentAccept) consentAccept.disabled = true;
    setStatus(consentRegisteringText);

    try {
      await registerConsentEvent('accepted', nextConsentId);
      clearPendingConsentEvent();
      consentId = nextConsentId;
      consentAccepted = true;
      storeConsent(nextConsentId);
      syncConsentUi();
      setStatus('');
      input.focus();
    } catch (error) {
      console.error('Failed to register chat consent', error);
      consentAccepted = false;
      if (consentAccept) consentAccept.disabled = !consentCheckbox.checked;
      setStatus(consentRegisterError);
    }
  });

  consentWithdraw?.addEventListener('click', () => {
    const withdrawnConsentId = consentId;
    consentAccepted = false;
    consentId = null;
    activeRequest?.abort();
    activeRequest = null;
    runId = null;
    removeStoredConsent();
    if (consentCheckbox) consentCheckbox.checked = false;
    input.value = '';
    thread.replaceChildren();
    syncConsentUi();
    setStatus('');
    requestAnimationFrame(() => focusConsentIntro(true));

    if (withdrawnConsentId) {
      void registerConsentEvent('withdrawn', withdrawnConsentId).catch((error) => {
        console.error('Failed to register chat consent withdrawal', error);
        storePendingConsentEvent({ eventType: 'withdrawn', consentId: withdrawnConsentId });
        setStatus(consentWithdrawError);
      });
    }
  });

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
        if (consentAccepted) input.focus();
        else focusConsentIntro();
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

  const statusEl = root.querySelector<HTMLElement>('[data-toolhouse-chat-status]');

  const setBusy = (busy: boolean): void => {
    input.disabled = busy || !consentAccepted;
    sendBtn.disabled = busy || !consentAccepted;
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

    if (!consentAccepted) {
      setStatus(consentRequiredText);
      focusConsentIntro(!widgetMode);
      return;
    }

    const text = input.value.trim();
    if (!text) return;

    setStatus('');
    appendUserMessage(text);
    input.value = '';
    scrollThread();

    const { body: assistantBody, loading } = appendAssistantPlaceholder();
    scrollThread();

    setBusy(true);
    const waitMsg = lang === 'en' ? 'Waiting for response…' : 'In attesa della risposta…';
    const streamMsg = lang === 'en' ? 'Receiving content…' : 'Ricezione contenuto…';

    setStatus(waitMsg);

    let accumulated = '';

    try {
      activeRequest = new AbortController();
      const response = await fetch('/api/toolhouse-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-devisia-chat-consent-id': consentId || '',
        },
        body: JSON.stringify({ message: text, ...(runId ? { runId } : {}) }),
        signal: activeRequest.signal,
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
      assistantBody.setAttribute('aria-live', 'polite');
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

      if (!accumulated.trim()) {
        loading.remove();
        setStatus('');
        const emptyMsg = lang === 'en' ? '(Empty response)' : '(Nessun contenuto nella risposta)';
        assistantBody.innerHTML = `<p class="ds-chat-muted">${escapeText(emptyMsg)}</p>`;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError' && !consentAccepted) {
        return;
      }
      loading.remove();
      const msg = e instanceof Error ? e.message : 'Request failed';
      assistantBody.innerHTML = `<p class="ds-chat-error">${escapeText(msg)}</p>`;
      setStatus('');
    } finally {
      activeRequest = null;
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
