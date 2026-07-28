# Taski — Design System

Single source of truth for colors, typography, spacing, components, motion, and usage rules across the Taski app. All visual decisions should resolve here first; changes to tokens happen in `src/index.css` (`@theme` block) and propagate automatically through Tailwind utilities.

---

## 1. Foundations

### 1.1 Color tokens

All colors are defined as CSS variables in `src/index.css` and surfaced to Tailwind via `@theme`. Never hardcode hex values in components — always use the token utility class (e.g. `bg-bg-primary`, `text-accent`).

#### Light theme (default)

| Token | Hex | Tailwind class | Purpose |
|---|---|---|---|
| `--color-bg-primary` | `#FAFAF9` | `bg-bg-primary` | App background, main canvas |
| `--color-bg-secondary` | `#F5F5F4` | `bg-bg-secondary` | Hover states, subtle panels, kanban columns |
| `--color-bg-elevated` | `#FFFFFF` | `bg-bg-elevated` | Cards, dialogs, sheets, input fields |
| `--color-text-primary` | `#1C1917` | `text-text-primary` | Body text, headings |
| `--color-text-secondary` | `#78716C` | `text-text-secondary` | Labels, supporting copy |
| `--color-text-muted` | `#A8A29E` | `text-text-muted` | Placeholders, disabled text, meta |
| `--color-accent` | `#6366F1` | `bg-accent` / `text-accent` | Primary brand, CTAs, focus ring, links |
| `--color-accent-hover` | `#4F46E5` | `bg-accent-hover` | Hover state for accent surfaces |
| `--color-border` | `#E7E5E4` | `border-border` | All 1px dividers and control borders |

#### Dark theme (`[data-theme="dark"]`)

Only tokens that shift in dark mode are listed. Semantic colors (accent, priority, status) stay constant.

| Token | Hex |
|---|---|
| `--color-bg-primary` | `#0C0A09` |
| `--color-bg-secondary` | `#1C1917` |
| `--color-bg-elevated` | `#292524` |
| `--color-text-primary` | `#FAFAF9` |
| `--color-text-secondary` | `#A8A29E` |
| `--color-text-muted` | `#78716C` |
| `--color-border` | `#44403C` |
| `--color-status-todo` | `#44403C` |

#### Semantic colors (theme-invariant)

| Token | Hex | Used for |
|---|---|---|
| `--color-priority-high` | `#DC2626` | Priority "Alta", destructive actions |
| `--color-priority-medium` | `#F59E0B` | Priority "Média" |
| `--color-priority-low` | `#6B7280` | Priority "Baixa" |
| `--color-status-todo` | `#E5E7EB` (light) / `#44403C` (dark) | Status "A fazer" dot/chip |
| `--color-status-progress` | `#3B82F6` | Status "Em progresso" |
| `--color-status-done` | `#10B981` | Status "Concluído", success |

**Contrast rules:**
- Body text (`text-primary` on `bg-primary`) meets WCAG AA at all sizes, both themes.
- `text-muted` is reserved for supporting copy only — never use for primary information.
- Never pair `text-muted` with `bg-secondary` (insufficient contrast).

---

### 1.2 Typography

#### Font stacks

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Geist', ui-sans-serif, system-ui, sans-serif` | Everything by default |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` | Code, keyboard shortcuts (`<kbd>`), timestamps |

Fonts are self-hosted as variable woff2 at `/public/fonts/`. `font-display: swap`.

#### Scale (Tailwind defaults, adjusted conventions)

| Tailwind | Size / line-height | Where it's used |
|---|---|---|
| `text-xs` | 12 / 16 | Meta, badges, hints, form labels (`font-medium`) |
| `text-sm` | 14 / 20 | Body text, buttons, inputs, most UI |
| `text-base` | 16 / 24 | Rare — long-form reading |
| `text-lg` | 18 / 28 | Section titles inside cards |
| `text-xl` | 20 / 28 | Page subtitles |
| `text-2xl` | 24 / 32 | Card titles, logo lockup md |
| `text-3xl` | 30 / 36 | Auth screen titles, empty states |
| `text-4xl` | 36 / 40 | Logo lockup lg, marketing headlines |

#### Weight + tracking

- Default weight: `font-normal` (400).
- UI accents use `font-medium` (500): buttons, labels, selected chip text.
- Headings use `font-semibold` (600) with `tracking-tight` (`-0.025em`).
- Logo wordmark uses `letterSpacing: -0.03em` (slightly tighter than `tracking-tight`).
- Never use `font-bold` (700+) — breaks the "calm" voice.

---

### 1.3 Spacing

Tailwind's default 4-px scale. House rules:

