---
name: mobile-optimization
description: Guía de optimización móvil para ShuffleGolf — Canvas rendering, memoria, batería, FPS, touch input y checklist de profiling. Usa esta skill cuando el usuario quiera mejorar el rendimiento en móvil, reducir el consumo de batería, arreglar lag o stuttering, optimizar el canvas, mejorar la respuesta al tacto, o preparar el juego para Android/iOS. También actívala ante cualquier queja de lentitud o calentamiento del dispositivo.
---

# Mobile Optimization — HTML5 Canvas Games

Reference for optimizing ShuffleGolf (and similar Canvas 2D games) on mobile browsers (Android/iOS).

## Canvas Rendering Best Practices

### Layer Separation (already in place)
ShuffleGolf uses 3 canvases (`c-course`, `c-ball`, `c-ui`). Keep this pattern:
- **Static layer** (`c-course`): draw once per hole, never touch inside `requestAnimationFrame`
- **Dynamic layers** (`c-ball`, `c-ui`): clear and redraw only the dirty region, not the full canvas

```js
// Dirty-region clear instead of full clear
ctx.clearRect(ball.prevX - r, ball.prevY - r, r*2, r*2);
```

### Device Pixel Ratio (DPR)
```js
const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× to avoid GPU overload
canvas.width  = canvas.clientWidth  * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);
```
- Never use DPR > 2 on mobile — GPU fill-rate bottleneck
- Reapply scale after every canvas resize

### Avoid Expensive Operations Per Frame
| Expensive | Alternative |
|-----------|------------|
| `ctx.shadowBlur` | Pre-render shadow to offscreen canvas |
| `ctx.drawImage` large sprites | Sprite atlas + clip region |
| `ctx.arc` for many trees | Pre-rasterize to offscreen canvas once per hole |
| `ctx.getImageData` | Avoid entirely in game loop |
| Gradient creation inside loop | Create gradient once, reuse reference |

### Offscreen Canvas for Static Elements
```js
// Pre-render trees once per hole (fixes ShuffleGolf's 600–1000 tree problem)
const treeCanvas = new OffscreenCanvas(W, H);
const treeCtx = treeCanvas.getContext('2d');
drawAllTrees(treeCtx);
// Then in main render:
courseCtx.drawImage(treeCanvas, 0, 0);
```

### Path2D Caching
Terrain paths are already stored in `holeData` — never recreate `Path2D` inside the game loop. Check that `isPointInPath` calls use cached paths.

---

## Memory Management

### Avoid Closure Leaks in `requestAnimationFrame`
```js
// BAD: new closure every frame
function loop() {
  setTimeout(() => requestAnimationFrame(loop), 16);
}

// GOOD: reuse same function reference
let rafId;
function loop(ts) {
  update(ts);
  render();
  rafId = requestAnimationFrame(loop);
}
// Cancel on hole end:
cancelAnimationFrame(rafId);
```

### Particle Pool (for VFX)
Instead of creating/GCing particle objects every shot, maintain a pool:
```js
const POOL_SIZE = 64;
const particles = Array.from({ length: POOL_SIZE }, () => ({ active: false }));
function spawnParticle() {
  const p = particles.find(p => !p.active);
  if (p) { p.active = true; /* init */ }
}
```

### Canvas Element Cleanup
When switching holes, explicitly release references:
```js
holeData.terrainPaths = null; // Path2D objects hold GPU memory
```

### Audio Node Cleanup (`audio.js`)
Disconnect and GC oscillator nodes after SFX playback:
```js
osc.onended = () => { osc.disconnect(); gain.disconnect(); };
```

---

## Battery Optimization

### FPS Cap (see FPS section below)
Uncapped `requestAnimationFrame` on mobile = 60–120 fps = battery drain. Cap to 30 fps during idle phases.

### Pause Loop When Hidden
```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(rafId);
  else rafId = requestAnimationFrame(loop);
});
```

### Reduce Work During Non-Flight Phases
ShuffleGolf's `card_select` phase doesn't need 60 fps. Downgrade loop:
```js
const TARGET_FPS = state.phase === 'flight' ? 60 : 15;
```

