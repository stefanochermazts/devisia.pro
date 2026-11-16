import { describe, expect, it } from 'vitest';
import {
  DEFAULT_AI_ACT_INPUT,
  classifyAiActUseCase,
  formatAiActReport,
  getAiActPresets,
} from '../../src/lib/euAiActClassifier';

describe('EU AI Act risk tier classifier', () => {
  it('flags workplace emotion recognition as Prohibited (Art. 5)', () => {
    const result = classifyAiActUseCase({
      ...DEFAULT_AI_ACT_INPUT,
      prohibitedCheck: 'emotion_work_edu',
      annexIiiDomain: 'employment_hr',
    });
    expect(result.tier).toBe('prohibited');
    expect(result.badgeTone).toBe('danger');
    expect(result.primaryArticle).toContain('Art. 5');
  });

  it('flags an Annex I regulated safety component as High-Risk (Art. 6(1))', () => {
    const result = classifyAiActUseCase(
      {
        ...DEFAULT_AI_ACT_INPUT,
        operatorRole: 'provider',
        safetyComponent: 'annex_i_safety',
        transparencyTrigger: 'none',
      },
      'en',
    );
    expect(result.tier).toBe('high_risk');
    expect(result.primaryArticle).toContain('Art. 6(1)');
    expect(result.evidences.some((ev) => ev.id === 'art11-12-tech-doc-logs')).toBe(true);
  });

  it('distinguishes Provider vs Deployer obligations for Annex III High-Risk systems', () => {
    const deployerResult = classifyAiActUseCase({
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'profiles_individuals',
      transparencyTrigger: 'chatbot_human_interaction',
    });
    const providerResult = classifyAiActUseCase({
      operatorRole: 'provider',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'influences_decision',
      transparencyTrigger: 'none',
    });

    expect(deployerResult.tier).toBe('high_risk');
    expect(providerResult.tier).toBe('high_risk');
    expect(deployerResult.evidences.some((ev) => ev.id === 'art26-log-retention')).toBe(true);
    expect(deployerResult.evidences.some((ev) => ev.id === 'art50-interaction-notice')).toBe(true);
    expect(providerResult.evidences.some((ev) => ev.id === 'art43-49-conformity-eu-db')).toBe(true);
  });

  it('identifies the Art. 6(3) documented exemption for narrow procedural tasks in Annex III without profiling', () => {
    const result = classifyAiActUseCase({
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'essential_services_credit',
      decisionAutonomy: 'narrow_procedural',
      transparencyTrigger: 'none',
    });
    expect(result.tier).toBe('annex_iii_derogation');
    expect(result.primaryArticle).toContain('Art. 6(3)');
    expect(result.evidences.some((ev) => ev.id === 'art6-3-documented-assessment')).toBe(true);
  });

  it('classifies a customer-facing chatbot outside Annex III under Art. 50 transparency obligations', () => {
    const result = classifyAiActUseCase(DEFAULT_AI_ACT_INPUT, 'it');
    expect(result.tier).toBe('limited_transparency');
    expect(result.primaryArticle).toContain('Art. 50');
    expect(result.evidences.some((ev) => ev.id === 'art50-interaction-notice')).toBe(true);
    expect(result.evidences.some((ev) => ev.id === 'art4-ai-literacy')).toBe(true);
  });

  it('classifies an internal back-office copilot as Minimal Risk (Art. 4 & 95) and formats a report', () => {
    const result = classifyAiActUseCase(
      {
        operatorRole: 'deployer',
        prohibitedCheck: 'none',
        safetyComponent: 'none',
        annexIiiDomain: 'none',
        decisionAutonomy: 'narrow_procedural',
        transparencyTrigger: 'none',
      },
      'en',
    );
    expect(result.tier).toBe('minimal_risk');
    expect(result.badgeTone).toBe('success');
    const report = formatAiActReport(result, 'en');
    expect(report).toContain('EU AI ACT PRELIMINARY CLASSIFICATION');
    expect(report).toContain('[Art. 4]');
  });

  it('exposes matching preset scenarios in Italian and English', () => {
    const itPresets = getAiActPresets('it');
    const enPresets = getAiActPresets('en');
    expect(itPresets.map((p) => p.id)).toEqual(enPresets.map((p) => p.id));
    expect(itPresets).toHaveLength(4);
  });
});
