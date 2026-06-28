# Handoff: Shuffle Golf — Design System & Visual Kit

## Overview

**Shuffle Golf** is a procedural golf card game with a distinctive visual identity: "country club at midnight." This handoff provides a complete design system, color palette, typography, component library, and interactive logo for implementation in your codebase.

The design system covers:
- Full color palette with semantic naming
- Typography scale (serif display + monospace UI)
- Reusable UI components (buttons, cards, badges, tooltips, meters)
- 26 game-specific icons (clubs, power-ups, gems, interface)
- Animated logo mark
- CSS token library ready to import

## About These Files

The files in this bundle are **design references created in HTML/CSS** — high-fidelity mockups showing the intended look, behavior, spacing, and color. They are **not production code to copy directly**.

Your task is to:
1. **Understand the visual intent** from the reference files
2. **Recreate these designs in your codebase** using your framework's patterns (React, Vue, native app, etc.)
3. **Use the CSS tokens and component specifications** below as your source of truth for colors, spacing, typography, and behavior
4. Adapt the designs to fit your app's architecture and performance needs — the HTML is a guide, not a mandate

## Fidelity

**High-fidelity (hifi)**: Pixel-perfect mockups with final colors, typography, spacing, and interactions. Recreate the UI exactly as shown using your framework's existing libraries and patterns.

---

## Design Tokens

All values are documented in `styles/shuffle-golf.css` and outlined below.

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--sg-bg` | `#0a0d08` | Page background (dark warm green-black) |
| `--sg-bg-2` | `#0e120b` | Faint raised surfaces |
| `--sg-surface` | `#141a10` | Cards, panels |
| `--sg-surface-2` | `#1b2215` | Hover/nested panels |
| `--sg-green` | `#aad976` | Primary accent — CTAs, titles, values |
| `--sg-green-bright` | `#c2ec8e` | Emphasized values, glow |
| `--sg-green-deep` | `#6f9e3f` | Pressed state, muted green |
| `--sg-gold` | `#e0b84d` | Coins, prizes, "Prize Zone" |
| `--sg-gold-deep` | `#b8881f` | Pressed gold |
| `--sg-red` | `#e36a6a` | Danger, warnings, "Difícil" |
| `--sg-cyan` | `#62c4e8` | Tooltips, info callouts |
| `--sg-text` | `#d6e4c5` | Primary text on dark |
| `--sg-text-dim` | `#8a9a7e` | Secondary text, labels |
| `--sg-text-mute` | `#5f6c55` | Tertiary text, disabled |
| **Gem Hues** | | |
| `--sg-diamond` | `#bfeef2` | Diamond (common) |
| `--sg-ruby` | `#e1556b` | Ruby (rare) |
| `--sg-emerald` | `#4fc785` | Emerald (rare) |
| `--sg-topaz` | `#e9b13e` | Topaz (rare) |
| `--sg-quartz` | `#e7b6df` | Quartz (rare) |

### Typography

| Scale | Font | Weight | Size | Usage |
|-------|------|--------|------|-------|
| **Display** | Newsreader (serif) | 500 | 34–56px | Titles ("Par", "Vestuario") |
| **Display—Gold** | Newsreader (serif) | 600 | 34–56px | "Prize Zone" |
| **Eyebrow** | JetBrains Mono | 700 | 14px | Section labels ("SELECCIONA TU JUGADOR") |
| **Label** | JetBrains Mono | 500 | 12px | Field labels ("HOYO", "PAR", "GOLPES") |
| **Value** | JetBrains Mono | 700 | 26px | Large numbers |
| **Body** | JetBrains Mono | 400 | 15px | Primary UI text |
| **Muted** | JetBrains Mono | 400 | 15px | Secondary text |

**Font Families:**
- Display: `'Newsreader', Georgia, 'Times New Roman', serif`
- UI/Mono: `'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace`

### Spacing Scale

```
--sg-1: 4px   --sg-2: 8px   --sg-3: 12px  --sg-4: 16px
--sg-5: 24px  --sg-6: 32px  --sg-7: 48px  --sg-8: 64px
```

