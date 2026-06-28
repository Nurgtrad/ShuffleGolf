# Shuffle Golf — Handoff Quick Reference

## What You're Getting

A **complete design system** for Shuffle Golf, including:

✓ **Design Kit Reference** (`Shuffle Golf Kit.dc.html`) — Interactive visual guide showing all colors, typography, components, and icons  
✓ **CSS Token Library** (`styles/shuffle-golf.css`) — Copy-paste ready; 30+ design tokens covering colors, spacing, typography, shadows  
✓ **26 Game Icons** (`assets/icons/`) — SVG icons for clubs, power-ups, gems, and UI  
✓ **Logo Mark** (`assets/logo.svg`) — Full logo composition at 1040×660; ready to scale  
✓ **Complete README** — Detailed specs for every component, state, and interaction  

## How to Use This

1. **Download the zip** and extract it into your project
2. **Import the CSS**: Add `styles/shuffle-golf.css` to your HTML/app
3. **Copy icon paths** into your code; reference them from `assets/icons/`
4. **Build your screens** using the component specs in the README
5. **Test against the design kit** to verify pixel-perfect alignment

## Key Design Values

| What | Value |
|------|-------|
| Primary Color | `#aad976` (green) |
| Background | `#0a0d08` (dark) |
| Text | `#d6e4c5` (light cream) |
| Display Font | Newsreader (serif) |
| UI Font | JetBrains Mono |
| Button Radius | 4–8px |
| Card Radius | 14px |

## Three Things to Remember

1. **Use the tokens** — Never hardcode colors. Always `var(--sg-*)`.
2. **Maintain spacing** — Stick to the 4/8/12/16/24/32/48/64px scale.
3. **Test the glow** — Shadows & glows on mobile may need GPU acceleration.

---

**Ready to implement?** Open the README.md and start building.