### Web Audio Suspend on Background
```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) audioCtx.suspend();
  else audioCtx.resume();
});
```

---

## Asset Loading & Caching

ShuffleGolf has no external assets, but if images/audio files are added:

### Service Worker Cache (PWA pattern)
```js
// sw.js
const CACHE = 'shufflegolf-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    '/', '/index.html', '/style.css', '/core.js',
  ])));
});
```

### Lazy-Load Heavy Assets
- Generate hole terrain async (Web Worker or chunked with `setTimeout(fn, 0)`)
- Show loading spinner between holes; don't block main thread

### Image Sprite Atlas
If adding sprites: pack into one PNG atlas, use `drawImage(atlas, sx, sy, sw, sh, dx, dy, dw, dh)`. One image load vs N requests.

---

## Frame Rate Management

### FPS Cap Implementation
```js
let lastFrame = 0;
const TARGET_MS = 1000 / 30; // 30 fps cap

function loop(ts) {
  rafId = requestAnimationFrame(loop);
  if (ts - lastFrame < TARGET_MS) return;
  lastFrame = ts;
  update(ts);
  render();
}
```

### Adaptive Quality
If frame time > 33 ms (< 30 fps), reduce quality:
```js
if (frameTime > 33) {
  TREE_COUNT = Math.max(200, TREE_COUNT - 50);
  USE_SHADOWS = false;
}
```

### `requestAnimationFrame` vs `setTimeout`
Always use `rAF` for rendering — browsers throttle it when tab is hidden. Use `setTimeout` only for game-logic timers (cooldowns, delays).

---

## Touch Input Optimization

### Passive Event Listeners
```js
// Prevents scroll jank — always passive unless you need preventDefault
canvas.addEventListener('touchstart', handler, { passive: true });
// Only non-passive when blocking scroll:
canvas.addEventListener('touchmove', handler, { passive: false });
```

### Touch Coordinate Normalization
```js
function getTouchPos(canvas, touch) {
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  return {
    x: (touch.clientX - rect.left) * dpr,
    y: (touch.clientY - rect.top)  * dpr,
  };
}
```

### Debounce Tap vs Long-Press
ShuffleGolf's power/aim meters use hold-to-fill. Distinguish from scroll:
- If `touchmove` delta < 10 px within 150 ms → treat as tap/hold
- Cancel hold if finger moves > 10 px (user is scrolling)

### Target Sizes (Apple HIG / Material)
Minimum tap target: **44×44 px** (CSS pixels). ShuffleGolf's club cards should be at least this size on mobile.

### Prevent Double-Tap Zoom
```css
* { touch-action: manipulation; }
```
Or on game canvas: `touch-action: none`.

---

## Performance Profiling Checklist (Mobile)

Use Chrome DevTools on Android (chrome://inspect) or Safari Web Inspector on iOS.

**Before optimizing:**
- [ ] Record Performance trace during a full shot animation
- [ ] Identify top CPU consumers in flame chart (look for `drawCourse`, tree loops)
- [ ] Check Memory tab for growing heap between holes (leak indicator)
- [ ] Enable "Rendering > FPS Meter" overlay

**Canvas-specific checks:**
- [ ] Is `c-course` being redrawn every frame? (Should be once per hole)
- [ ] Are Path2D objects recreated inside the game loop?
- [ ] Are gradient/shadow objects created inside the loop?
- [ ] Is DPR > 2 being applied? (Cap it)

**Network/load checks:**
- [ ] Lighthouse mobile audit (Performance score target: >80)
- [ ] No render-blocking scripts in `<head>` (use `defer`)
- [ ] First Contentful Paint < 2 s on 4G throttle

**Battery checks:**
- [ ] Does RAF pause when tab is hidden?
- [ ] Does audio context suspend when hidden?
- [ ] Is FPS capped during non-animation phases?

**Memory checks:**
- [ ] Heap stable between holes (no growing sawtooth)
- [ ] Particle objects pooled or cleaned up
- [ ] Audio nodes disconnected after SFX
