// LinkedIn Post Formatter (100% client-side, no network, no deps)
// Loads strings from window.__LINKEDIN_STRINGS__ set by Astro component.

const STRINGS = (() => {
  const s = (globalThis && globalThis.__LINKEDIN_STRINGS__) || {};
  return {
    lang: s.lang || 'it',
    btnFormat: s.btnFormat || 'Formatta',
    btnCopy: s.btnCopy || 'Copia testo formattato',
    btnReset: s.btnReset || 'Reset',
    copied: s.copied || 'Copiato',
    copyFallback: s.copyFallback || 'Selezionato — copia manualmente',
    hookGood: s.hookGood || 'Buona chiarezza',
    hookGeneric: s.hookGeneric || 'Apertura troppo generica',
    hookMissingContext: s.hookMissingContext || 'Manca contesto concreto',
    toneClean: s.toneClean || 'Tono pulito',
    toneIssues: s.toneIssues || 'frasi vaghe/marketingese trovate',
    labelFormatter: s.labelFormatter || 'Formatter',
    labelHookCheck: s.labelHookCheck || 'Hook check',
    labelToneCheck: s.labelToneCheck || 'Tone check',
    // AI analysis
    btnAiAnalyze: s.btnAiAnalyze || 'Analisi AI',
    aiLoading: s.aiLoading || 'Analisi in corso...',
    aiError: s.aiError || 'Analisi non disponibile',
    aiVerdict_good: s.aiVerdict_good || 'Buono',
    aiVerdict_generic: s.aiVerdict_generic || 'Generico',
    aiVerdict_weak: s.aiVerdict_weak || 'Debole',
    aiSuggestionLabel: s.aiSuggestionLabel || 'Suggerimento',
    aiToneScore: s.aiToneScore || 'Punteggio',
  };
})();

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ────────────────────────────────────────────────────
// UNICODE TEXT STYLING (LinkedIn-compatible)
// ────────────────────────────────────────────────────
// LinkedIn doesn't support HTML/Markdown formatting.
// The only way to get bold/italic is to use Unicode
// Mathematical Sans-Serif character ranges.

// Helper: build a char-map from normal ASCII to a Unicode block.
function buildCharMap(upperStart, lowerStart, digitStart) {
  const map = {};
  // A-Z
  for (let i = 0; i < 26; i++) {
    map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
  }
  // a-z
  for (let i = 0; i < 26; i++) {
    map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
  }
  // 0-9 (only bold has digit variants)
  if (digitStart != null) {
    for (let i = 0; i < 10; i++) {
      map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitStart + i);
    }
  }
  return map;
}

// Mathematical Sans-Serif Bold: U+1D5D4 (A) / U+1D5EE (a) / U+1D7EC (0)
const BOLD_MAP = buildCharMap(0x1D5D4, 0x1D5EE, 0x1D7EC);
// Mathematical Sans-Serif Italic: U+1D608 (A) / U+1D622 (a) — no digits
const ITALIC_MAP = buildCharMap(0x1D608, 0x1D622, null);
// Mathematical Sans-Serif Bold Italic: U+1D63C (A) / U+1D656 (a) — no digits
const BOLD_ITALIC_MAP = buildCharMap(0x1D63C, 0x1D656, null);

function toUnicodeStyle(text, charMap) {
  let out = '';
  for (const ch of text) {
    out += charMap[ch] || ch;
  }
  return out;
}

// Replaces the selected text in a textarea with `replacement`,
// or inserts `insertion` at cursor if no selection.
function replaceSelection(textarea, replaceFn, insertText) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? start;
  const val = textarea.value;

  if (start !== end) {
    // There is a selection — transform it
    const selected = val.slice(start, end);
    const transformed = replaceFn(selected);
    textarea.value = val.slice(0, start) + transformed + val.slice(end);
    // Place cursor after the inserted text
    const newPos = start + transformed.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
  } else {
    // No selection — insert text at cursor
    textarea.value = val.slice(0, start) + insertText + val.slice(end);
    const newPos = start + insertText.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
  }

  textarea.focus();
}

// ────────────────────────────────────────────────────
// FORMATTER
// ────────────────────────────────────────────────────

