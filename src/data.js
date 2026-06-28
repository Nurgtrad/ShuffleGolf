const $ = id => document.getElementById(id);

// =========================================================================
// ZONA DE ICONOS (PREPARACIÓN PARA SVGs)
// =========================================================================
// Cuando tengas tus SVG, simplemente borra las comillas con el emoji
// y pega tu código SVG envuelto en acentos graves (` `).
// Ejemplo: 
// club_driver: `<svg viewBox="0 0 24 24"><path d="..." fill="currentColor"/></svg>`,

// Helper: obtiene icono SVG o emoji de fallback
function iconOrEmoji(name) {
  return (typeof getIcon !== 'undefined') ? getIcon(name) : {
    golfer: '🏌️', driver: '🏌', wood: '🌲', iron: '⛳', wedge: '🎯', sand: '⏳', lob: '📐', putt: '🕳',
    power: '🔥', aero: '💨', mulligan: '⏪', skimmer: '🏄', terrain: '🚙', control: '🎯',
    diamond: '💎', ruby: '💍', emerald: '👑', topaz: '🪨', quartz: '🔮', coin: '🪙', question: '❓'
  }[name] || '❓';
}

const ICONS = {
  golfer: iconOrEmoji('golfer'),
  club_driver: iconOrEmoji('driver'),
  club_wood: iconOrEmoji('wood'),
  club_iron: iconOrEmoji('iron'),
  club_wedge: iconOrEmoji('wedge'),
  club_sand: iconOrEmoji('sand'),
  club_lob: iconOrEmoji('lob'),
  club_putt: iconOrEmoji('putt'),
  upg_power: iconOrEmoji('power'),
  upg_aero: iconOrEmoji('aero'),
  upg_mulligan: iconOrEmoji('mulligan'),
  upg_skimmer: iconOrEmoji('skimmer'),
  upg_allterrain: iconOrEmoji('terrain'),
  upg_control: iconOrEmoji('control'),
  gem_dia: iconOrEmoji('diamond'),
  gem_rub: iconOrEmoji('ruby'),
  gem_esm: iconOrEmoji('emerald'),
  gem_top: iconOrEmoji('topaz'),
  gem_cua: iconOrEmoji('quartz'),
  money: iconOrEmoji('coin'),
  question: iconOrEmoji('question')
};

const CLUBS_POOL = [
  {id:'d', name:'Driver', dist:240, icon:ICONS.club_driver, iconKey:'driver', type:'club'},
  {id:'3w', name:'3 Wood', dist:215, icon:ICONS.club_wood, iconKey:'wood', type:'club'},
  {id:'5w', name:'5 Wood', dist:200, icon:ICONS.club_wood, iconKey:'wood', type:'club'},
  {name:'3 Iron', dist:190, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'4 Iron', dist:180, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'5 Iron', dist:170, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'6 Iron', dist:160, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'7 Iron', dist:150, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'8 Iron', dist:140, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'9 Iron', dist:130, icon:ICONS.club_iron, iconKey:'iron', type:'club'},
  {name:'Pitch W', dist:110, icon:ICONS.club_wedge, iconKey:'wedge', type:'club'},
  {name:'Gap W', dist:95,  icon:ICONS.club_wedge, iconKey:'wedge', type:'club'},
  {name:'Sand W', dist:80,  icon:ICONS.club_sand, iconKey:'sand', type:'club'},
  {name:'Lob W', dist:60,  icon:ICONS.club_lob, iconKey:'lob', type:'club'}
];

const UPGRADES_POOL = [
  {id:'u_power', name:'Power', icon:ICONS.upg_power, iconKey:'power', effect:'power', desc:'+25% distance', type:'upgrade'},
  {id:'u_heavy', name:'Aero', icon:ICONS.upg_aero, iconKey:'aero', effect:'heavy', desc:'Ignores wind', type:'upgrade'},
  {id:'u_mulligan', name:'Mulligan', icon:ICONS.upg_mulligan, iconKey:'mulligan', effect:'mulligan', desc:'Rewind (OB/Water)', type:'upgrade'},
  {id:'u_frog', name:'Skimmer', icon:ICONS.upg_skimmer, iconKey:'skimmer', effect:'frog', desc:'Bounces on water', type:'upgrade'},
  {id:'u_tractor', name:'All-Terrain', icon:ICONS.upg_allterrain, iconKey:'terrain', effect:'tractor', desc:'No lie penalty', type:'upgrade'},
  {id:'u_control', name:'Control', icon:ICONS.upg_control, iconKey:'control', effect:'control', desc:'Best accuracy', type:'upgrade'}
];

const GEMS_POOL = [
  {id:'g_dia', name:'Diamante', icon:ICONS.gem_dia, iconKey:'diamond', price:500, chance:5, type:'gem'},
  {id:'g_rub', name:'Rubí', icon:ICONS.gem_rub, iconKey:'ruby', price:250, chance:15, type:'gem'},
  {id:'g_esm', name:'Esmeralda', icon:ICONS.gem_esm, iconKey:'emerald', price:100, chance:25, type:'gem'},
  {id:'g_top', name:'Topacio', icon:ICONS.gem_top, iconKey:'topaz', price:50, chance:30, type:'gem'},
  {id:'g_cua', name:'Cuarzo', icon:ICONS.gem_cua, iconKey:'quartz', price:25, chance:25, type:'gem'}
];

const PUTTER_CARD = {baseId:'putt', name:'Putt', dist:30, icon:ICONS.club_putt, iconKey:'putt', type:'club', isPutt:true};
const HOLE_PARS = [4,4,3,5,4,3,4,5,4, 4,3,4,4,5,4,3,5,4];
const MAX_CLUBS = 20, MAX_UPGRADES = 2, MAX_INVENTORY = 6;

