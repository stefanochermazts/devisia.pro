export type ArtifactV1 = {
  schema_version: 'v1';
  system_overview: string;
  core_domain_model: Array<{ name: string; description: string }>;
  key_flows: Array<{ title: string; steps: string[] }>;
  critical_considerations: {
    technical: string[];
    privacy_data: string[];
    architectural: string[];
  };
};

export type ArtifactRecordV1 = {
  ref_id: string;
  created_at: string; // ISO
  schema_version: 'v1';
  input_raw: string;
  output_json: ArtifactV1;
  content_hash: string;
  email: string;
  name?: string;
  note?: string;
  consent_timestamp: string; // ISO
  retention_days: 30;
  retention_policy_version: 'v1';
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(obj: Record<string, unknown>, keys: string[]) {
  const actual = Object.keys(obj).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (actual[i] !== expected[i]) return false;
  }
  return true;
}

function sentenceCount(text: string) {
  // Conservative: split on ., !, ? sequences; ignore very short fragments.
  const parts = text
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
  return parts.length;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStringArray(v: unknown) {
  return Array.isArray(v) && v.every((x) => isNonEmptyString(x));
}

export function validateArtifactV1(input: unknown): { ok: true; value: ArtifactV1 } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isPlainObject(input)) return { ok: false, errors: ['Artifact must be an object.'] };

  if (
    !hasExactKeys(input, [
      'schema_version',
      'system_overview',
      'core_domain_model',
      'key_flows',
      'critical_considerations',
    ])
  ) {
    errors.push('Artifact has unexpected or missing top-level keys.');
  }

  const schema_version = input.schema_version;
  if (schema_version !== 'v1') errors.push('schema_version must be "v1".');

  const system_overview = input.system_overview;
  if (!isNonEmptyString(system_overview)) errors.push('system_overview must be a non-empty string.');
  else {
    const sc = sentenceCount(system_overview);
    if (sc < 4 || sc > 6) errors.push('system_overview must be 4–6 sentences.');
  }

  const core_domain_model = input.core_domain_model;
  if (!Array.isArray(core_domain_model)) errors.push('core_domain_model must be an array.');
  else {
    if (core_domain_model.length < 6 || core_domain_model.length > 8) {
      errors.push('core_domain_model must contain 6–8 entities.');
    }
    core_domain_model.forEach((e, idx) => {
      if (!isPlainObject(e)) {
        errors.push(`core_domain_model[${idx}] must be an object.`);
        return;
      }
      if (!hasExactKeys(e, ['name', 'description'])) {
        errors.push(`core_domain_model[${idx}] has unexpected or missing keys.`);
      }
      if (!isNonEmptyString(e.name)) errors.push(`core_domain_model[${idx}].name must be a non-empty string.`);
      if (!isNonEmptyString(e.description))
        errors.push(`core_domain_model[${idx}].description must be a non-empty string.`);
    });
  }

  const key_flows = input.key_flows;
  if (!Array.isArray(key_flows)) errors.push('key_flows must be an array.');
  else {
    if (key_flows.length < 2 || key_flows.length > 4) errors.push('key_flows must contain 2–4 flows.');
    key_flows.forEach((f, idx) => {
      if (!isPlainObject(f)) {
        errors.push(`key_flows[${idx}] must be an object.`);
        return;
      }
      if (!hasExactKeys(f, ['title', 'steps'])) errors.push(`key_flows[${idx}] has unexpected or missing keys.`);
      if (!isNonEmptyString(f.title)) errors.push(`key_flows[${idx}].title must be a non-empty string.`);
      if (!Array.isArray(f.steps)) errors.push(`key_flows[${idx}].steps must be an array.`);
      else {
        if (f.steps.length < 2 || f.steps.length > 3) errors.push(`key_flows[${idx}].steps must have 2–3 steps.`);
        f.steps.forEach((s, sIdx) => {
          if (!isNonEmptyString(s)) errors.push(`key_flows[${idx}].steps[${sIdx}] must be a non-empty string.`);
        });
      }
    });
  }

  const critical_considerations = input.critical_considerations;
  if (!isPlainObject(critical_considerations)) errors.push('critical_considerations must be an object.');
  else {
    if (!hasExactKeys(critical_considerations, ['technical', 'privacy_data', 'architectural'])) {
      errors.push('critical_considerations has unexpected or missing keys.');
    }

    const { technical, privacy_data, architectural } = critical_considerations;
    if (!isStringArray(technical)) errors.push('critical_considerations.technical must be a string array.');
    else if (technical.length < 1 || technical.length > 3)
      errors.push('critical_considerations.technical must have 1–3 items.');

    if (!isStringArray(privacy_data)) errors.push('critical_considerations.privacy_data must be a string array.');
    else if (privacy_data.length < 1 || privacy_data.length > 3)
      errors.push('critical_considerations.privacy_data must have 1–3 items.');

    if (!isStringArray(architectural)) errors.push('critical_considerations.architectural must be a string array.');
    else if (architectural.length < 1 || architectural.length > 3)
      errors.push('critical_considerations.architectural must have 1–3 items.');
  }

  if (errors.length) return { ok: false, errors };

  // At this point we have validated structure well enough to cast.
  return { ok: true, value: input as ArtifactV1 };
}

