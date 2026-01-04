# DEVISIA — Design System (Astro + Modern Vanilla CSS)

## Brand principles
- **Rational & calm**: minimal UI, high clarity, no decorative effects.
- **Enterprise-grade**: predictable patterns, strong accessibility defaults, stable spacing.
- **Timeless**: typography-led, subtle borders, restrained motion.
- **Technical**: clear hierarchy, consistent tokens, reusable components.

## Naming conventions (tokens)
- **Semantic first**: prefer meaning over raw values.
- Prefix: `--ds-*` for tokens.
- Categories:
  - **Color**: `--ds-color-*`
  - **Type**: `--ds-font-*`, `--ds-text-*`
  - **Space**: `--ds-space-*`
  - **Radius**: `--ds-radius-*`
  - **Shadow**: `--ds-shadow-*`
  - **Motion**: `--ds-motion-*`
  - **Layout**: `--ds-container-*`

## Color system (light + dark)
### Brand palette
- **Midnight Blue**: `#0B1F2A` (primary brand)
- **Charcoal**: `#111827` (text/deep neutral)
- **Off-white**: `#F7F9FB` (background)
- **Teal accent**: `#1FA2A6` (limited: CTA, links, focus)

### Semantic colors
- `--ds-color-bg`: page background
- `--ds-color-surface`: primary surface
- `--ds-color-surface-2`: secondary surface
- `--ds-color-text`: primary text
- `--ds-color-text-muted`: secondary text
- `--ds-color-border`: subtle borders
- `--ds-color-border-strong`: stronger borders
- `--ds-color-primary`: brand primary (Midnight Blue)
- `--ds-color-accent`: teal accent
- `--ds-color-focus`: focus ring color (teal with alpha)

### Dark mode
Dark theme is enabled via:
- `[data-theme="dark"]` on `<html>` (preferred)
- Progressive enhancement: `@media (prefers-color-scheme: dark)` when no explicit theme set

## Typography
### Typeface
- **Inter** everywhere (weights: 400, 500, 600).

### Type scale (clamp, rem-based)
- `--ds-text-xs` … `--ds-text-4xl` are defined with `clamp()` for responsive scaling.
- Base line-height defaults:
  - Body: `1.6`
  - Headings: `1.15–1.25`

### Letter spacing rules
- **Wordmark**: uppercase tracking “+3/+4 feel” → `letter-spacing: 0.06em` (approx).
- Headings: slight negative tracking at large sizes is acceptable (`-0.01em`) for crispness.

### Text wrapping
Use modern enhancements:
- `text-wrap: balance` for headings (progressive)
- `overflow-wrap: anywhere` for long tokens/URLs

### Typography refinements
- **Body text line length**: Paragraphs use `max-width: min(65ch, 100%)` for optimal readability
- **Paragraph spacing**: `margin-bottom: var(--ds-space-5)` (24px) for comfortable reading
- **List item spacing**: `margin-bottom: var(--ds-space-2)` (8px) between list items
- **Mobile paragraph spacing**: Reduced to `var(--ds-space-4)` (16px) on screens < 36rem

## Spacing scale (8pt system)
Defined as `--ds-space-1..10` (4px → 80px) plus fluid spacing tokens.

## Radius, borders, shadows
- Radius: subtle (`--ds-radius-1..4`)
- Borders: 1px standard, 2px strong
- Shadows: extremely subtle (`--ds-shadow-1..2`) — prefer borders

## Motion rules
- Use `prefers-reduced-motion` to reduce transitions/animations.
- Keep transitions short and calm:
  - `--ds-motion-fast`: 120ms
  - `--ds-motion-base`: 180ms
  - `--ds-motion-slow`: 240ms

## Layout & grid
### Containers
- Use `.ds-container` for max-width constraints.
- Recommended content widths:
  - Reading: ~72ch (articles)
  - Marketing: 1100–1200px

### Breakpoints (guidance)
Prefer **container queries** over global breakpoints. Where needed:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Container query strategy
- Components (Cards, Tables, Nav) adapt with `@container` where it makes sense
- **Mobile optimization**: Container queries at `max-width: 36rem` reduce vertical density:
  - Stack gaps: `--ds-space-3` (12px)
  - Large stack gaps: `--ds-space-4` (16px)
  - Grid gaps: `--ds-space-4` (16px)

