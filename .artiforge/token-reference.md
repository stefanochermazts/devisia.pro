# Design System Token Reference

**Last Updated:** 2024  
**Source Files:** `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`, `src/styles/utilities.css`

---

## Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-brand-midnight` | `#0b1f2a` | Primary brand color |
| `--ds-brand-charcoal` | `#111827` | Text/deep neutral |
| `--ds-brand-offwhite` | `#f7f9fb` | Background |
| `--ds-brand-teal` | `#1fa2a6` | Accent color (limited use) |

---

## Typography

### Font Families
| Token | Value |
|-------|-------|
| `--ds-font-sans` | `Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif` |
| `--ds-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

### Type Scale (Fluid, rem-based)
| Token | Value | Usage |
|-------|-------|-------|
| `--ds-text-xs` | `clamp(0.75rem, 0.73rem + 0.15vw, 0.82rem)` | Extra small text |
| `--ds-text-sm` | `clamp(0.875rem, 0.85rem + 0.22vw, 0.95rem)` | Small text |
| `--ds-text-md` | `clamp(1rem, 0.98rem + 0.3vw, 1.125rem)` | Base body text |
| `--ds-text-lg` | `clamp(1.125rem, 1.05rem + 0.55vw, 1.375rem)` | Large text |
| `--ds-text-xl` | `clamp(1.25rem, 1.12rem + 0.85vw, 1.65rem)` | Extra large (H4) |
| `--ds-text-2xl` | `clamp(1.5rem, 1.25rem + 1.35vw, 2.05rem)` | 2XL (H3) |
| `--ds-text-3xl` | `clamp(1.85rem, 1.4rem + 2.1vw, 2.65rem)` | 3XL (H2) |
| `--ds-text-4xl` | `clamp(2.25rem, 1.6rem + 3vw, 3.35rem)` | 4XL (H1) |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--ds-leading-tight` | `1.15` | Headings |
| `--ds-leading-base` | `1.6` | Body text |
| `--ds-leading-relaxed` | `1.75` | Relaxed text |

### Letter Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--ds-tracking-tight` | `-0.01em` | Headings (large sizes) |
| `--ds-tracking-base` | `0` | Default |
| `--ds-tracking-wordmark` | `0.06em` | Wordmark/logo |

---

## Spacing Scale (8pt System)

| Token | Value (rem) | Pixels | Usage |
|-------|-------------|-------|-------|
| `--ds-space-0` | `0` | 0px | No spacing |
| `--ds-space-1` | `0.25rem` | 4px | Minimal spacing |
| `--ds-space-2` | `0.5rem` | 8px | Small gaps (`.ds-stack[data-gap="sm"]`) |
| `--ds-space-3` | `0.75rem` | 12px | Small-medium gaps (`.ds-cluster`) |
| `--ds-space-4` | `1rem` | 16px | Base spacing (`.ds-stack` default) |
| `--ds-space-5` | `1.5rem` | 24px | Medium spacing (`.ds-grid`, card padding) |
| `--ds-space-6` | `2rem` | 32px | Large gaps (`.ds-stack[data-gap="lg"]`) |
| `--ds-space-7` | `2.5rem` | 40px | Large-medium spacing |
| `--ds-space-8` | `3rem` | 48px | Extra large spacing (main content padding) |
| `--ds-space-9` | `4rem` | 64px | Very large spacing |
| `--ds-space-10` | `5rem` | 80px | Maximum spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-radius-1` | `0.375rem` | Small radius |
| `--ds-radius-2` | `0.5rem` | Default radius (buttons, inputs) |
| `--ds-radius-3` | `0.75rem` | Medium radius (cards, alerts) |
| `--ds-radius-4` | `1rem` | Large radius |
| `--ds-radius-round` | `999px` | Fully rounded (badges, switches) |

---

## Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-border-1` | `1px` | Standard border |
| `--ds-border-2` | `2px` | Strong border |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-shadow-1` | `0 1px 2px rgba(0, 0, 0, 0.06)` | Subtle shadow (cards) |
| `--ds-shadow-2` | `0 6px 18px rgba(0, 0, 0, 0.10)` | Medium shadow (tooltips, toasts) |

---

## Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-motion-fast` | `120ms` | Fast transitions |
| `--ds-motion-base` | `180ms` | Standard transitions |
| `--ds-motion-slow` | `240ms` | Slow transitions |
| `--ds-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Standard easing |

---

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-container-max` | `72rem` (1152px) | Maximum container width |
| `--ds-container-pad` | `clamp(1rem, 0.5rem + 2vw, 2rem)` | Container padding |
| `--ds-reading-max` | `72ch` | Maximum reading width |

---