- **Component internal padding:** `p-3` (12) for compact, `p-5`/`p-6` (20/24) for cards.
- **Form field height:** `h-11` (44) for auth/primary forms, `h-10` (40) for inline forms, `h-9` (36) for dense tables.
- **Gap between form rows:** `space-y-4` (16).
- **Gap between sections:** `mt-8` (32).
- **Card wrapper:** `bg-bg-elevated border border-border rounded-lg p-5 md:p-6`.

---

### 1.4 Radii

| Token | Px | Use |
|---|---|---|
| `--radius-sm` | 6 | Focus outline, small chips |
| `--radius-md` | 10 | Buttons, inputs, secondary cards |
| `--radius-lg` | 16 | Primary cards, dialogs, sheets |
| `--radius-full` | 9999 | Badges, avatars, pills |

Tailwind shorthand: `rounded-md` = 6 (default md), `rounded-lg` = 8 (default lg). Tokens above are the *intended* values — verify per component; most UI uses literal Tailwind classes `rounded-lg` (8) and `rounded-full`.

---

### 1.5 Elevation

Taski uses **borders, not shadows**, for structure. Shadows are reserved for temporary overlays.

| Context | Treatment |
|---|---|
| Cards, panels | `border border-border` on `bg-bg-elevated`. No shadow. |
| Dropdowns, popovers | `shadow-md` + border |
| Dialogs, sheets | `shadow-lg` + backdrop blur |
| Toasts | `shadow-lg`, no border |

---

### 1.6 Motion

#### Easing + keyframes

Custom easing: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (fast out, gentle settle). Use for all UI transitions.

#### Utility classes (defined in `src/index.css`)

| Class | Duration | Effect |
|---|---|---|
| `animate-fade-in` | 300ms | Opacity 0→1 |
| `animate-fade-in-up` | 400ms | Opacity + translateY 8px |
| `animate-scale-in` | 300ms | Opacity + scale 0.95→1 |
| `animate-slide-in-right` | 300ms | Opacity + translateX 16px |
| `animate-check-pop` | 300ms | Scale 1→1.3→1 (checkmark feedback) |
| `animate-stagger > *` | 400ms, +50ms per child | Cascading entrance for lists |

#### Transition rules

- Hover on interactive elements: `transition-colors` (no duration override — uses Tailwind default 150ms).
- Never animate `all` — always target specific properties.
- Respect `prefers-reduced-motion` via Tailwind `motion-safe:` prefix when adding entrance animations.

---

## 2. Components

All components live under `src/components/`. Shared primitives are in `src/components/ui/` (shadcn-style), domain components are one level up.

### 2.1 Button (`ui/button.tsx`)

Variants × sizes matrix. Built with `class-variance-authority`.

| Variant | Base | Hover |
|---|---|---|
| `default` | `bg-accent text-white` | `bg-accent-hover` |
| `destructive` | `bg-priority-high text-white` | `bg-priority-high/90` |
| `outline` | `border border-border bg-transparent` | `bg-bg-secondary` |
| `secondary` | `bg-bg-secondary text-text-primary` | `bg-bg-secondary/80` |
| `ghost` | transparent | `bg-bg-secondary` |
| `link` | `text-accent` | underline |

| Size | Height × padding |
|---|---|
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 px-3` |
| `lg` | `h-11 px-8` |
| `icon` | `h-10 w-10` |

Icons: `[&_svg]:size-4 [&_svg]:shrink-0`. All buttons get `cursor-pointer` and `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.

### 2.2 Input (`ui/input.tsx`)

`h-10 rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm`. Placeholder: `text-text-muted`. Focus: 2px accent ring with offset.

For taller auth forms, use the inline pattern: `h-11 px-3.5 text-sm bg-bg-elevated border border-border rounded-lg`.

### 2.3 PasswordInput (`password-input.tsx`)

Wraps `<input type="password">` with a show/hide eye toggle button on the right. Props mirror native input. `fieldClassName` overrides the default `bg-bg-elevated` (use `bg-bg-primary` when nested inside an elevated card for contrast).

### 2.4 Badge (`ui/badge.tsx`)

`rounded-full border px-2.5 py-0.5 text-xs font-medium`.

Variants: `default` (accent), `secondary`, `destructive`, `outline`.

### 2.5 PriorityBadge / StatusBadge

Toggleable chips with a colored dot + label. Two visual states:
- **Selected:** `bg-{color}/10` fill + `border-{color}` + `text-text-primary`
- **Unselected:** transparent + `text-text-muted`, hover `bg-bg-secondary`

Always render with their semantic color (never swap — high must be red, done must be green).

