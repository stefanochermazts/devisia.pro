export type ParsedEvent = {
  rawBlock: string;
  dateISO?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  venueName?: string;
  court?: string; // "Campo X"
  levelRange?: string; // e.g. "C3–B4"
  playersConfirmed: string[];
  openSlots: number;
  url?: string;
  startDateTime?: Date; // local time
  incomplete: boolean;
};

export type PreviewEvent = {
  id: string;
  whenLabel: string;
  venueLabel: string;
  courtLabel?: string;
  levelLabel?: string;
  confirmedCount: number;
  openSlots: number;
  url?: string;
  incomplete: boolean;
};

const WANS_PORT_RE = /https?:\/\/wansport\.com\/[^\s]+/i;
const TIME_RE = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

const MONTHS_IT: Record<string, number> = {
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

const MONTHS_IT_ABBR: Record<string, number> = {
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

const DOW_IT = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'] as const;

const pad2 = (n: number) => String(n).padStart(2, '0');

export function splitInputToBlocks(input: string): string[] {
  const text = String(input || '').trim();
  if (!text) return [];

  // Primary: every Wansport URL marks the END of an event.
  const re = new RegExp(WANS_PORT_RE.source, 'ig');
  const matches: Array<{ start: number; end: number }> = [];
  for (;;) {
    const m = re.exec(text);
    if (!m) break;
    matches.push({ start: m.index, end: m.index + m[0].length });
  }
  if (matches.length) {
    const blocks: string[] = [];
    let cursor = 0;
    for (const m of matches) {
      const end = m.end;
      const chunk = text.slice(cursor, end).trim();
      if (chunk) blocks.push(chunk);
      cursor = end;
    }
    const tail = text.slice(cursor).trim();
    if (tail) blocks.push(tail);
    return blocks;
  }

  // Fallback: split on blank-line separators.
  return text
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function parseItalianDate(text: string): { year: number; monthIndex: number; day: number; iso: string } | null {
  const t = String(text || '');

  // Tolerant numeric formats: 28/01/2026, 28-01-2026, 28.01.2026
  const mNum = t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/);
  if (mNum) {
    const day = Number(mNum[1]);
    const monthIndex = Number(mNum[2]) - 1;
    const year = Number(mNum[3]);
    if (!Number.isFinite(day) || !Number.isFinite(year) || !Number.isFinite(monthIndex)) return null;
    if (day < 1 || day > 31) return null;
    if (monthIndex < 0 || monthIndex > 11) return null;
    if (year < 1900 || year > 2200) return null;
    const iso = `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
    return { year, monthIndex, day, iso };
  }

  // Italian month names (full) and abbreviations: "28 gennaio 2026", "28 gen 2026", "28 gen. 2026"
  const monthKeys = [...Object.keys(MONTHS_IT), ...Object.keys(MONTHS_IT_ABBR)].sort((a, b) => b.length - a.length);
  const monthAlternation = monthKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const re = new RegExp(String.raw`\b(\d{1,2})\s+(${monthAlternation})\.?\s+(\d{4})\b`, 'i');
  const m = t.match(re);
  if (!m) return null;
  const day = Number(m[1]);
  const tokenRaw = String(m[2] || '').toLowerCase().replace(/\.+$/, '');
  const year = Number(m[3]);
  const monthIndex = MONTHS_IT[tokenRaw] ?? MONTHS_IT_ABBR[tokenRaw];
  if (!Number.isFinite(day) || !Number.isFinite(year) || monthIndex == null) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2200) return null;
  const iso = `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
  return { year, monthIndex, day, iso };
}

export function parseTime(text: string): { hh: number; mm: number; hhmm: string } | null {
  const t = String(text || '');
  const m = t.match(TIME_RE);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return { hh, mm, hhmm: `${pad2(hh)}:${pad2(mm)}` };
}

function cleanLine(s: string) {
  return String(s || '').replace(/\u200E|\u200F/g, '').trim();
}

function stripEmojiPrefix(name: string) {
  return name.replace(/^✅\s*/g, '').replace(/^[•\-–—]+\s*/g, '').trim();
}

function bestEffortVenue(lines: string[]): string | undefined {
  // Prefer: line after 📌, or same line after 📌.
  const idx = lines.findIndex((l) => l.includes('📌'));
  if (idx >= 0) {
    const same = cleanLine(lines[idx].replace('📌', ''));
    if (same) return same;
    for (let i = idx + 1; i < lines.length; i++) {
      const next = cleanLine(lines[i]);
      if (next) return next;
    }
  }

  // Fallback: first "content" line that isn't clearly metadata.
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

function parseCourt(text: string): string | undefined {
  const m = String(text || '').match(/\bcampo\s+(\d+)\b/i);
  if (!m) return undefined;
  return `Campo ${Number(m[1])}`;
}

function parseLevelRange(text: string): string | undefined {
  const t = String(text || '');
  const lineMatch = t.match(/livello[^\n]*$/gim)?.[0] ?? '';
  const m = (lineMatch || t).match(/\bda\s+([A-Z]\d)\s+a\s+([A-Z]\d)\b/i);
  if (m) return `${m[1].toUpperCase()}–${m[2].toUpperCase()}`;

  // Best effort: "Livello X" where X is a short token sequence.
  const m2 = t.match(/livello\s+([^\n]{1,24})/i);
  if (!m2) return undefined;
  const raw = cleanLine(m2[1]).replace(/[|•]+/g, ' ');
  const compact = raw.replace(/\s+/g, ' ').trim();
  return compact || undefined;
}

function parsePlayersConfirmed(lines: string[]): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    if (!raw.includes('✅')) continue;
    const after = stripEmojiPrefix(raw);
    // Keep only the first chunk before obvious separators.
    const name = after.split(/[|•·]/g)[0]?.trim() || '';
    if (name) out.push(name);
  }
  // De-dupe while preserving order.
  return out.filter((x, i) => out.indexOf(x) === i);
}

export function parseBlock(block: string): ParsedEvent {
  const rawBlock = String(block || '').trim();
  const lines = rawBlock
    .split(/\r?\n/g)
    .map(cleanLine)
    .filter((l) => l.length > 0);

  const url = rawBlock.match(WANS_PORT_RE)?.[0];
  const date = parseItalianDate(rawBlock);
  const time = parseTime(rawBlock);

  const venueName = bestEffortVenue(lines);
  const court = parseCourt(rawBlock);
  const levelRange = parseLevelRange(rawBlock);

  const playersConfirmed = parsePlayersConfirmed(lines);
  const openSlots = (rawBlock.match(/❓/g) || []).length;

  const incomplete = !date || !time;
  const startDateTime =
    date && time ? new Date(date.year, date.monthIndex, date.day, time.hh, time.mm, 0, 0) : undefined;

  return {
    rawBlock,
    dateISO: date?.iso,
    time: time?.hhmm,
    venueName,
    court,
    levelRange,
    playersConfirmed,
    openSlots,
    url,
    startDateTime,
    incomplete,
  };
}

export function sortEvents(events: ParsedEvent[]): ParsedEvent[] {
  return [...events].sort((a, b) => {
    const aInc = a.incomplete ? 1 : 0;
    const bInc = b.incomplete ? 1 : 0;
    if (aInc !== bInc) return aInc - bInc; // complete first

    const at = a.startDateTime?.getTime();
    const bt = b.startDateTime?.getTime();
    const aOk = typeof at === 'number' && Number.isFinite(at);
    const bOk = typeof bt === 'number' && Number.isFinite(bt);
    if (aOk && bOk && at !== bt) return at - bt;
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;

    const av = (a.venueName || '').toLowerCase();
    const bv = (b.venueName || '').toLowerCase();
    return av.localeCompare(bv, 'it');
  });
}

function formatDowAndDate(dateISO?: string, start?: Date): string | undefined {
  if (start instanceof Date && Number.isFinite(start.getTime())) {
    const dow = DOW_IT[start.getDay()];
    const dd = pad2(start.getDate());
    const mm = pad2(start.getMonth() + 1);
    return `${dow} ${dd}/${mm}`;
  }
  if (dateISO) {
    const m = dateISO.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return undefined;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    const d = new Date(year, month, day, 0, 0, 0, 0);
    if (!Number.isFinite(d.getTime())) return undefined;
    const dow = DOW_IT[d.getDay()];
    return `${dow} ${pad2(day)}/${pad2(month + 1)}`;
  }
  return undefined;
}

export function formatForWhatsApp(events: ParsedEvent[]): string {
  const sorted = sortEvents(events);
  const parts: string[] = [];

  for (const e of sorted) {
    const dowDate = formatDowAndDate(e.dateISO, e.startDateTime);
    const header = [dowDate || 'Senza data', e.time ? `· ${e.time}` : null].filter(Boolean).join(' ');

    const line2 = [e.venueName || null, e.court ? `– ${e.court}` : null].filter(Boolean).join(' ');

    const counts = `✅${e.playersConfirmed.length} ❓${e.openSlots}`;
    const level = e.levelRange ? `Livello ${e.levelRange}` : null;
    const line3 = [level, counts].filter(Boolean).join(' · ');

    parts.push([header, line2 || null, line3 || null, e.url || null].filter(Boolean).join('\n'));
  }

  return parts.join('\n\n');
}

export function formatPreview(events: ParsedEvent[]): PreviewEvent[] {
  const sorted = sortEvents(events);
  return sorted.map((e, idx) => {
    const when = [formatDowAndDate(e.dateISO, e.startDateTime) || 'Senza data', e.time || null]
      .filter(Boolean)
      .join(' · ');
    const venue = e.venueName || 'Struttura non riconosciuta';
    return {
      id: `e${idx}`,
      whenLabel: when,
      venueLabel: venue,
      courtLabel: e.court,
      levelLabel: e.levelRange,
      confirmedCount: e.playersConfirmed.length,
      openSlots: e.openSlots,
      url: e.url,
      incomplete: e.incomplete,
    };
  });
}

export function parseAll(input: string): { events: ParsedEvent[]; unparsedBlocks: string[] } {
  const blocks = splitInputToBlocks(input);
  const events: ParsedEvent[] = [];
  const unparsedBlocks: string[] = [];

  for (const b of blocks) {
    const ev = parseBlock(b);
    const hasBasics = Boolean(ev.dateISO && ev.time);
    if (hasBasics) {
      events.push(ev);
    } else {
      unparsedBlocks.push(b);
    }
  }

  return { events: sortEvents(events), unparsedBlocks };
}

// --- Minimal dev-only assertions (quick sanity checks) ---
// These are meant to run in dev bundles; they are harmless in prod (but we guard anyway).
type MaybeImportMeta = { env?: { DEV?: boolean } };
const __DEV__ = Boolean(
  typeof import.meta !== 'undefined' && (import.meta as unknown as MaybeImportMeta).env?.DEV
);
if (__DEV__) {
  console.assert(parseItalianDate('mercoledì 28 gennaio 2026')?.iso === '2026-01-28', 'parseItalianDate failed');
  console.assert(parseItalianDate('28/01/2026')?.iso === '2026-01-28', 'parseItalianDate numeric failed');
  console.assert(parseItalianDate('28 gen 2026')?.iso === '2026-01-28', 'parseItalianDate abbr failed');
  console.assert(parseTime('Ore 18:30')?.hhmm === '18:30', 'parseTime failed');
  const sample = `
Mercoledì 28 gennaio 2026
Ore 18:30
📌 Padel Club Trieste
Campo 2
Livello da C3 a B4
✅ Mario
✅ Giulia
❓
https://wansport.com/abc
  `.trim();
  const ev = parseBlock(sample);
  console.assert(ev.dateISO === '2026-01-28' && ev.time === '18:30', 'parseBlock date/time failed');
  console.assert(ev.court === 'Campo 2', 'parseBlock court failed');
  console.assert(ev.levelRange === 'C3–B4', 'parseBlock level failed');
  console.assert(ev.playersConfirmed.length === 2 && ev.openSlots === 1, 'parseBlock players/openSlots failed');
}

