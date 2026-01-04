# Devisia Website Refinement Plan

## Overview
Refine the existing devisia.pro website (Astro + Decap CMS) to improve visual hierarchy, spacing, clarity, and calmness while respecting the existing Design System.

## Goals
- Improve visual hierarchy and spacing
- Reduce visual noise
- Increase perceived quality
- Maintain existing Design System (no new colors/tokens)
- Prioritize clarity over completeness

## Steps

### Step 1: Audit Design System Tokens
**Action:** Audit the current Design System tokens, spacing scale, and utility classes used across the site.

**Reasoning:** Understanding the exact values of --ds-space-*, --ds-typography-*, and existing utility classes is essential before making visual adjustments, ensuring we stay within the established design language and avoid introducing new colors or styles.

**Implementation:**
- Open DESIGN_SYSTEM.md and locate the sections for spacing, typography, and color tokens
- Verify that tokens are defined in src/styles/tokens.css using the `--ds-` prefix
- Create a quick reference table summarizing heading sizes, paragraph spacing, padding tokens
- Confirm utility classes (.ds-stack, .ds-grid, .ds-cluster, .ds-reading) are correctly implemented
- Note any deviations or undocumented tokens

### Step 2: Enhance Hero Sections
**Action:** Enhance the Hero sections (HomeHero.astro and PageHero.astro) to increase H1 prominence, tone down subtitle weight, and add more vertical space below the hero copy.

**Reasoning:** The hero is the first visual hierarchy cue; boosting the H1 size/weight and improving spacing will instantly convey calm confidence and guide the eye.

### Step 3: Remove Duplicate Sections
**Action:** Remove duplicate "Cosa facciamo" sections and ensure it appears only once on each language home page.

**Reasoning:** Duplicate sections cause visual clutter and break the calm hierarchy the design strives for.

### Step 4: Refactor Card Components
**Action:** Refactor Card components to reduce text length by 20-30%, increase internal padding, and strengthen visual hierarchy.

**Reasoning:** Cards are repeated UI patterns; tightening copy and adding breathing room improves readability and calmness.

### Step 5: Improve Global Typography
**Action:** Improve global typography: shorten line length, increase paragraph spacing, and ensure fluid scaling across breakpoints.

**Reasoning:** Long line lengths strain reading; more paragraph spacing adds calmness and aligns with the design system's 8 pt grid.

### Step 6: Redesign "How we work" Section
**Action:** Redesign the "How we work" section to be more editorial, reducing bullet density.

**Reasoning:** Bulleted lists can feel mechanical; an editorial tone with fewer, more spaced items aligns with the calm, rational brand.

### Step 7: Audit Boxed Sections
**Action:** Audit and adjust "boxed" sections to appear only when they change visual rhythm; otherwise replace with simple stacking.

**Reasoning:** Unnecessary boxes add visual noise; keeping them purposeful maintains calm hierarchy.

### Step 8: Improve Services Page Structure
**Action:** Improve separation between service groups on the Services pages.

**Reasoning:** Clear grouping helps users scan offerings without feeling crowded.

### Step 9: Reduce Mobile Vertical Density
**Action:** Reduce vertical density on mobile devices across all pages.

**Reasoning:** Mobile users need more breathing room; tightening vertical spacing can feel cramped.

### Step 10: Standardize Image Styling
**Action:** Standardize image styling: ensure consistent aspect ratios, spacing, and lazy loading.

**Reasoning:** Uniform images reinforce a calm visual language and improve load performance.

### Step 11: Final Quality Check
**Action:** Perform a final quality check prioritizing clarity over completeness.

**Reasoning:** Ensuring the site feels calm and readable is more important than adding every possible micro-detail.

### Step 12: Update Documentation
**Action:** Update DESIGN_SYSTEM.md to reflect any token usage changes.

**Reasoning:** Documentation must stay in sync with the codebase to guide future contributors.
