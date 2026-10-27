export type PiiKind =
  | 'secret'
  | 'email'
  | 'iban'
  | 'cf'
  | 'vat'
  | 'phone'
  | 'address'
  | 'name';

export interface LegendEntry {
  placeholder: string;
  value: string;
  kind: PiiKind;
}

export interface SanitizeResult {
  text: string;
  legend: LegendEntry[];
}

interface Span {
  start: number;
  end: number;
  value: string;
  kind: PiiKind;
}

const PREFIX: Record<PiiKind, string> = {
  secret: 'SECRET',
  email: 'EMAIL',
  iban: 'IBAN',
  cf: 'CF',
  vat: 'PIVA',
  phone: 'PHONE',
  address: 'ADDR',
  name: 'NAME',
};

const KIND_ORDER: PiiKind[] = ['secret', 'email', 'iban', 'cf', 'vat', 'phone', 'address', 'name'];

const GIVEN_NAMES = new Set(
  `marco giulia luca francesca alessandro alessandra andrea matteo sofia chiara francesco
giuseppe giovanni maria anna sara martina lorenzo davide federico elena valentina simone
riccardo stefano paolo roberto laura silvia claudia giorgio antonio mario luigi beatrice
camilla nicola nicolo nicolò pietro tommaso gabriele michele alberto enrico filippo vincenzo
salvatore giacomo emanuele cristina elisa ilaria roberta monica paola daniela barbara
giovanna antonella caterina lucia teresa angela rosa carla franca bruno carlo claudio
daniele diego edoardo fabio fabrizio gianluca massimo maurizio ottavio piero renato sergio
umberto valerio vittorio james john robert michael william david richard joseph thomas
charles christopher daniel matthew anthony mark donald steven paul andrew joshua kenneth
kevin brian george timothy ronald edward jason jeffrey ryan jacob gary nicholas eric
jonathan stephen larry justin scott brandon benjamin samuel raymond gregory alexander
patrick jack dennis jerry tyler aaron jose adam nathan henry douglas zachary peter kyle
noah ethan jeremy walter christian keith roger terry austin sean gerald carl harold dylan
arthur lawrence jordan jesse bryan billy bruce gabriel joe logan albert willie alan eugene
russell vincent philip bobby johnny bradley mary patricia jennifer linda elizabeth barbara
susan jessica sarah karen nancy lisa betty margaret sandra ashley kimberly emily donna
michelle dorothy carol amanda melissa deborah stephanie rebecca sharon cynthia kathleen
amy shirley brenda pamela emma nicole helen samantha katherine christine debra rachel
carolyn janet catherine heather diane ruth julie olivia joyce virginia victoria kelly
lauren christina joan evelyn judith megan cheryl hannah jacqueline martha gloria frances
kathryn janice jean abigail alice julia judy sophia grace denise amber doris marilyn
danielle beverly isabella theresa diana natalie brittany charlotte marie kayla alexis lori`
    .split(/\s+/)
    .filter(Boolean),
);

const SURNAME_STOP = new Set(
  `via viale piazza corso largo vicolo strada contrada lungomare piazzale monday tuesday
wednesday thursday friday saturday sunday lunedì lunedi martedì martedi mercoledì mercoledi
giovedì giovedi venerdì venerdi sabato domenica gennaio febbraio marzo aprile maggio giugno
luglio agosto settembre ottobre novembre dicembre january february march april may june july
august september october november december the and for with from this that oggi ieri quando
dove come per con sul nel prompt email iban api llm gdpr italia italy srl spa snc sas roma
milano torino napoli street road avenue`
    .split(/\s+/)
    .filter(Boolean),
);

const PARTICLES = new Set(['de', 'di', 'del', 'della', 'dello', 'degli', 'delle', 'da', 'van', 'von']);

const CF_ODD: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
  K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
  U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
};

const CF_EVEN: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
  K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
  U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
};

function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function isValidCodiceFiscale(raw: string): boolean {
  const cf = raw.toUpperCase();
  if (!/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(cf)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i += 1) {
    const char = cf[i];
    sum += i % 2 === 0 ? CF_ODD[char] : CF_EVEN[char];
  }
  return String.fromCharCode(65 + (sum % 26)) === cf[15];
}

function isValidPartitaIva(raw: string): boolean {
  if (!/^\d{11}$/.test(raw)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i += 1) {
    let n = Number(raw[i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return (10 - (sum % 10)) % 10 === Number(raw[10]);
}

function isValidIban(raw: string): boolean {
  const compact = raw.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact) || compact.length > 34) return false;
  const rearranged = compact.slice(4) + compact.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const chunk = char >= 'A' && char <= 'Z' ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

function pushMatch(spans: Span[], start: number, end: number, value: string, kind: PiiKind) {
  if (end <= start || !value.trim()) return;
  spans.push({ start, end, value, kind });
}

function findSecrets(text: string, spans: Span[]) {
  const patterns = [
    /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    /\bghp_[A-Za-z0-9]{20,}\b/g,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
    /\bAKIA[0-9A-Z]{16}\b/g,
    /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
    /\bAIza[0-9A-Za-z_-]{20,}\b/g,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'secret');
    }
  }
  const assigned = /(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["']?([A-Za-z0-9_\-./+=]{16,})/gi;
  for (const match of text.matchAll(assigned)) {
    const value = match[1];
    const offset = (match.index ?? 0) + match[0].lastIndexOf(value);
    pushMatch(spans, offset, offset + value.length, value, 'secret');
  }
}

function findEmails(text: string, spans: Span[]) {
  const pattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  for (const match of text.matchAll(pattern)) {
    pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'email');
  }
}

function findIbans(text: string, spans: Span[]) {
  const pattern = /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}\s?[A-Z0-9]{1,4}\b/gi;
  for (const match of text.matchAll(pattern)) {
    if (!isValidIban(match[0])) continue;
    pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'iban');
  }
}

