// Padel aggregator (100% client-side, no network, no deps)
// Loads strings from window.__PADEL_STRINGS__ set by Astro component.

const STRINGS = (() => {
  const s = (globalThis && globalThis.__PADEL_STRINGS__) || {};
  return {
    btnCopy: s.btnCopy || 'Copia negli appunti',
    copied: s.copied || 'Copiato',
    copyFallback: s.copyFallback || 'Selezionato — copia manualmente',
    emptyOutput: s.emptyOutput || 'Nessun evento trovato.',
    badgeIncomplete: s.badgeIncomplete || 'incompleto',
    labelLevel: s.labelLevel || 'Livello',
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

const WANS_PORT_RE = /https?:\/\/wansport\.com\/[^\s]+/i;
const TIME_RE = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

const MONTHS_IT = {
  gennaio: 0,
  febbraio: 1,
  marzo: 2,
  aprile: 3,
  maggio: 4,
  giugno: 5,
  luglio: 6,
  agosto: 7,
  settembre: 8,
  ottobre: 9,
  novembre: 10,
  dicembre: 11,
};

const MONTHS_IT_ABBR = {
  gen: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mag: 4,
  giu: 5,
  lug: 6,
  ago: 7,
  set: 8,
  ott: 9,
  nov: 10,
  dic: 11,
};

const DOW_IT = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
const pad2 = (n) => String(n).padStart(2, '0');

function splitInputToBlocks(input) {
  const text = String(input || '').trim();
  if (!text) return [];

  const re = new RegExp(WANS_PORT_RE.source, 'ig');
  const matches = [];
  for (;;) {
    const m = re.exec(text);
    if (!m) break;
    matches.push({ start: m.index, end: m.index + m[0].length });
  }
  if (matches.length) {
    const blocks = [];
    let cursor = 0;
    for (const m of matches) {
      const chunk = text.slice(cursor, m.end).trim();
      if (chunk) blocks.push(chunk);
      cursor = m.end;
    }
    const tail = text.slice(cursor).trim();
    if (tail) blocks.push(tail);
    return blocks;
  }

  return text
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);
}

function parseItalianDate(text) {
  const t = String(text || '');

  // Numeric: 28/01/2026, 28-01-2026, 28.01.2026
  const mNum = t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/);
  if (mNum) {
    const day = Number(mNum[1]);
    const monthIndex = Number(mNum[2]) - 1;
    const year = Number(mNum[3]);
    if (!(day >= 1 && day <= 31)) return null;
    if (!(monthIndex >= 0 && monthIndex <= 11)) return null;
    if (!(year >= 1900 && year <= 2200)) return null;
    return { year, monthIndex, day, iso: `${year}-${pad2(monthIndex + 1)}-${pad2(day)}` };
  }

  const monthKeys = Object.keys(MONTHS_IT)
    .concat(Object.keys(MONTHS_IT_ABBR))
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const monthAlternation = monthKeys.join('|');
  const re = new RegExp(`\\b(\\d{1,2})\\s+(${monthAlternation})\\.?\\s+(\\d{4})\\b`, 'i');
  const m = t.match(re);
  if (!m) return null;
  const day = Number(m[1]);
  const token = String(m[2] || '').toLowerCase().replace(/\.+$/, '');
  const year = Number(m[3]);
  const monthIndex = MONTHS_IT[token] ?? MONTHS_IT_ABBR[token];
  if (!(day >= 1 && day <= 31)) return null;
  if (!(year >= 1900 && year <= 2200)) return null;
  if (monthIndex == null) return null;
  return { year, monthIndex, day, iso: `${year}-${pad2(monthIndex + 1)}-${pad2(day)}` };
}

function parseTime(text) {
  const t = String(text || '');
  const m = t.match(TIME_RE);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!(hh >= 0 && hh <= 23)) return null;
  if (!(mm >= 0 && mm <= 59)) return null;
  return { hh, mm, hhmm: `${pad2(hh)}:${pad2(mm)}` };
}

function cleanLine(s) {
  return String(s || '').replace(/\u200E|\u200F/g, '').trim();
}

function stripEmojiPrefix(name) {
  return name.replace(/^✅\s*/g, '').replace(/^[•\-–—]+\s*/g, '').trim();
}