### Border Radius

- `--sg-r-sm`: 4px (buttons, small elements)
- `--sg-r-md`: 8px (cards, palo chips)
- `--sg-r-lg`: 14px (large cards, panels)
- `--sg-r-pill`: 999px (circular buttons, badges)

### Shadows & Glows

- `--sg-shadow`: `0 8px 28px rgba(0, 0, 0, 0.55)` (elevation)
- `--sg-glow-green`: Green ring + glow (selected club, active power-up)
- `--sg-glow-cyan`: Cyan ring + glow (info state)
- `--sg-glow-gold`: Gold ring + glow (prize, coin)

---

## Components

### Buttons

#### Primary Button (`.sg-btn--primary`)
- **Background**: `--sg-green` (`#aad976`)
- **Text**: `--sg-on-green` (`#142008`)
- **Padding**: 14px 26px
- **Border radius**: 4px
- **Font**: JetBrains Mono, 700, 14px, letter-spacing 0.18em, uppercase
- **Hover**: Background shifts to `--sg-green-bright`, box-shadow glows
- **Active**: Transform translateY(1px)
- **Copy examples**: "CONFIRMAR Y JUGAR", "CONTINUAR", "PLAY"

#### Ghost Button (`.sg-btn--ghost`)
- **Background**: Transparent
- **Border**: 1px inset `--sg-line`
- **Text**: `--sg-green`
- **Hover**: Border becomes solid `--sg-green`
- **Copy examples**: "TIRAR RODILLOS (2)", "VOLVER"

#### Danger Button (`.sg-btn--danger`)
- **Background**: Transparent
- **Border**: 1px inset `rgba(227,106,106,.4)`
- **Text**: `--sg-red`
- **Usage**: Destructive actions

### Difficulty Pills (`.sg-pill`)
Three-option segmented control for difficulty selection.

- **Container**: Full-width, `display: flex` with 3 equal children
- **Each pill**: Padding 10px 0, border-radius 4px, background `--sg-bg-2`, border 1px `--sg-line-soft`
- **Colors**: `.sg-pill--easy` (green), `.sg-pill--normal` (gold), `.sg-pill--hard` (red)
- **Font**: JetBrains Mono, 700, 13px, letter-spacing 0.18em, uppercase
- **States**: Unpressed = dim; pressed = bright color

### Club Card (`.sg-palo`)
Small vertical card displaying a golf club.

- **Size**: 92px wide
- **Background**: `--sg-bg-2`
- **Border radius**: 8px
- **Padding**: 14px 12px 12px
- **Tag** (top-right, `.sg-palo__tag`): "PALO", 9px, muted color
- **Icon** (`.sg-palo__icon`): 30×30px, centered
- **Name** (`.sg-palo__name`): Club name (e.g. "DRIVER"), 11px, uppercase, muted
- **Distance** (`.sg-palo__dist`): Large green number (e.g. "~222m"), 18px
- **Active state**: Glow with `--sg-glow-green`

### Card (`.sg-card`)
General-purpose card container.

- **Background**: `--sg-surface`
- **Border radius**: 14px
- **Border**: Inset 1px `--sg-line-soft`
- **Shadow**: `--sg-shadow`
- **Padding**: 24px
- **States**:
  - `.sg-card--selected`: `--sg-glow-green`
  - `.sg-card--selected-c`: `--sg-glow-cyan`

### Tooltip (`.sg-tooltip`)
Small callout with downward pointer.

- **Background**: `--sg-cyan` (or `.sg-tooltip--gold` → `--sg-gold`)
- **Text color**: `#0a1a20` (on cyan), or `--sg-on-gold` (on gold)
- **Padding**: 10px 14px
- **Border radius**: 8px
- **Pointer**: CSS triangle, 7px, positioned below (bottom -7px)
- **Font**: JetBrains Mono, 700, 13px
- **Copy examples**: "Máxima precisión", "+100"

### Badge / Icon Counter (`.sg-badge`)
Square box with optional count bubble.