function findCodiciFiscali(text: string, spans: Span[]) {
  const pattern = /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi;
  for (const match of text.matchAll(pattern)) {
    if (!isValidCodiceFiscale(match[0])) continue;
    pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'cf');
  }
}

function findPartiteIva(text: string, spans: Span[]) {
  const pattern = /(?<!\d)\d{11}(?!\d)/g;
  for (const match of text.matchAll(pattern)) {
    if (!isValidPartitaIva(match[0])) continue;
    pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'vat');
  }
}

function findPhones(text: string, spans: Span[]) {
  const pattern = /(?<!\d)(?:\+39[\s.-]?)?(?:3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}|0\d{1,3}[\s.-]?\d{5,8})(?!\d)/g;
  const e164 = /(?<!\d)\+\d{8,15}(?!\d)/g;
  for (const patternSet of [pattern, e164]) {
    for (const match of text.matchAll(patternSet)) {
      const digits = match[0].replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) continue;
      pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'phone');
    }
  }
}

function findAddresses(text: string, spans: Span[]) {
  const it = /(?<![^\s,;:(])((?:via|viale|v\.le|piazza|p\.zza|corso|largo|vicolo|strada|contrada|lungomare|piazzale))\s+(\p{Lu}[\p{L}'’.-]+(?:\s+\p{Lu}[\p{L}'’.-]+){0,3})(?:\s*,?\s*(?:n\.?\s*)?\d{1,4}[A-Za-z]?)?(?:\s*,?\s*\d{5}(?:\s+\p{Lu}[\p{L}'’.-]+){0,2})?/giu;
  const en = /\b\d{1,5}\s+(?:\p{Lu}[\p{L}'’.-]+\s+){1,3}(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gu;
  for (const pattern of [it, en]) {
    for (const match of text.matchAll(pattern)) {
      pushMatch(spans, match.index ?? 0, (match.index ?? 0) + match[0].length, match[0], 'address');
    }
  }
}

function isSurname(word: string): boolean {
  if (!/^\p{Lu}[\p{L}'’-]{1,}$/u.test(word)) return false;
  return !SURNAME_STOP.has(fold(word));
}

function findNames(text: string, spans: Span[]) {
  const tokenRe = /[\p{L}'’-]+/gu;
  const tokens = [...text.matchAll(tokenRe)].map((match) => ({
    word: match[0],
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));

  for (let i = 0; i < tokens.length; i += 1) {
    if (!GIVEN_NAMES.has(fold(tokens[i].word))) continue;
    let surnameIndex = i + 1;
    if (surnameIndex < tokens.length && PARTICLES.has(fold(tokens[surnameIndex].word))) {
      surnameIndex += 1;
    }
    if (surnameIndex >= tokens.length || !isSurname(tokens[surnameIndex].word)) continue;
    const gap = text.slice(tokens[i].end, tokens[surnameIndex].start);
    if (!/^[\s]+$/.test(gap) || gap.includes('\n')) continue;
    pushMatch(spans, tokens[i].start, tokens[surnameIndex].end, text.slice(tokens[i].start, tokens[surnameIndex].end), 'name');
    i = surnameIndex;
  }
}

function overlaps(a: Span, b: Span): boolean {
  return a.start < b.end && b.start < a.end;
}

function selectSpans(candidates: Span[], suppressed: ReadonlySet<string>): Span[] {
  const accepted: Span[] = [];
  const ranked = [...candidates].sort((a, b) => {
    const byKind = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
    if (byKind !== 0) return byKind;
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });
  for (const span of ranked) {
    if (suppressed.has(span.value)) continue;
    if (accepted.some((kept) => overlaps(kept, span))) continue;
    accepted.push(span);
  }
  return accepted.sort((a, b) => a.start - b.start);
}

export function sanitizePrompt(input: string, suppressedValues: readonly string[] = []): SanitizeResult {
  const suppressed = new Set(suppressedValues);
  const candidates: Span[] = [];
  findSecrets(input, candidates);
  findEmails(input, candidates);
  findIbans(input, candidates);
  findCodiciFiscali(input, candidates);
  findPartiteIva(input, candidates);
  findPhones(input, candidates);
  findAddresses(input, candidates);
  findNames(input, candidates);

  const spans = selectSpans(candidates, suppressed);
  const counters: Partial<Record<PiiKind, number>> = {};
  const assigned = new Map<string, string>();
  const legend: LegendEntry[] = [];
  let cursor = 0;
  let text = '';

  for (const span of spans) {
    const key = `${span.kind}\u0000${span.value}`;
    let placeholder = assigned.get(key);
    if (!placeholder) {
      const next = (counters[span.kind] ?? 0) + 1;
      counters[span.kind] = next;
      placeholder = `[${PREFIX[span.kind]}_${next}]`;
      assigned.set(key, placeholder);
      legend.push({ placeholder, value: span.value, kind: span.kind });
    }
    text += input.slice(cursor, span.start) + placeholder;
    cursor = span.end;
  }
  text += input.slice(cursor);

  return { text, legend };
}
