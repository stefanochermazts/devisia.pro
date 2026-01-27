const SENSITIVE_PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: 'PRIVATE_KEY_BLOCK', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { name: 'SSH_PUBLIC_KEY', re: /\bssh-(rsa|ed25519)\s+[A-Za-z0-9+/=]{32,}\b/i },
  { name: 'JWT', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ },
  { name: 'OPENAI_KEY', re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { name: 'BEARER_TOKEN', re: /\bAuthorization:\s*Bearer\s+[A-Za-z0-9._\-+/=]{16,}\b/i },
  { name: 'AWS_ACCESS_KEY_ID', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'AWS_SECRET_LIKE', re: /\baws(.{0,20})?(secret|token)(.{0,20})?[:=]\s*[A-Za-z0-9/+=]{20,}\b/i },
  // IBAN-like (very rough): country + 2 digits + 11..30 alnum
  { name: 'IBAN_LIKE', re: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/ },
];

export function detectSensitiveInput(input: string): { isSensitive: boolean; matches: string[] } {
  const matches: string[] = [];
  const text = String(input ?? '');

  for (const p of SENSITIVE_PATTERNS) {
    if (p.re.test(text)) matches.push(p.name);
  }

  return { isSensitive: matches.length > 0, matches };
}

