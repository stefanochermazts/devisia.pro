import { formatForWhatsApp, formatPreview, parseAll } from '../lib/padelParser';

type Strings = {
  btnAnalyze: string;
  btnCopy: string;
  btnClear: string;
  copied: string;
  copyFallback: string;
  emptyOutput: string;
  badgeIncomplete: string;
  labelLevel: string;
};

function getStrings(): Strings {
  const w = window as unknown as { __PADEL_STRINGS__?: Partial<Strings> };
  const s = w.__PADEL_STRINGS__ || {};
  return {
    btnAnalyze: s.btnAnalyze || 'Analizza richieste',
    btnCopy: s.btnCopy || 'Copia negli appunti',
    btnClear: s.btnClear || 'Pulisci',
    copied: s.copied || 'Copiato',
    copyFallback: s.copyFallback || 'Selezionato — copia manualmente',
    emptyOutput: s.emptyOutput || 'Nessun evento trovato.',
    badgeIncomplete: s.badgeIncomplete || 'incompleto',
    labelLevel: s.labelLevel || 'Livello',
  };
}

const escapeHtml = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const $ = (sel: string) => document.querySelector(sel);

function ensureTrailingDoubleNewline(input: HTMLTextAreaElement | null) {
  if (!input) return;
  const v = String(input.value || '');
  if (!v) return;
  if (/\n{2,}$/.test(v)) return;
  input.value = v + (v.endsWith('\n') ? '\n' : '\n\n');
  try {
    input.selectionStart = input.selectionEnd = input.value.length;
  } catch {
    /* noop */
  }
}

function init() {
  const STRINGS = getStrings();

  const root = $('[data-padel-root]');
  if (!root) return;

  const input = $('[data-padel-input]') as HTMLTextAreaElement | null;
  const output = $('[data-padel-output]') as HTMLTextAreaElement | null;
  const status = $('[data-padel-status]') as HTMLElement | null;
  const btnAnalyze = $('[data-padel-analyze]') as HTMLButtonElement | null;
  const btnCopy = $('[data-padel-copy]') as HTMLButtonElement | null;
  const btnClear = $('[data-padel-clear]') as HTMLButtonElement | null;
  const preview = $('[data-padel-preview]') as HTMLDetailsElement | null;
  const cards = $('[data-padel-cards]') as HTMLElement | null;
  const unrec = $('[data-padel-unrecognized]') as HTMLDetailsElement | null;
  const unrecBody = $('[data-padel-unrecognized-body]') as HTMLElement | null;

  const setStatus = (msg: string) => {
    if (!status) return;
    status.textContent = msg || '';
  };

  const renderCards = (previewEvents: Array<any>) => {
    if (!cards) return;
    cards.innerHTML = '';
    previewEvents.forEach((e) => {
      const div = document.createElement('div');
      div.className = 'padel-tool__card';
      div.innerHTML = `
        <div class="padel-tool__card-top">
          <strong>${escapeHtml(e.whenLabel)}</strong>
          ${e.incomplete ? `<span class="padel-tool__badge padel-tool__badge--warn">${escapeHtml(STRINGS.badgeIncomplete)}</span>` : ``}
        </div>
        <div>${escapeHtml(e.venueLabel)}${e.courtLabel ? ` <span class="padel-tool__muted">– ${escapeHtml(e.courtLabel)}</span>` : ``}</div>
        <div class="padel-tool__muted">
          ${e.levelLabel ? `${escapeHtml(STRINGS.labelLevel)} ${escapeHtml(e.levelLabel)} · ` : ``}✅${escapeHtml(
            e.confirmedCount
          )} ❓${escapeHtml(e.openSlots)}
        </div>
        ${
          e.url
            ? `<a class="padel-tool__link" href="${escapeHtml(e.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                e.url
              )}</a>`
            : ``
        }
      `;
      cards.appendChild(div);
    });
  };

  const analyze = () => {
    setStatus('');
    const text = String(input?.value || '');
    const { events, unparsedBlocks } = parseAll(text);

    const outputText = events.length ? formatForWhatsApp(events) : STRINGS.emptyOutput;
    if (output) output.value = outputText;

    renderCards(formatPreview(events));
    if (preview) preview.open = true;

    if (unrecBody) unrecBody.textContent = unparsedBlocks.join('\n\n---\n\n');
    if (unrec) unrec.open = Boolean(unparsedBlocks.length);

    // Mobile UX: close keyboard then scroll.
    try {
      input?.blur?.();
      (document.activeElement as HTMLElement | null)?.blur?.();
    } catch {
      /* noop */
    }

    // Scroll to output for quick copy.
    (output || preview || root as any)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  const copyOutput = async () => {
    const text = String(output?.value || '');
    if (!text) return;
    setStatus('');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setStatus(STRINGS.copied);
        const prev = btnCopy?.textContent;
        if (btnCopy) btnCopy.textContent = STRINGS.copied;
        setTimeout(() => {
          if (btnCopy) btnCopy.textContent = prev || STRINGS.btnCopy;
          setStatus('');
        }, 1500);
        return;
      }
    } catch {
      // fall through to fallback
    }

    // Fallback: select text so user can copy manually.
    try {
      output?.focus?.();
      output?.select?.();
      setStatus(STRINGS.copyFallback);
      setTimeout(() => setStatus(''), 1500);
    } catch {
      /* noop */
    }
  };

  input?.addEventListener('paste', () => {
    setTimeout(() => ensureTrailingDoubleNewline(input), 0);
  });

  btnAnalyze?.addEventListener('click', () => analyze());

  btnClear?.addEventListener('click', () => {
    if (input) input.value = '';
    if (output) output.value = '';
    if (cards) cards.innerHTML = '';
    if (unrecBody) unrecBody.textContent = '';
    if (preview) preview.open = false;
    if (unrec) unrec.open = false;
    setStatus('');
    input?.focus?.();
  });

  btnCopy?.addEventListener('click', () => void copyOutput());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

