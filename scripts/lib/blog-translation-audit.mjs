export function stripMarkdown(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeComparableText(text) {
  return stripMarkdown(text).toLowerCase();
}

const EN_PHRASES = [
  ' in the ',
  ' of the ',
  ' and the ',
  ' with the ',
  ' for the ',
  ' you can ',
  ' you should ',
  ' this is ',
  ' that is ',
  ' however ',
  ' therefore ',
  ' moreover ',
  ' in order to ',
  ' as well as ',
  ' such as ',
  ' according to ',
  ' the problem ',
  ' the solution ',
  ' in practice ',
  ' for example ',
];

const EN_WORDS = new Set([
  'the', 'and', 'with', 'for', 'that', 'this', 'from', 'your', 'you', 'are', 'was', 'were',
  'have', 'has', 'will', 'would', 'should', 'could', 'their', 'they', 'them', 'what', 'when',
  'where', 'which', 'while', 'because', 'however', 'therefore', 'moreover', 'also', 'into',
  'about', 'through', 'between', 'during', 'without', 'within', 'these', 'those', 'such',
]);

const IT_WORDS = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'uno', 'dei', 'delle', 'del', 'della',
  'che', 'non', 'per', 'con', 'sono', 'questo', 'questa', 'questi', 'queste', 'quando', 'dove',
  'come', 'anche', 'più', 'molto', 'tutti', 'tutte', 'ogni', 'deve', 'può', 'possono', 'viene',
  'vengono', 'nel', 'nella', 'nelle', 'negli', 'tra', 'fra', 'solo', 'sempre', 'ancora', 'già',
]);

const EN_LINE_PATTERNS = [
  /^the [a-z]/i,
  /^this (is|means|creates|allows|helps|approach|pattern|guide|article|reverts)/i,
  /^for (example|instance|many|most|teams|cto|founders)/i,
  /^in (practice|contrast|summary|this|many|most|addition)/i,
  /^however,/i,
  /^therefore,/i,
  /^moreover,/i,
  /^according to/i,
  /^as a result/i,
  /^it is (important|essential|critical|not)/i,
  /^you (can|should|need|must|will|may)/i,
  /^when (you|teams|companies|building|implementing)/i,
  /^integrating /i,
  /^the (principle|purpose|first|architecture|true)/i,
];

const EN_ALT_PATTERNS =
  /\b(illustrating|diagram|showing|flowchart|architecture|process steps|relationship|depicting|sketch showing|hierarchy diagram)\b/i;

const IT_ALT_PATTERNS = /\b(che|per|con|del|della|mostra|diagramma|flusso|illustra|schema)\b/i;

export function wordOverlapRatio(source, translated) {
  const srcWords = normalizeComparableText(source).split(' ').filter(Boolean);
  const outWords = new Set(normalizeComparableText(translated).split(' ').filter(Boolean));
  if (srcWords.length === 0) return 0;
  let overlap = 0;
  for (const word of srcWords) {
    if (outWords.has(word)) overlap++;
  }
  return overlap / srcWords.length;
}

export function countEnglishPhrases(text) {
  const lower = stripMarkdown(text).toLowerCase();
  let count = 0;
  for (const phrase of EN_PHRASES) {
    let idx = 0;
    while ((idx = lower.indexOf(phrase, idx)) !== -1) {
      count++;
      idx += phrase.length;
    }
  }
  return count;
}