---

## Components (specs + accessibility)

### Button
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- States: hover/active/disabled, focus-visible ring
- A11y: ensure `type="button"` when used for non-submit actions

### Link
- Variants: default, muted, nav
- A11y: visible focus ring, underline on hover

### Input / Textarea / Select
- States: default, focus, invalid, disabled
- A11y: always use `<label for>` or `aria-label`
- Use `accent-color` and `:focus-visible`

### Checkbox / Radio
- Use native inputs (best accessibility)
- Label click targets must include control

### Toggle (Switch)
- Implement using `<input type="checkbox" role="switch">`
- A11y: label required; focus ring on control

### Badge / Tag
- Status/label pills, subtle borders, no heavy backgrounds

### Alert
- Variants: info/success/warning/danger
- A11y: use `role="status"` for non-critical, `role="alert"` for critical

### Toast (pattern)
- Use `position: fixed` + `role="status"`; keep motion minimal

### Modal/Dialog
- Use native `<dialog>` with `showModal()`
- A11y: include accessible title, close button, focus trapping (native)

### Card
- Subtle border + surface; optional header/footer slots
- **Padding**: `var(--ds-space-6)` (32px) — increased for better readability
- **Mobile padding**: Reduced to `var(--ds-space-5)` (24px) on screens < 36rem
- **Typography hierarchy**:
  - H3: `font-weight: 700`, `font-size: var(--ds-text-xl)`
  - Body text: `font-size: var(--ds-text-sm)`, muted color, relaxed line-height
- **Images**: Aspect ratio 16:9, `object-fit: cover`, `border-radius: var(--ds-radius-3)`

### Navbar / Footer
- Wordmark typography only; clear navigation hierarchy; skip link

### Tabs
- A11y: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Keyboard: arrows, Home/End, Enter/Space

### Accordion
- Prefer `<details>/<summary>`; accessible by default

### Table
- Use semantic `<table>`; responsive wrapper; consistent cell padding

### Pagination (pattern)
- `<nav aria-label="Pagination">` with links and `aria-current="page"`

### Breadcrumbs (pattern)
- `<nav aria-label="Breadcrumb">` + ordered list

### Tooltip
- Pure CSS hover + focus-within; include tooltip element in DOM
- A11y: tooltip content available on focus

### Code block
- Use `pre > code`, monospace, subtle surface; allow horizontal scroll

---

## Image guidelines
### Standardization
- **Aspect ratio**: 16:9 for all card images
- **Object fit**: `cover` to maintain proportions
- **Border radius**: `var(--ds-radius-3)` to match card styling
- **Spacing**: `margin-top: var(--ds-space-4)` around image containers
- **Loading strategy**:
  - Hero images: `loading="eager"` (above the fold)
  - Other images: `loading="lazy"` (below the fold)
- **Decoding**: Always use `decoding="async"` for performance

## Section separation
### Visual rhythm
- **Major sections**: Use `margin-top: var(--ds-space-10)` (80px) for clear separation
- **Section separators**: Optional `border-top` with `padding-top: var(--ds-space-8)` (48px)
- **Boxed sections**: Use only when changing visual rhythm; prefer subtle borders over shadows
- **CTA sections**: Maintain box styling but avoid unnecessary shadows

## Example usage

### Hero section
- Use `.ds-hero`, `.ds-stack`, primary button and secondary link
- **H1 styling**: `font-weight: 700` for increased prominence
- **Subtitle styling**: `font-size: var(--ds-text-sm)`, muted color for reduced visual weight
- **Spacing**: `margin-bottom: var(--ds-space-8)` (48px) below hero section
- **Image spacing**: `margin-top: var(--ds-space-4)` around hero images

### Service cards
- Use `.ds-grid` + `Card` with `Badge/Tag`
- Keep card descriptions concise (20-30% reduction from original)
- Ensure strong visual hierarchy with prominent H3 titles

### Case study layout
- Use reading container width, headings with balanced wrap, table for outcomes

### Editorial sections
- Prefer editorial blocks over bullet lists
- Use H4 titles with descriptive paragraphs
- Increase spacing between items: `data-gap="lg"` (32px)

---

## Implementation files
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/components.css`
- `src/styles/utilities.css`
- UI components in `src/components/ui/*`
- Demo page: `src/pages/design-system.astro`