### 2.6 Dialog / Sheet / Dropdown (`ui/*.tsx`)

All built on Radix. Content panel uses `bg-bg-elevated border border-border rounded-lg` (`rounded-md` for dropdowns). Backdrop: `bg-black/40 backdrop-blur-sm`.

### 2.7 Cards (domain)

- **ProjectCard** — big tile with name, color bar, task count. Uses `bg-bg-elevated border border-border rounded-lg p-5`.
- **KanbanCard** — compact task card inside a column. Priority dot + title + meta row.
- **TaskRow / ItemRow** — dense list rows with left checkbox, title, right meta. `h-11` hover `bg-bg-secondary`.

### 2.8 Logo (`taski-logo.tsx`)

Calendar-with-checkmark mark. `<TaskiLogo size={32} />` for the icon only; `<TaskiLockup size="md" />` for icon + wordmark. Wordmark uses `font-semibold` with `letterSpacing: -0.03em`.

Sizes: `sm` (24px icon, text-lg), `md` (32px, text-2xl), `lg` (44px, text-4xl).

---

## 3. Patterns

### 3.1 Auth screens

- **Layout:** full-bleed split — left/top brand panel (`bg-accent` with Taski lockup), right/bottom form panel (`bg-bg-primary`).
- **Form width:** `max-w-sm`.
- **Title:** `text-3xl font-normal tracking-tight`.
- **Body copy under title:** `text-sm text-text-secondary leading-relaxed`.
- **Form vertical rhythm:** `space-y-4`.
- **Primary button:** `w-full h-12 bg-accent text-white rounded-lg`.

### 3.2 Settings

- Section cards: `bg-bg-elevated border border-border rounded-lg p-5 md:p-6`.
- Inside a card, inputs use `bg-bg-primary` (not elevated) for contrast.
- Section spacing: `mt-4` between sibling cards, `mt-8` from the page title.
- Action row right-aligned: `<div className="flex justify-end">`.

### 3.3 Empty states

Centered column: illustration (100–160 px) + `text-3xl` heading + `text-sm text-text-secondary` subcopy + primary CTA. All use the `animate-fade-in-up` entrance.

### 3.4 Focus + accessibility

- Global focus ring: 2px solid `--color-accent` with 2px offset and `--radius-sm` (defined on `*:focus-visible` in base layer).
- All interactive surfaces must have `focus-visible:` styles — never remove.
- Hit targets ≥ 40×40 on touch contexts (buttons use `h-10` min; small icon buttons use `h-8 w-8` only inside dense rows).
- Toggle buttons (password show/hide) receive `tabIndex={-1}` so keyboard focus flows through the input only.

---

## 4. Voice & microcopy

- **Language:** Portuguese (Brazil). UI strings live inline; if i18n is added later, tokens go in `src/locales/`.
- **Tone:** calm, plainspoken, second-person ("você"). Avoid exclamation marks except in celebratory confirmations.
- **Button labels:** verb-first, imperative — "Criar conta", "Salvar", "Entrar", "Atualizar senha".
- **Placeholders:** neutral hints, never instructions — "seu@email.com", "Como você quer ser chamado".
- **Errors:** specific and human — "Email ou senha inválidos" over "Erro de autenticação".

---

## 5. Dark mode

- Toggle lives in the user menu and Settings.
- State persisted in `localStorage` under key `settings:theme`. Default tracks `prefers-color-scheme`.
- Implementation: `document.documentElement.setAttribute('data-theme', 'dark' | 'light')` — see `src/lib/theme.tsx`.
- An inline script in the document head (set before hydration) applies the stored theme immediately to avoid flash.

**Rule:** any new component must work unchanged in both themes by using tokens only. Never use `dark:` Tailwind variants — tokens do the work.

---

## 6. Adding or changing tokens

1. Edit the `@theme` block in `src/index.css` (and the `[data-theme="dark"]` override if applicable).
2. Tailwind picks it up as a utility automatically (`bg-<name>`, `text-<name>`, etc.).
3. Update this document (section 1).
4. If it affects public-facing visual identity, capture a before/after screenshot in the PR.

---

## 7. What's explicitly not in the system (yet)

These exist informally in code but aren't tokenized. Treat as candidates for future work:

- **Shadow scale** — only ad-hoc `shadow-md`/`shadow-lg` from Tailwind defaults.
- **Z-index layers** — rely on stacking context and Radix defaults.
- **Icon sizing token** — icons use inline `size={N}` props (mostly 16/18/20/24).
- **Breakpoints beyond Tailwind defaults.**
- **Toast variants** — uses Sonner defaults.

If you add any of these, promote them to tokens and document here.