## Semantic Colors (Light Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-color-bg` | `var(--ds-brand-offwhite)` | Page background |
| `--ds-color-surface` | `#ffffff` | Primary surface |
| `--ds-color-surface-2` | `color-mix(in srgb, var(--ds-color-surface) 85%, var(--ds-brand-offwhite))` | Secondary surface |
| `--ds-color-text` | `var(--ds-brand-charcoal)` | Primary text |
| `--ds-color-text-muted` | `color-mix(in srgb, var(--ds-color-text) 70%, white)` | Secondary/muted text |
| `--ds-color-primary` | `var(--ds-brand-midnight)` | Primary brand color |
| `--ds-color-accent` | `var(--ds-brand-teal)` | Accent color (CTAs, links) |
| `--ds-color-border` | `color-mix(in srgb, var(--ds-brand-charcoal) 10%, white)` | Subtle borders |
| `--ds-color-border-strong` | `color-mix(in srgb, var(--ds-brand-charcoal) 18%, white)` | Strong borders |
| `--ds-color-focus` | `color-mix(in srgb, var(--ds-color-accent) 40%, transparent)` | Focus ring color |
| `--ds-color-danger` | `#b42318` | Error/danger states |
| `--ds-color-warning` | `#b54708` | Warning states |
| `--ds-color-success` | `#067647` | Success states |
| `--ds-color-info` | `#175cd3` | Info states |
| `--ds-focus-ring` | `0 0 0 3px var(--ds-color-focus)` | Focus ring shadow |

### Dark Mode Overrides
Dark mode colors are defined in `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`. They use the same token names but with different values.

---

## Utility Classes

### Layout Primitives

| Class | Properties | Usage |
|-------|------------|-------|
| `.ds-container` | `max-width: var(--ds-container-max)`, `padding-inline: var(--ds-container-pad)` | Main container |
| `.ds-reading` | `max-width: var(--ds-reading-max)` | Reading width container |
| `.ds-stack` | `display: flex`, `flex-direction: column`, `gap: var(--ds-space-4)` | Vertical stack |
| `.ds-stack[data-gap="sm"]` | `gap: var(--ds-space-2)` | Small gap stack |
| `.ds-stack[data-gap="lg"]` | `gap: var(--ds-space-6)` | Large gap stack |
| `.ds-cluster` | `display: flex`, `flex-wrap: wrap`, `gap: var(--ds-space-3)` | Horizontal cluster |
| `.ds-grid` | `display: grid`, `gap: var(--ds-space-5)` | Grid layout |
| `.ds-grid[data-cols="2"]` | `grid-template-columns: repeat(2, minmax(0, 1fr))` | 2-column grid |
| `.ds-grid[data-cols="3"]` | `grid-template-columns: repeat(3, minmax(0, 1fr))` | 3-column grid |
| `.ds-grid[data-cols="4"]` | `grid-template-columns: repeat(4, minmax(0, 1fr))` | 4-column grid |

### Inline Utilities

| Class | Properties | Usage |
|-------|------------|-------|
| `.ds-muted` | `color: var(--ds-color-text-muted)` | Muted text color |
| `.ds-surface` | `background: var(--ds-color-surface)` | Surface background |
| `.ds-surface-2` | `background: var(--ds-color-surface-2)` | Secondary surface |
| `.ds-border` | `border: var(--ds-border-1) solid var(--ds-color-border)` | Standard border |
| `.ds-radius-2` | `border-radius: var(--ds-radius-2)` | Default radius |
| `.ds-shadow-1` | `box-shadow: var(--ds-shadow-1)` | Subtle shadow |
| `.ds-pad-4` | `padding: var(--ds-space-4)` | Standard padding |

---

## Component Classes

### Buttons (`.ds-btn`)
- Variants: `data-variant="primary"`, `data-variant="secondary"`, `data-variant="ghost"`, `data-variant="danger"`
- Sizes: `data-size="sm"`, `data-size="md"` (default), `data-size="lg"`

### Cards (`.ds-card`)
- Body: `.ds-card__body` (padding: `var(--ds-space-5)`)

### Links (`.ds-link`)
- Variants: default, `data-variant="muted"`

### Form Elements
- Field: `.ds-field` (gap: `var(--ds-space-2)`)
- Label: `.ds-label` (font-size: `var(--ds-text-sm)`, font-weight: 600)
- Hint: `.ds-hint` (font-size: `var(--ds-text-xs)`, color: muted)
- Input/Textarea/Select: `.ds-input`, `.ds-textarea`, `.ds-select`

### Badges/Tags (`.ds-badge`, `.ds-tag`)
- Tone: `data-tone="accent"`

### Alerts (`.ds-alert`)
- Tones: `data-tone="info"`, `data-tone="success"`, `data-tone="warning"`, `data-tone="danger"`

---

## Container Queries

The design system uses container queries for responsive behavior:

- `@container (max-width: 52rem)`: 3-col and 4-col grids → 2-col
- `@container (max-width: 36rem)`: All grids → 1-col

---

## Notes

1. **No new tokens should be created** - Use existing tokens only
2. **Color tokens are semantic** - Use `--ds-color-*` tokens, not brand colors directly
3. **Spacing follows 8pt system** - Use `--ds-space-*` tokens
4. **Typography is fluid** - All text sizes use `clamp()` for responsive scaling
5. **Dark mode is progressive** - Supports both explicit theme and system preference