let state = {
  golfer: null,
  upgradesConfig:{}, drawPile:[], hand:[], gems:[], activeUpgrades:[], missions:[],
  money:0, hole:0, totalScore:0, scores:[], holeData:null, handicaps:[],
  ball:{x:0, y:0}, target:{x:0, y:0}, prevPos:{x:0, y:0}, currentTerrain:'tee', shotTerrain:'tee',
  strokes:0, phase:'card_select', selectedClub:null, currentUpgradeSelected:null,
  wind:{speed:0, dir:0}, powerVal:0, powerDir:1, powerHeld:false, aimVal:0.5, aimDir:1,
  ballAnim:null, cachedPattern:null, paths:{},
  m_hz:false, m_upgs:0, m_c200:false 
};

// ---- Guardado de progreso (localStorage) ----
const SAVE_KEY = 'shufflegolf_save_v1';
function saveProgress() {
  try {
    const snap = {
      golfer: state.golfer, upgradesConfig: state.upgradesConfig,
      drawPile: state.drawPile, hand: state.hand, gems: state.gems,
      activeUpgrades: state.activeUpgrades, money: state.money,
      hole: state.hole, totalScore: state.totalScore,
      scores: state.scores, handicaps: state.handicaps,
      holeData: state.holeData
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap));
  } catch(e) { console.warn('saveProgress failed', e); }
}
function hasProgress() { try { return !!localStorage.getItem(SAVE_KEY); } catch(e) { return false; } }
function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY); if(!raw) return false;
    Object.assign(state, JSON.parse(raw));
    // Re-vincular el golfista al objeto real: los métodos (getControlMultiplier,
    // getPowerMultiplier) se pierden al serializar a JSON y romperían el golpe.
    if(state.golfer && typeof GOLFERS !== 'undefined') {
      const full = GOLFERS.find(g => g.id === state.golfer.id);
      if(full) state.golfer = full;
    }
    return true;
  } catch(e) { console.warn('loadProgress failed', e); return false; }
}
function clearProgress() { try { localStorage.removeItem(SAVE_KEY); } catch(e) {} }

const M_TYPES = [
  { id:'drive', n:(v)=>t('m_drive',{v}), c:(st)=>st.strokes===1 && st.dist>=st.m.v },
  { id:'prize', n:()=>t('m_prize'), c:(st)=>st.pzHit },
  { id:'bunker', n:()=>t('m_bunker'), c:(st)=>st.terr==='bunker' },
  { id:'chip', n:()=>t('m_chip'), c:(st)=>st.inHole && st.pTerr!=='green' },
  { id:'club', n:(v)=>t('m_club',{v}), c:(st)=>st.inHole && st.club===st.m.v },
  { id:'score', n:(v)=>t('m_score',{v}), cH:(st)=>st.score===st.m.v },
  { id:'hio', n:()=>t('m_hio'), cH:(st)=>st.strokes===1 },
  { id:'u0', n:()=>t('m_u0'), cH:(st)=>st.uUpg===0 },
  { id:'u1', n:()=>t('m_u1'), c:(st)=>st.uUpg>=1 },
  { id:'u2', n:()=>t('m_u2'), c:(st)=>st.uUpg>=2 },
  { id:'nohaz', n:()=>t('m_nohaz'), cH:(st)=>!st.hz },
  { id:'noc200', n:()=>t('m_noc200'), cH:(st)=>!st.c200 }
];

function cloneCard(c) { return {...c, uid: Math.random().toString(36).substr(2, 9)}; }
function shuffle(array) { for(let i=array.length-1; i>0; i--){ const j=Math.floor(Math.random()*(i+1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }
function showToast(t) { const el = document.createElement('div'); el.textContent = t; el.style.cssText = 'position:absolute;top:25%;left:50%;transform:translate(-50%,-50%);background:var(--accent2);color:#000;padding:12px 24px;border-radius:30px;font-family:"DM Mono",monospace;font-size:12px;text-transform:uppercase;font-weight:bold;z-index:100;box-shadow:0 10px 20px rgba(0,0,0,0.5);pointer-events:none;animation:toastFade 2s forwards;text-align:center;'; $('game').appendChild(el); setTimeout(()=>el.remove(), 2000); }
const getTotalClubsInDeck = () => state.hand.filter(c=>c.type==='club').length + state.drawPile.filter(c=>c.type==='club').length;
function getRandomGem() { let r = Math.random() * 100, a = 0; for(let g of GEMS_POOL) { a += g.chance; if(r <= a) return g; } return GEMS_POOL[4]; }
function grantRandomUpgrade() { let u = UPGRADES_POOL[Math.floor(Math.random()*UPGRADES_POOL.length)]; let ex = state.activeUpgrades.find(x=>x.id===u.id); if(ex) ex.uses++; else state.activeUpgrades.push({...u, uses:1, active:false}); if(typeof renderUpgrades === 'function') renderUpgrades(); return u; }

function getLiePenalty(club, terrain) {
  let lF=Math.max(0,Math.min(1,((club?club.dist:150)-80)/160)), pD=0, pDM=1;
  if(state.activeUpgrades.some(u=>u.id==='u_tractor'&&u.active) || (club?.name==='Sand W'&&terrain==='bunker')) return {pDist:0, pDevMulti:1};
  if(terrain==='rough'){pD=0.08+0.17*lF; pDM=1.2+0.8*lF;} else if(terrain==='semirough'){pD=0.03+0.07*lF; pDM=1.1+0.4*lF;} else if(terrain==='deeprough'){pD=0.12+0.25*lF; pDM=1.4+1.0*lF;} else if(terrain==='bunker'){pD=0.20+0.30*lF; pDM=1.5+1.5*lF;}
  return {pDist:pD, pDevMulti:pDM};
}