function bestEffortVenue(lines) {
  const idx = lines.findIndex((l) => l.includes('📌'));
  if (idx >= 0) {
    const same = cleanLine(lines[idx].replace('📌', ''));
    if (same) return same;
    for (let i = idx + 1; i < lines.length; i++) {
      const next = cleanLine(lines[i]);
      if (next) return next;
    }
  }
  for (const raw of lines) {
    const l = cleanLine(raw);
    if (!l) continue;
    if (WANS_PORT_RE.test(l)) continue;
    if (TIME_RE.test(l)) continue;
    if (parseItalianDate(l)) continue;
    if (/^campo\s+\d+/i.test(l)) continue;
    if (/livello/i.test(l)) continue;
    if (l.includes('✅') || l.includes('❓')) continue;
    if (l.length < 3) continue;
    return l;
  }
  return undefined;
}

function parseCourt(text) {
  const m = String(text || '').match(/\bcampo\s+(\d+)\b/i);
  if (!m) return undefined;
  return `Campo ${Number(m[1])}`;
}

function parseLevelRange(text) {
  const t = String(text || '');
  const lineMatch = (t.match(/livello[^\n]*$/gim) || [])[0] || '';
  const m = (lineMatch || t).match(/\bda\s+([A-Z]\d)\s+a\s+([A-Z]\d)\b/i);
  if (m) return `${String(m[1]).toUpperCase()}–${String(m[2]).toUpperCase()}`;
  const m2 = t.match(/livello\s+([^\n]{1,24})/i);
  if (!m2) return undefined;
  const raw = cleanLine(m2[1]).replace(/[|•]+/g, ' ');
  const compact = raw.replace(/\s+/g, ' ').trim();
  return compact || undefined;
}

function parsePlayersConfirmed(lines) {
  const out = [];
  for (const raw of lines) {
    if (!raw.includes('✅')) continue;
    const after = stripEmojiPrefix(raw);
    const name = (after.split(/[|•·]/g)[0] || '').trim();
    if (name) out.push(name);
  }
  return out.filter((x, i) => out.indexOf(x) === i);
}

function parseBlock(block) {
  const rawBlock = String(block || '').trim();
  const lines = rawBlock
    .split(/\r?\n/g)
    .map(cleanLine)
    .filter((l) => l.length > 0);

  const url = (rawBlock.match(WANS_PORT_RE) || [])[0];
  const date = parseItalianDate(rawBlock);
  const time = parseTime(rawBlock);

  const venueName = bestEffortVenue(lines);
  const court = parseCourt(rawBlock);
  const levelRange = parseLevelRange(rawBlock);

  const playersConfirmed = parsePlayersConfirmed(lines);
  const openSlots = (rawBlock.match(/❓/g) || []).length;

  const incomplete = !date || !time;
  const startDateTime = date && time ? new Date(date.year, date.monthIndex, date.day, time.hh, time.mm, 0, 0) : null;

  return {
    rawBlock,
    dateISO: date ? date.iso : undefined,
    time: time ? time.hhmm : undefined,
    venueName,
    court,
    levelRange,
    playersConfirmed,
    openSlots,
    url,
    startDateTime: startDateTime || undefined,
    incomplete,
  };
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const aInc = a.incomplete ? 1 : 0;
    const bInc = b.incomplete ? 1 : 0;
    if (aInc !== bInc) return aInc - bInc;
    const at = a.startDateTime ? a.startDateTime.getTime() : NaN;
    const bt = b.startDateTime ? b.startDateTime.getTime() : NaN;
    const aOk = Number.isFinite(at);
    const bOk = Number.isFinite(bt);
    if (aOk && bOk && at !== bt) return at - bt;
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    const av = (a.venueName || '').toLowerCase();
    const bv = (b.venueName || '').toLowerCase();
    return av.localeCompare(bv, 'it');
  });
}

function formatDowAndDate(dateISO, start) {
  if (start instanceof Date && Number.isFinite(start.getTime())) {
    const dow = DOW_IT[start.getDay()];
    return `${dow} ${pad2(start.getDate())}/${pad2(start.getMonth() + 1)}`;
  }
  if (dateISO) {
    const m = String(dateISO).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return undefined;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
    if (!Number.isFinite(d.getTime())) return undefined;
    const dow = DOW_IT[d.getDay()];
    return `${dow} ${pad2(Number(m[3]))}/${pad2(Number(m[2]))}`;
  }
  return undefined;
}