// Preserve URLs, emails, @mentions, #hashtags by replacing them with tokens, then restoring.
const TOKEN_RE = /(?:https?:\/\/[^\s]+|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|@[\w.]+|#[\w]+)/g;

function tokenize(text) {
  const tokens = [];
  let idx = 0;
  const replaced = text.replace(TOKEN_RE, (match) => {
    const placeholder = `\x00T${idx}\x00`;
    tokens.push({ placeholder, value: match });
    idx++;
    return placeholder;
  });
  return { replaced, tokens };
}

function detokenize(text, tokens) {
  let out = text;
  for (const t of tokens) {
    out = out.split(t.placeholder).join(t.value);
  }
  return out;
}

function formatText(raw) {
  const text = String(raw || '');
  if (!text.trim()) return '';

  const { replaced, tokens } = tokenize(text);

  let out = replaced;

  // Trim trailing spaces per line
  out = out.replace(/[ \t]+$/gm, '');

  // Collapse 3+ consecutive newlines into max 2
  out = out.replace(/\n{3,}/g, '\n\n');

  // Bullet normalization: leading "-" or "*" (at start of line) → "•"
  out = out.replace(/^[ \t]*[-*][ \t]+/gm, '• ');

  // Em dash normalization: " -- " or " - " between words → " — "
  // But NOT inside tokens (already extracted). Also avoid breaking bullet lines.
  out = out.replace(/(?<=\S) +--? +(?=\S)/g, ' — ');

  // Trim leading/trailing whitespace
  out = out.trim();

  return detokenize(out, tokens);
}

// ────────────────────────────────────────────────────
// HOOK CHECK
// ────────────────────────────────────────────────────

const GENERIC_OPENERS_IT = [
  /^oggi\b/i,
  /^negli ultimi\b/i,
  /^in questo post\b/i,
  /^oggi voglio\b/i,
  /^vi racconto\b/i,
  /^volevo condividere\b/i,
];
const GENERIC_OPENERS_EN = [
  /^today\b/i,
  /^in this post\b/i,
  /^lately\b/i,
  /^i wanted to share\b/i,
  /^i want to talk\b/i,
];

function checkHook(text) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const first2 = lines.slice(0, 2);
  if (first2.length === 0) return { label: '', type: 'none' };

  const firstLine = first2[0];

  // Check generic openings
  const openers = STRINGS.lang === 'en' ? GENERIC_OPENERS_EN : GENERIC_OPENERS_IT;
  for (const re of openers) {
    if (re.test(firstLine)) {
      return { label: STRINGS.hookGeneric, type: 'warn' };
    }
  }

  // Check missing context: no concrete noun heuristic (no numbers, very short, no capital-word entity)
  const combined = first2.join(' ');
  const hasNumber = /\d/.test(combined);
  const hasProperNoun = /[A-Z][a-z]{2,}/.test(combined); // rough heuristic
  if (!hasNumber && !hasProperNoun && combined.length < 80) {
    return { label: STRINGS.hookMissingContext, type: 'warn' };
  }

  return { label: STRINGS.hookGood, type: 'good' };
}

// ────────────────────────────────────────────────────
// TONE CHECK
// ────────────────────────────────────────────────────

const MARKETINGESE_IT = [
  'innovativo',
  'rivoluzionario',
  'leader',
  'disruptive',
  'game changer',
  'soluzione definitiva',
  'best in class',
  'cutting edge',
  'all\'avanguardia',
  'eccellenza',
  'sinergia',
  'paradigma',
];

const MARKETINGESE_EN = [
  'innovative',
  'revolutionary',
  'leader',
  'disruptive',
  'game changer',
  'ultimate solution',
  'best in class',
  'cutting edge',
  'state of the art',
  'synergy',
  'paradigm',
  'leverage',
];

function checkTone(text) {
  const t = String(text || '').toLowerCase();
  const phrases = STRINGS.lang === 'en' ? MARKETINGESE_EN : MARKETINGESE_IT;
  const found = [];

  for (const phrase of phrases) {
    // Use word-boundary-aware matching
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    let m;
    while ((m = re.exec(t)) !== null) {
      found.push({ phrase, index: m.index, length: m[0].length });
    }
  }

  return { count: found.length, matches: found };
}