- **Size**: 54×54px
- **Background**: `--sg-surface`
- **Border radius**: 8px
- **Border**: Inset 1px `--sg-line`
- **Count** (`.sg-badge__count`): Small circle (20px) in bottom-right, background `--sg-bg`, border 1px `--sg-line`
- **Icon**: 30×30px, centered
- **Typical use**: Power-up count, equipment slots

### Meter / Progress Bar (`.sg-meter`)
Stat bar for player attributes (Recto, Fuerza, Control).

- **Container height**: 7px
- **Background**: `--sg-bg-2`
- **Border radius**: 999px
- **Inner bar** (`> i`): `--sg-green`, width as percentage (e.g. 92%, 48%, 78%)
- **Label above**: JetBrains Mono, 11px, muted, letter-spacing 0.14em, uppercase

### Warning Banner (`.sg-warn`)
Full-width alert bar.

- **Background**: `rgba(227, 106, 106, 0.06)` (red tint)
- **Border**: 1px inset `rgba(227, 106, 106, 0.45)`
- **Text**: `--sg-red`, uppercase, 13px, letter-spacing 0.08em
- **Padding**: 14px 18px
- **Border radius**: 8px
- **Copy example**: "⚠ Refreshing the browser will erase your progress and your card collection forever."

---

## Icons

26 SVG icons included in `assets/icons/`. All are 46×46px at display size, monochrome outlines designed for the dark background.

### By Category

**Clubs** (8 icons):
- `driver.svg` — Driver
- `wood.svg` — 3 Wood
- `iron.svg` — Iron
- `wedge.svg` — Wedge
- `sand.svg` — Sand Wedge
- `lob.svg` — Lob Wedge
- `putt.svg` — Putter
- `golfer.svg` — Golfer (player avatar)

**Power-ups** (6 icons):
- `power.svg` — Power boost
- `aero.svg` — Aerodynamic
- `mulligan.svg` — Mulligan (do-over)
- `skimmer.svg` — Skimmer (water bounce)
- `terrain.svg` — All-Terrain
- `control.svg` — Control

**Gems** (5 icons):
- `diamond.svg` — Diamond (common)
- `ruby.svg` — Ruby
- `emerald.svg` — Emerald
- `topaz.svg` — Topaz
- `quartz.svg` — Quartz

**Interface** (7 icons):
- `coin.svg` — Currency
- `question.svg` — Help / Info
- `mute_on.svg` — Sound muted
- `mute_off.svg` — Sound active
- `gear.svg` — Settings
- `check.svg` — Checkbox (checked)
- `unchecked.svg` — Checkbox (unchecked)

---

## Logo & Mark

### Main Logo (`assets/logo.svg`)
A full composition featuring:
- **Left**: "SHUFFLE" (orange gradient with blue outline, italic, skewed)
- **Center**: "GOLF" (green gradient with blue outline, italic, skewed)
- **Right**: Golf scene — flagpole with "18" flag, golf ball on green, motion lines
- **Viewbox**: 1040×660
- **Scaling**: Use CSS `max-width: 100%` to fit containers; min width ~400px for readability

### Logo Colors & Gradients
- **SHUFFLE text**: Orange gradient (`#f8c93f` → `#f0a81e` → `#d97a10`)
- **GOLF text**: Green gradient (`#80cd3d` → `#57ad22` → `#3a8413`)
- **Outline**: Dark navy (`#0c1830`) with blue accent (`#2f5fc0`)
- **Flag**: Red (`#e0503e` → `#b62f23`)
- **Pole**: Gold gradient
- **Ball**: White radial with dimple texture
- **Green**: Grass gradient

### Recommended Usage
- Hero section: Full width, 400–800px
- Small mark: Favicon or header logo (100–120px, crop to ball + "18" flag)
- Card header: 200px width

---

## Screens / Views

### Design Kit Landing (provided in `Shuffle Golf Kit.dc.html`)

Single-page reference showing:
1. **Logo** — Full composition
2. **Color Palette** — 10 swatches with hex values
3. **Typography** — Scale examples + usage
4. **Components** — Buttons, club cards, meters, badges, tooltips, warnings
5. **Icons** — Grouped by category (clubs, power-ups, gems, interface)