function normalizeVenueKey(s) {
  return String(s || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .trim();
}

function formatVenueLine({ venueName, court }) {
  let venue = String(venueName || '').trim();
  let c = court;

  if (venue) {
    const parts = venue
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      const a = normalizeVenueKey(parts[0]);
      const b = normalizeVenueKey(parts[1]);
      if (a && b && a === b) venue = parts[0];
    }

    const m = venue.match(/\bcampo\s+(\d+)\b/i);
    if (m && c) {
      const cNum = String(c).match(/\d+/)?.[0];
      if (cNum && cNum === m[1]) c = undefined;
      venue = venue.replace(/\s*[–-]\s*campo\s+\d+\s*$/i, '').trim();
    }
  }

  const venueOut = venue ? `*${venue.toUpperCase()}*` : '';
  if (venueOut && c) return `${venueOut} – ${c}`;
  return venueOut || c || '';
}

function formatPlayersLines({ playersConfirmed, openSlots }) {
  const confirmed = playersConfirmed || [];
  const totalSlots = Math.max(4, confirmed.length + Math.max(0, openSlots || 0));
  const slots = [];
  for (let i = 0; i < totalSlots; i++) slots.push(confirmed[i] ? confirmed[i] : null);
  const lines = slots.map((name) => (name ? `✅ ${name}` : `❓ libero`));
  if (totalSlots === 4) return [lines[0], lines[1], 'vs', lines[2], lines[3]].filter(Boolean);
  return lines;
}

function formatForWhatsApp(events) {
  const sorted = sortEvents(events);
  const parts = [];
  for (const e of sorted) {
    const dowDate = formatDowAndDate(e.dateISO, e.startDateTime);
    const header = [dowDate || 'Senza data', e.time ? `· ${e.time}` : null].filter(Boolean).join(' ');

    const venueLine = formatVenueLine({ venueName: e.venueName, court: e.court });
    const levelLine = e.levelRange ? `${STRINGS.labelLevel} ${e.levelRange}` : null;
    const playersLines = formatPlayersLines({ playersConfirmed: e.playersConfirmed, openSlots: e.openSlots });

    parts.push(
      [header, venueLine || null, levelLine || null, ...playersLines, e.url || null]
        .filter(Boolean)
        .join('\n')
    );
  }
  return parts.join('\n\n');
}

function formatPreview(events) {
  const sorted = sortEvents(events);
  return sorted.map((e, idx) => {
    const when = [formatDowAndDate(e.dateISO, e.startDateTime) || 'Senza data', e.time || null]
      .filter(Boolean)
      .join(' · ');
    return {
      id: `e${idx}`,
      whenLabel: when,
      venueLabel: e.venueName || 'Struttura non riconosciuta',
      courtLabel: e.court,
      levelLabel: e.levelRange,
      confirmedCount: e.playersConfirmed.length,
      openSlots: e.openSlots,
      url: e.url,
      incomplete: e.incomplete,
    };
  });
}

function parseAll(input) {
  const blocks = splitInputToBlocks(input);
  const events = [];
  const unparsedBlocks = [];
  for (const b of blocks) {
    const ev = parseBlock(b);
    const hasBasics = Boolean(ev.dateISO && ev.time);
    if (hasBasics) events.push(ev);
    else unparsedBlocks.push(b);
  }
  return { events: sortEvents(events), unparsedBlocks };
}

function ensureTrailingDoubleNewline(input) {
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
  const root = document.querySelector('[data-padel-root]');
  if (!root) return;

  const input = document.querySelector('[data-padel-input]');
  const output = document.querySelector('[data-padel-output]');
  const status = document.querySelector('[data-padel-status]');
  const btnAnalyze = document.querySelector('[data-padel-analyze]');
  const btnCopy = document.querySelector('[data-padel-copy]');
  const btnClear = document.querySelector('[data-padel-clear]');
  const preview = document.querySelector('[data-padel-preview]');
  const cards = document.querySelector('[data-padel-cards]');
  const unrec = document.querySelector('[data-padel-unrecognized]');
  const unrecBody = document.querySelector('[data-padel-unrecognized-body]');

  const setStatus = (msg) => {
    if (!status) return;
    status.textContent = msg || '';
  };

  const renderCards = (previewEvents) => {
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
    try {
      input?.blur?.();
      document.activeElement?.blur?.();
    } catch {
      /* noop */
    }
    (output || preview || root)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
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
      /* fall through */
    }
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
  btnCopy?.addEventListener('click', () => void copyOutput());
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

