---
name: project-architecture
description: Referencia completa de ShuffleGolf — diseño del juego, estructura de archivos, stack tecnológico, gestión de estado y deuda técnica. Usa esta skill antes de cualquier cambio arquitectónico, al añadir sistemas nuevos, o cuando necesites saber qué archivo tocar. También actívala si el usuario pregunta cómo funciona el juego, cómo está organizado el código, o qué hace cualquier sistema existente.
---

# ShuffleGolf — Project Architecture

## What the Game Is

**ShuffleGolf** is a browser-based casual golf simulator that mixes deck-building with physics-based ball flight. Players build a deck of 14 golf clubs plus upgrades, then play a procedurally-generated 18-hole round. Key mechanics:

- **Deck-builder loop:** draw clubs each turn, discard after use, buy/sell in mid-round shop
- **Three-tap input:** select club → stop oscillating power meter → stop oscillating aim meter → watch physics flight
- **Procedural holes:** Bezier fairways, randomized hazards (bunkers, lakes, rivers, trees), wind, prize zones
- **Mission system:** 2–3 per hole (drive distance, avoid hazard, score target, etc.) that award upgrades and gems
- **Economy:** coins earned by score quality → spent in shop every 9 holes
- **Language:** Spanish UI, targeting Latin American audience
- **Status:** Feature-complete, ~1.2 versioned, maintenance mode

## File Structure

```
ShuffleGolf-main/
├── index.html      # 18 canvas layers + all overlay HTML (HUD, shop, slot, score)
├── style.css       # Dark-green theme, CSS variables, responsive media queries
├── core.js         # Main game loop: startHole, executeShot, animateFlight, endShot, holeComplete
├── drawing.js      # Canvas rendering: generateHole, drawCourse, drawBall, drawUI, VFX particles
├── cards.js        # Deck builder, hand management, shop, slot machine, card UI
├── data.js         # All constants: CLUBS_POOL, UPGRADES_POOL, GEMS_POOL, HOLE_PARS, M_TYPES, state init
├── golfers.js      # 3 golfer profiles with stat multiplier functions
├── audio.js        # Web Audio API procedural synth (4 BGM tracks + SFX)
└── script.js       # LEGACY — old card-ball system, superseded by core.js (do not edit)
```

## Technology Stack

| Layer | Tech |
|-------|------|
| Runtime | Vanilla JavaScript ES6+, no framework, no bundler |
| Rendering | HTML5 Canvas 2D (3 layered canvases) |
| Audio | Web Audio API — 100% procedural, zero audio files |
| Styling | CSS3 with custom properties, Grid/Flex, media queries |
| Assets | None — all graphics are Canvas-drawn or emoji; all audio is synthesized |
| Build | None — runs directly in browser, no compile step |

## Game State

Single global `state` object in `data.js`:

```js
state = {
  // Setup
  golfer, upgradesConfig,
  // Deck
  drawPile, hand, activeUpgrades, gems,
  // Progress
  money, hole, totalScore, scores, handicaps,
  // Current hole
  holeData, wind: { speed, dir }, currentTerrain, strokes,
  // Shot
  phase,          // 'card_select' | 'power' | 'aim' | 'flight'
  selectedClub,
  powerVal,       // 0–1
  aimVal,         // 0–1
  ball: { x, y },
  target: { x, y },
  ballAnim: { trace: [] },
  // Mission tracking flags
  m_hz, m_upgs, m_c200
}
```

**Phase flow:** `card_select → power → aim → flight → (back to card_select)`

## Key Game Systems

### Terrain Generation (`drawing.js → generateHole`)
- Bezier fairway with parametric width variation
- Terrain types with lie penalties: fairway (1×) → semi-rough → rough → deep rough → bunker (3×) → water/OB
- 15–30 sand traps, 0–3 lakes, 0–1 river, 600–1000 trees per hole
- Path2D collision objects stored in `holeData` for terrain detection
- Par 3 (150–180 m), Par 4 (330–400 m), Par 5 (490–550 m)

### Ball Physics (`core.js → executeShot / animateFlight`)
```
distance = (club.dist × powerMult - liePenalty) × power^1.6
deviation = (aimVal - 0.5) × 2 × distance × (0.4 × difficulty × liePenaltyMult)
```
- Air phase: Bezier-eased parabolic arc (800–1200 ms)
- Roll phase: linear deceleration (200–800 ms)
- Wind shifts deviation + distance (negated by Aero upgrade)

### Club & Upgrade System (`data.js + cards.js`)
- 14 clubs: Driver (240 m) down to Putter (30–60 m)
- 6 upgrades (3 uses each): Power (+25% dist), Aero (no wind), Mulligan (rewind), Skimmer (water bounce), All-Terrain (no lie penalty), Control (50% aim width)
- Upgrades persist across holes; clubs are drawn/discarded each turn

### Canvas Layers (`drawing.js`)
| Canvas | Content | Redraw frequency |
|--------|---------|-----------------|
| `c-course` | Static hole geometry | Once per hole |
| `c-ball` | Ball position + shadow | Every frame |
| `c-ui` | Aim line, reach arc, trace, power mark | Every frame |

VFX particles: Ripple (water), Dust (bunker), Fire (Power upgrade), Rock (Heavy).

### Audio (`audio.js`)
- Procedural sequencer: lead/bass/drum synthesis
- 4 BGM tracks: menu, game, tension, slot machine
- SFX: hit, bounce, water, sand, slot spin, rewards

## Asset Management

No external files. Everything is runtime-generated:
- Graphics → Canvas 2D draw calls + emoji
- Audio → Web Audio API oscillators
- Config → inline JS constants in `data.js`

## Known Technical Debt

1. **`script.js` is dead code** — legacy ball-card system fully superseded by current upgrade system; safe to delete but kept for reference.
2. **Silent terrain detection failures** — `getTerrain()` catches errors and falls back to `'fairway'`; may silently misdetect terrain near boundaries on mobile (DPR scaling issue).
3. **Tree generation is O(n×tries)** — 20 placement attempts per tree × up to 1000 trees = potentially slow hole generation on low-end devices.
4. **Static course canvas not cached** — `drawCourse()` redraws every frame in some code paths instead of only on hole start.
5. **Slot machine rewards are unweighted** — equal probability for money/club/gem/upgrade; no config system.
6. **Audio context unlock** — can fail silently if the user never interacts with the page; background music doesn't resume after slot machine BGM ends.
7. **Hardcoded Spanish** — all UI labels are string literals; would need full extraction for i18n.
8. **Mobile hover states** — deck builder uses CSS hover for card interactions; no dedicated touch alternative.
9. **Power × upgrade interaction** — Rehm golfer's +10% power combined with Power upgrade can produce unrealistic distances; no cap.
10. **No LOD/culling** — all 600–1000 trees rendered even when off-screen.