**Purpose**: Reference only. Your app will have screens like:
- Player selection
- Club/equipment selection
- Hole difficulty choice
- Game HUD (score, stats, controls)
- Results screen
- Shop / upgrades
- Settings

Use the component specs above to build those screens in your codebase.

---

## Interactions & Behavior

### Button States
- **Hover**: Slight elevation, color brighten, shadow expand
- **Active/Press**: Y-translate down 1px, shadow contract slightly
- **Disabled**: Opacity 0.5, cursor not-allowed

### Card Selection
- **Unselected**: Standard shadow
- **Selected**: Bright glow ring + soft shadow (`.sg-glow-green` or `.sg-glow-cyan`)

### Club Card Selection
- **Hover**: Subtle background brightening
- **Active**: Full glow + ring

### Meter Animation (optional)
- On state change, animate width over 300ms with ease-out
- Smooth visual feedback for stat changes

### Difficulty Pills
- **Tap to select**: Only one active at a time
- **Active state**: Bright color + subtle glow
- **Inactive**: Muted text, dim background

---

## State Management

### Minimal State Needed
- **Selected difficulty**: `'easy' | 'normal' | 'hard'`
- **Selected club**: Club ID or name
- **Player stats**: `{ recto: 0–100, fuerza: 0–100, control: 0–100 }`
- **Inventory**: Array of power-ups, gems, equipment
- **Game state**: Hole, score, remaining clubs, etc.

### Data Fetching
If building for a backend, design a simple `/api/player` endpoint returning:
```json
{
  "name": "MCROLLY",
  "difficulty": "normal",
  "stats": { "recto": 92, "fuerza": 48, "control": 78 },
  "inventory": { "power": 3, "aero": 1, "mulligan": 2 },
  "clubSelection": "driver"
}
```

---

## File Structure

```
project/
├── Shuffle Golf Kit.dc.html     (reference design kit)
├── styles/
│   └── shuffle-golf.css          (all tokens & classes)
├── assets/
│   ├── logo.svg                  (main logo)
│   ├── logo-mark.svg             (optional small mark)
│   └── icons/
│       ├── driver.svg
│       ├── wood.svg
│       ├── ... (24 more)
│       └── unchecked.svg
└── (your app structure)
```

---

## Implementation Notes

1. **CSS import first**: Drop `styles/shuffle-golf.css` into your project and `@import` it or include as a `<link>`. All values are CSS custom properties (variables).

2. **Use token names consistently**: Don't hardcode colors. Always reference `var(--sg-*)` in your CSS/styled-components/Tailwind config.

3. **Icons**: All SVG icons are single-color outlines. Embed as `<img>` or inline `<svg>`, or bundle into an icon font if preferred.

4. **Logo sizing**: Responsive with `max-width: 100%`. On mobile (<600px), consider showing only the ball + "18" flag or a simplified mark.

5. **Typography pairing**: Newsreader for display/headings, JetBrains Mono for UI. Keep it consistent—avoid mixing with system fonts unless necessary.

6. **Spacing**: Always use the `--sg-N` scale (4, 8, 12, 16, 24, 32, 48, 64px). Never arbitrary padding/margins.

7. **Glow effects**: Use box-shadow for non-native glow. Test on mobile to ensure it renders smoothly (may need `will-change: box-shadow` or GPU acceleration on lower-end devices).

8. **Animations**: Transitions should be 0.12s–0.15s for snappy feel. Avoid prolonged easing; the design assumes quick, responsive interactions.

---

## Questions or Clarifications

- **"What does MCROLLY mean?"** It's a player name; you can use it as a placeholder or randomize player names.
- **"How do I implement the logo animation?"** The provided SVG is static. If you need animation (e.g., rotation, glow pulse), layer CSS keyframes or canvas on top.
- **"Can I change colors?"** Not recommended without design review. The palette is tuned for readability and brand cohesion. If you must, maintain contrast ratios (text on background ≥ 4.5:1, UI elements ≥ 3:1).

---

**Design System v1.0**  
Created for **Shuffle Golf** — "country club at midnight"