function languageScore(text) {
  const words = stripMarkdown(text)
    .toLowerCase()
    .split(/[^a-zàèéìòù'-]+/)
    .filter((w) => w.length > 2);

  if (words.length < 6) return { en: 0, it: 0, ratio: 0 };

  let en = 0;
  let it = 0;
  for (const word of words) {
    if (EN_WORDS.has(word)) en++;
    if (IT_WORDS.has(word)) it++;
  }
  return { en, it, ratio: en / Math.max(en + it, 1) };
}

function isSkippableBlock(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return true;
  if (/^<iframe\b/i.test(trimmed)) return true;
  if (/^This reverts commit/i.test(trimmed)) return true;
  return false;
}

export function splitProseBlocks(content) {
  return String(content ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !isSkippableBlock(p))
    .filter((p) => !/^#{1,6}\s/.test(p))
    .filter((p) => !/^!\[/.test(p))
    .filter((p) => !/^>\s/.test(p))
    .filter((p) => !/^[-*]\s/.test(p))
    .filter((p) => !/^\|/.test(p))
    .filter((p) => p.length >= 80);
}

function looksEnglishProse(text) {
  const plain = stripMarkdown(text);
  if (plain.length < 60) return false;

  const { en, it, ratio } = languageScore(plain);
  if (ratio >= 0.58 && en >= 5 && en > it * 1.3) return true;

  const firstSentence = plain.split(/(?<=[.!?])\s+/)[0] ?? plain.slice(0, 140);
  if (EN_LINE_PATTERNS.some((re) => re.test(firstSentence))) {
    if (en >= 3 && en >= it) return true;
  }

  if (countEnglishPhrases(plain) >= 3 && en >= 4 && en > it) return true;

  return false;
}

export function findEnglishProseBlocks(content) {
  return splitProseBlocks(content).filter(looksEnglishProse);
}

export function findEnglishTableRows(content) {
  const rows = [];
  for (const line of String(content ?? '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!/^\|/.test(trimmed)) continue;
    if (/^[\|\s:-]+$/.test(trimmed)) continue;

    const { en, it, ratio } = languageScore(trimmed);
    const hasEnglishTableTerms =
      /\b(description|implementation|considerations|architecture|component|business|technical|requirement|complexity|trade off|identifier|function|purpose)\b/i.test(
        trimmed
      );
    const hasItalianTableTerms =
      /\b(descrizione|implementazione|architettura|componente|funzione|scopo|complessità|identificatore|requisito)\b/i.test(
        trimmed
      );

    if ((ratio >= 0.45 && en >= 3 && en > it) || (hasEnglishTableTerms && !hasItalianTableTerms && en >= 2)) {
      rows.push(trimmed);
    }
  }
  return rows;
}

export function findEnglishImageAlts(content) {
  const alts = [];
  const re = /!\[([^\]]+)\]\([^)]+\)/g;
  let match;
  while ((match = re.exec(String(content ?? ''))) !== null) {
    const alt = match[1].trim();
    if (alt.length < 20) continue;
    const { en, it, ratio } = languageScore(alt);
    if (EN_ALT_PATTERNS.test(alt) && !IT_ALT_PATTERNS.test(alt)) {
      alts.push(alt);
      continue;
    }
    if (ratio >= 0.5 && en >= 3 && en > it) alts.push(alt);
  }
  return alts;
}

export function findEnglishResidue(itBody) {
  const prose = findEnglishProseBlocks(itBody);
  const tables = findEnglishTableRows(itBody);
  const alts = findEnglishImageAlts(itBody);
  return { prose, tables, alts };
}

export function englishResidueReasons(itBody) {
  const { prose, tables, alts } = findEnglishResidue(itBody);
  const reasons = [];
  if (prose.length > 0) reasons.push(`english-prose:${prose.length}`);
  if (tables.length > 0) reasons.push(`english-table-rows:${tables.length}`);
  if (alts.length > 0) reasons.push(`english-image-alts:${alts.length}`);
  return reasons;
}

export function looksLikeEnglishArticle({ enTitle, enDescription, enBody, itTitle, itDescription, itBody }) {
  const reasons = [];

  const enTitleNorm = String(enTitle ?? '').trim().toLowerCase();
  const itTitleNorm = String(itTitle ?? '').trim().toLowerCase();
  if (enTitleNorm && enTitleNorm === itTitleNorm) {
    reasons.push('same-title-as-en');
  }

  const overlap = wordOverlapRatio(enBody, itBody);
  if (overlap >= 0.85) {
    reasons.push(`body-overlap:${Math.round(overlap * 100)}%`);
  } else if (overlap >= 0.72) {
    const enPhrases = countEnglishPhrases(itBody);
    const enSourcePhrases = countEnglishPhrases(enBody);
    if (enPhrases >= 8 && enPhrases >= enSourcePhrases * 0.55) {
      reasons.push(`body-overlap:${Math.round(overlap * 100)}%`, `english-phrases:${enPhrases}`);
    }
  }

  const descOverlap = wordOverlapRatio(enDescription, itDescription);
  if (descOverlap >= 0.85) {
    reasons.push(`description-overlap:${Math.round(descOverlap * 100)}%`);
  }

  reasons.push(...englishResidueReasons(itBody));

  return reasons;
}

export function needsItalianTranslation({
  enTitle,
  enDescription,
  enBody,
  itExists,
  itTitle,
  itDescription,
  itBody,
}) {
  if (!itExists) {
    return { needed: true, reasons: ['missing-it-file'] };
  }

  const reasons = looksLikeEnglishArticle({
    enTitle,
    enDescription,
    enBody,
    itTitle,
    itDescription,
    itBody,
  });

  return { needed: reasons.length > 0, reasons };
}