function highlightTone(text) {
  const { matches } = checkTone(text);
  if (!matches.length) return escapeHtml(text);

  // Sort matches by index descending so we can insert markers without shifting indices
  const sorted = [...matches].sort((a, b) => b.index - a.index);

  let result = text;
  for (const m of sorted) {
    const before = result.slice(0, m.index);
    const word = result.slice(m.index, m.index + m.length);
    const after = result.slice(m.index + m.length);
    result = before + '\x01MARK_OPEN\x01' + word + '\x01MARK_CLOSE\x01' + after;
  }

  // Escape HTML, then replace markers with <mark>
  let html = escapeHtml(result);
  html = html.replace(/\x01MARK_OPEN\x01/g, '<mark>');
  html = html.replace(/\x01MARK_CLOSE\x01/g, '</mark>');

  // Convert newlines to <br> for preview
  html = html.replace(/\n/g, '<br>');

  return html;
}

// ────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────

function init() {
  const root = document.querySelector('[data-li-root]');
  if (!root) return;

  const input = document.querySelector('[data-li-input]');
  const btnFormat = document.querySelector('[data-li-format]');
  const btnCopy = document.querySelector('[data-li-copy]');
  const btnReset = document.querySelector('[data-li-reset]');
  const status = document.querySelector('[data-li-status]');

  // Result panels
  const previewArea = document.querySelector('[data-li-preview]');
  const previewBody = document.querySelector('[data-li-preview-body]');
  const hookResult = document.querySelector('[data-li-hook-result]');
  const toneResult = document.querySelector('[data-li-tone-result]');
  const resultsWrap = document.querySelector('[data-li-results]');

  // AI analysis elements
  const btnAiAnalyze = document.querySelector('[data-li-ai-analyze]');
  const aiHookWrap = document.querySelector('[data-li-ai-hook]');
  const aiHookBody = document.querySelector('[data-li-ai-hook-body]');
  const aiToneWrap = document.querySelector('[data-li-ai-tone]');
  const aiToneBody = document.querySelector('[data-li-ai-tone-body]');

  let formattedText = '';

  const setStatus = (msg) => {
    if (!status) return;
    status.textContent = msg || '';
  };

  const doFormat = () => {
    setStatus('');
    const raw = String(input?.value || '');
    if (!raw.trim()) return;

    formattedText = formatText(raw);

    // Show preview with tone highlights
    if (previewBody) {
      previewBody.innerHTML = highlightTone(formattedText);
    }

    // Hook check
    if (hookResult) {
      const hook = checkHook(formattedText);
      hookResult.textContent = hook.label;
      hookResult.className = 'li-tool__badge' + (hook.type === 'warn' ? ' li-tool__badge--warn' : hook.type === 'good' ? ' li-tool__badge--good' : '');
    }

    // Tone check
    if (toneResult) {
      const tone = checkTone(formattedText);
      if (tone.count === 0) {
        toneResult.textContent = STRINGS.toneClean;
        toneResult.className = 'li-tool__badge li-tool__badge--good';
      } else {
        toneResult.textContent = `${tone.count} ${STRINGS.toneIssues}`;
        toneResult.className = 'li-tool__badge li-tool__badge--warn';
      }
    }

    // Show results
    if (resultsWrap) resultsWrap.hidden = false;

    // Scroll to results on mobile
    try {
      input?.blur?.();
      document.activeElement?.blur?.();
    } catch { /* noop */ }
    resultsWrap?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  const doCopy = async () => {
    if (!formattedText) return;
    setStatus('');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedText);
        setStatus(STRINGS.copied);
        setTimeout(() => setStatus(''), 1500);
        return;
      }
    } catch { /* fall through */ }
    // Fallback
    try {
      const ta = document.createElement('textarea');
      ta.value = formattedText;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setStatus(STRINGS.copyFallback);
      setTimeout(() => setStatus(''), 1500);
    } catch { /* noop */ }
  };

  const doReset = () => {
    if (input) input.value = '';
    formattedText = '';
    if (previewBody) previewBody.innerHTML = '';
    if (hookResult) { hookResult.textContent = ''; hookResult.className = ''; }
    if (toneResult) { toneResult.textContent = ''; toneResult.className = ''; }
    if (resultsWrap) resultsWrap.hidden = true;
    // Clear AI results
    if (aiHookWrap) { aiHookWrap.hidden = true; }
    if (aiHookBody) aiHookBody.innerHTML = '';
    if (aiToneWrap) { aiToneWrap.hidden = true; }
    if (aiToneBody) aiToneBody.innerHTML = '';
    setStatus('');
    input?.focus?.();
  };

  // ── AI Analysis ──
  const doAiAnalyze = async () => {
    const text = String(input?.value || '').trim();
    if (!text) return;
    setStatus('');

    // Show loading state
    if (btnAiAnalyze) {
      btnAiAnalyze.disabled = true;
      btnAiAnalyze.textContent = STRINGS.aiLoading;
    }
    if (aiHookWrap) { aiHookWrap.hidden = false; aiHookBody.innerHTML = `<span class="li-tool__ai-loading">${escapeHtml(STRINGS.aiLoading)}</span>`; }
    if (aiToneWrap) { aiToneWrap.hidden = false; aiToneBody.innerHTML = `<span class="li-tool__ai-loading">${escapeHtml(STRINGS.aiLoading)}</span>`; }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);

      const res = await fetch('/.netlify/functions/linkedin-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale: STRINGS.lang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Render Hook AI result
      if (aiHookBody && data.hook) {
        const h = data.hook;
        const verdictMap = { good: STRINGS.aiVerdict_good, generic: STRINGS.aiVerdict_generic, weak: STRINGS.aiVerdict_weak };
        const verdictLabel = verdictMap[h.verdict] || h.verdict;
        const badgeClass = h.verdict === 'good' ? 'li-tool__badge--good' : 'li-tool__badge--warn';
        let html = `<span class="li-tool__badge ${badgeClass}">${escapeHtml(verdictLabel)}</span>`;
        if (h.reason) html += `<p class="li-tool__ai-text">${escapeHtml(h.reason)}</p>`;
        if (h.suggestion) html += `<p class="li-tool__ai-text li-tool__ai-suggestion"><strong>${escapeHtml(STRINGS.aiSuggestionLabel)}:</strong> ${escapeHtml(h.suggestion)}</p>`;
        aiHookBody.innerHTML = html;
      }

      // Render Tone AI result
      if (aiToneBody && data.tone) {
        const t = data.tone;
        const score = typeof t.score === 'number' ? t.score : 0;
        const scoreClass = score >= 8 ? 'li-tool__score--good' : score >= 4 ? 'li-tool__score--neutral' : 'li-tool__score--warn';
        let html = `<span class="li-tool__score ${scoreClass}">${STRINGS.aiToneScore}: ${score}/10</span>`;
        if (t.summary) html += `<p class="li-tool__ai-text">${escapeHtml(t.summary)}</p>`;
        if (Array.isArray(t.issues) && t.issues.length > 0) {
          html += `<ul class="li-tool__ai-issues">`;
          for (const issue of t.issues) {
            html += `<li><mark>${escapeHtml(issue.phrase || '')}</mark> — ${escapeHtml(issue.reason || '')}</li>`;
          }
          html += `</ul>`;
        }
        aiToneBody.innerHTML = html;
      }
    } catch (err) {
      const msg = err && err.name === 'AbortError' ? 'Timeout' : STRINGS.aiError;
      if (aiHookBody) aiHookBody.innerHTML = `<span class="li-tool__badge li-tool__badge--warn">${escapeHtml(msg)}</span>`;
      if (aiToneBody) aiToneBody.innerHTML = `<span class="li-tool__badge li-tool__badge--warn">${escapeHtml(msg)}</span>`;
    } finally {
      if (btnAiAnalyze) {
        btnAiAnalyze.disabled = false;
        btnAiAnalyze.textContent = STRINGS.btnAiAnalyze;
      }
    }
  };

  btnAiAnalyze?.addEventListener('click', () => void doAiAnalyze());

  // Toolbar buttons
  const toolbarBtns = document.querySelectorAll('[data-li-tb]');
  toolbarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-li-tb');
      if (!input) return;
      switch (action) {
        case 'bullet':
          replaceSelection(input, (s) => s, '• ');
          break;
        case 'bold':
          replaceSelection(input, (s) => toUnicodeStyle(s, BOLD_MAP), '');
          break;
        case 'italic':
          replaceSelection(input, (s) => toUnicodeStyle(s, ITALIC_MAP), '');
          break;
        case 'bolditalic':
          replaceSelection(input, (s) => toUnicodeStyle(s, BOLD_ITALIC_MAP), '');
          break;
      }
    });
  });

  btnFormat?.addEventListener('click', doFormat);
  btnCopy?.addEventListener('click', () => void doCopy());
  btnReset?.addEventListener('click', doReset);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
