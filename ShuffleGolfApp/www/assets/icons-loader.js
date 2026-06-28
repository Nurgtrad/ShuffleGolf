/**
 * SHUFFLE GOLF — SVG Icon Loader
 * Carga iconos SVG desde assets/icons/
 * Si el archivo no existe, usa emoji como fallback
 */
window.ICON_CACHE = {};
window.ICON_LOADING = {};

const ICON_EMOJI_FALLBACK = {
  golfer: '🏌️',
  driver: '🏌',
  wood: '🌲',
  iron: '⛳',
  wedge: '🎯',
  sand: '⏳',
  lob: '📐',
  putt: '🕳',
  power: '🔥',
  aero: '💨',
  mulligan: '⏪',
  skimmer: '🏄',
  terrain: '🚙',
  control: '🎯',
  diamond: '💎',
  ruby: '💍',
  emerald: '👑',
  topaz: '🪨',
  quartz: '🔮',
  coin: '🪙',
  question: '❓',
  mute_on: '🔊',
  mute_off: '🔇',
  gear: '⚙️',
  check: '✔',
  unchecked: '⬜'
};

const ICON_NAMES = Object.keys(ICON_EMOJI_FALLBACK);

function getIcon(iconName) {
  if (window.ICON_CACHE[iconName]) {
    return window.ICON_CACHE[iconName];
  }
  return ICON_EMOJI_FALLBACK[iconName] || '❓';
}

// Carga todos los iconos de forma asincróna
Promise.all(ICON_NAMES.map(name =>
  fetch(`assets/icons/${name}.svg`)
    .then(r => r.ok ? r.text() : null)
    .then(svg => {
      if (svg) {
        window.ICON_CACHE[name] = svg;
      }
    })
    .catch(() => {})
));

// Expone globalmente
window.getIcon = getIcon;
