/**
 * DECK GOLF - Sistema de Internacionalización (i18n)
 * Castellano (es) + Inglés (en).
 *
 * Uso:
 *   t('key')                 -> string traducido
 *   t('key', {v: 240})       -> interpola {v} en el texto
 *   setLang('en')            -> cambia idioma, persiste y refresca la UI
 *   applyStatic()            -> rellena elementos con [data-i18n] / [data-i18n-html]
 *
 * Marcado estático en el HTML:
 *   <span data-i18n="hud_hole"></span>          -> textContent
 *   <div data-i18n-html="menu_warning"></div>   -> innerHTML
 *   <button data-i18n-title="settings_open">    -> atributo title
 */
const I18N = {
  es: {
    // ---- HUD ----
    hud_hole: 'Hoyo', hud_par: 'Par', hud_strokes: 'Golpes',
    hud_score: 'Score', hud_money: 'Monedas',
    wind: 'VIENTO',

    // ---- Distancias / posición ----
    dist_to_hole: 'Distancia al hoyo', dist_reach: 'Alcance estimado', dist_pos: 'Posición',
    deck_pile: 'Mazo',
    pos_green: 'Green', pos_fairway: 'Fairway', pos_semirough: 'SemiRough',
    pos_rough: 'Rough', pos_deeprough: 'Deep Rough', pos_bunker: 'Bunker',
    pos_ob: 'Fuera', pos_agua: 'Agua', pos_tee: 'Tee',
    lie_penalty: 'Penalización Lie -{p}%',

    // ---- Medidores / botón de golpe ----
    meter_power: 'Fuerza', meter_power_hint: 'Botón o Espacio',
    meter_aim: 'Dirección', meter_aim_hint: 'Centra para precisión',
    btn_start: 'INICIAR', btn_shoot: 'GOLPEAR', btn_stop: 'PARAR', btn_wait: '...',

    // ---- Menú principal ----
    menu_sub: 'Golf Procedural · 18 Hoyos',
    menu_warning: '⚠️ ADVERTENCIA<br>Refrescar el navegador borrará tu progreso y tu colección de cartas para siempre.',
    menu_play: 'Jugar',

    // ---- Ajustes ----
    settings_title: 'Ajustes', settings_open: 'Ajustes',
    settings_volume: 'Volumen', settings_language: 'Idioma',
    settings_mute: 'Silenciar', settings_close: 'Cerrar',

    // ---- Vestuario / Deck Builder ----
    deck_title: 'Vestuario', deck_confirm: 'Confirmar y Jugar',
    db_pick_golfer: 'Selecciona tu Jugador', db_confirm_golfer: 'Confirmar Jugador',
    db_pick_upgrades: 'Elige tus Mejoras', db_base_clubs: 'Tus Palos Base',
    db_upgrades_counter: 'Mejoras: {n} / {max}', db_uses: '3 Usos',
    stat_straight: 'Recto', stat_power: 'Fuerza', stat_control: 'Control',
    diff_easy: 'Fácil', diff_normal: 'Normal', diff_hard: 'Difícil',

    // ---- Tipos de carta ----
    type_club: 'Palo', type_gem: 'Gema', type_upgrade: 'Mejora',
    bonus: 'Bonus',

    // ---- Tarjeta de resultados ----
    score_title: 'Tarjeta', score_front9: 'Front 9 (Ida)', score_final: 'Resultados Finales',
    score_label: 'Score: {v}',
    sc_hole: 'HOYO', sc_par: 'PAR', sc_strokes: 'GOLPES', sc_score: 'SCORE',
    sc_out: 'IDA', sc_total: 'TOTAL',
    btn_continue: 'Continuar', btn_newgame: 'Nueva Partida',

    // ---- Slot / Prize Zone ----
    prize_zone: 'Prize Zone', slot_intro: '¡Has caído en la zona de premio!',
    slot_spin: 'Tirar Rodillos', slot_bullseye: '¡Diana! +{v} {coin}', slot_aim_prize: '¡Premio por puntería!',
    slot_spinning: '...Girando...', slot_line_money: '¡LÍNEA! +{v} {coin}',
    slot_line_club: '¡LÍNEA! Palo: {v}', slot_line_gem: '¡LÍNEA! Gema: {v}',
    slot_line_upg: '¡LÍNEA! Mejora: {v}', slot_no_prize: 'Sin premio extra.',

    // ---- Misión cumplida / recompensas ----
    mr_title: '¡Misión Cumplida!', mr_pick: 'Elige 1 palo nuevo para tu bolsa.',
    mr_accept: 'Aceptar Recompensa', btn_accept: 'Aceptar',
    reward_title: '¡Recompensa!', reward_sub: 'Objetos añadidos a tu mazo/inventario.',
    pick_birdie: '¡Birdie!', pick_mission: '¡Recompensa de Misión!', pick_eagle: '¡Eagle o Mejor!',
    pick_sub: 'Elige {n} palo de los 3.', pick_continue: 'Continuar',
    reward_hio: '¡Hole In One! 3 Cartas', reward_front9: '¡Front 9! 3 Cartas',

    // ---- Softlock / Game over ----
    softlock_title: 'Sin Palos',
    softlock_sub: 'No tienes palos para golpear. Selecciona cartas para devolver al mazo y robar nuevas.',
    softlock_btn: 'Barajar y Robar',
    gameover_title: 'Bolsa Vacía', gameover_sub: 'No te quedan palos en la mano ni cartas en el mazo.',
    gameover_btn: 'Volver al Inicio',

    // ---- Tienda ----
    shop_title: 'Tienda', shop_money: 'Monedas:', shop_in_bag: 'Palos en bolsa:',
    shop_offers: 'OFERTAS', shop_sell: 'VENDER GEMAS Y PALOS', shop_nothing: 'No tienes objetos para vender.',
    shop_total: 'Total', shop_exit: 'Salir Tienda', shop_buy: 'Comprar',

    // ---- Mulligan ----
    mul_title: '¡Oh no!',
    mul_desc: 'Tienes un Mulligan en la mano. ¿Quieres gastarlo para rebobinar el tiempo y recuperar tu tiro (y las cartas gastadas)?',
    mul_no: 'Penalización', mul_yes: 'Usar Mulligan',
    mul_water: '¡Al Agua!', mul_ob: '¡Fuera de Límites!',

    // ---- Penalización ----
    pen_water: 'AGUA', pen_ob: 'FUERA DE LÍMITES', pen_sub: 'Penalización: +1 golpe',

    // ---- Final de hoyo ----
    hole_limit: 'LÍMITE +5', hole_in_one: '¡HOLE IN ONE!',
    hole_result: 'Hoyo {hole} en {strokes} golpes.<br><br>Ganaste {money} {coin}',
    hole_missions: 'Misiones completadas: {done} / {total}',
    hole_collect_mission: 'Recoger Recompensa Misión', hole_to_rewards: 'Continuar a Recompensas',

    // ---- Toasts ----
    toast_rewound: '⏳ Tiempo rebobinado', toast_mission: 'Misión Completada',

    // ---- Nombres de score ----
    'sn_-4': 'Condor', 'sn_-3': 'Albatross', 'sn_-2': 'Eagle', 'sn_-1': 'Birdie',
    'sn_0': 'Par', 'sn_1': 'Bogey', 'sn_2': 'Doble Bogey', 'sn_3': 'Triple Bogey', 'sn_4': 'Cuádruple Bogey',

    // ---- Gemas ----
    g_dia: 'Diamante', g_rub: 'Rubí', g_esm: 'Esmeralda', g_top: 'Topacio', g_cua: 'Cuarzo',

    // ---- Descripciones de mejoras ----
    upg_u_power: '+25% distancia', upg_u_heavy: 'Ignora el viento', upg_u_mulligan: 'Rebobina (OB/Agua)',
    upg_u_frog: 'Rebota en el agua', upg_u_tractor: 'Sin penalización de lie', upg_u_control: 'Máxima precisión',

    // ---- Misiones ----
    m_drive: 'Drive {v}m+', m_prize: 'Cae en Prize Zone', m_bunker: 'Cae en Bunker',
    m_chip: 'Emboca fuera de Green', m_club: 'Emboca con {v}', m_score: 'Score: {v}',
    m_hio: 'Hoyo en 1', m_u0: 'Usa 0 Mejoras', m_u1: 'Usa 1 o más mejoras',
    m_u2: 'Usa 2 o más mejoras', m_nohaz: 'Sin Agua/OB/Bunker', m_noc200: 'Sin palos de 200m+',

    // ---- Descripciones de golfistas ----
    golfer_g_marray_desc: 'Golpes precisos y controlados, carece de fuerza.',
    golfer_g_mckinze_desc: 'Equilibrado. Sufre de un ligero Fade constante.',
    golfer_g_rehm_desc: 'Fuerza extrema. Difícil de controlar y propenso al Slice.'
  },

  en: {
    // ---- HUD ----
    hud_hole: 'Hole', hud_par: 'Par', hud_strokes: 'Strokes',
    hud_score: 'Score', hud_money: 'Coins',
    wind: 'WIND',

    // ---- Distances / position ----
    dist_to_hole: 'Distance to hole', dist_reach: 'Estimated reach', dist_pos: 'Position',
    deck_pile: 'Deck',
    pos_green: 'Green', pos_fairway: 'Fairway', pos_semirough: 'Semi-Rough',
    pos_rough: 'Rough', pos_deeprough: 'Deep Rough', pos_bunker: 'Bunker',
    pos_ob: 'Out', pos_agua: 'Water', pos_tee: 'Tee',
    lie_penalty: 'Lie Penalty -{p}%',

    // ---- Meters / shoot button ----
    meter_power: 'Power', meter_power_hint: 'Button or Space',
    meter_aim: 'Aim', meter_aim_hint: 'Center for accuracy',
    btn_start: 'START', btn_shoot: 'SHOOT', btn_stop: 'STOP', btn_wait: '...',

    // ---- Main menu ----
    menu_sub: 'Procedural Golf · 18 Holes',
    menu_warning: '⚠️ WARNING<br>Refreshing the browser will erase your progress and your card collection forever.',
    menu_play: 'Play',

    // ---- Settings ----
    settings_title: 'Settings', settings_open: 'Settings',
    settings_volume: 'Volume', settings_language: 'Language',
    settings_mute: 'Mute', settings_close: 'Close',

    // ---- Locker room / Deck Builder ----
    deck_title: 'Locker Room', deck_confirm: 'Confirm and Play',
    db_pick_golfer: 'Select your Player', db_confirm_golfer: 'Confirm Player',
    db_pick_upgrades: 'Choose your Upgrades', db_base_clubs: 'Your Base Clubs',
    db_upgrades_counter: 'Upgrades: {n} / {max}', db_uses: '3 Uses',
    stat_straight: 'Straight', stat_power: 'Power', stat_control: 'Control',
    diff_easy: 'Easy', diff_normal: 'Normal', diff_hard: 'Hard',

    // ---- Card types ----
    type_club: 'Club', type_gem: 'Gem', type_upgrade: 'Upgrade',
    bonus: 'Bonus',

    // ---- Scorecard ----
    score_title: 'Scorecard', score_front9: 'Front 9', score_final: 'Final Results',
    score_label: 'Score: {v}',
    sc_hole: 'HOLE', sc_par: 'PAR', sc_strokes: 'STROKES', sc_score: 'SCORE',
    sc_out: 'OUT', sc_total: 'TOTAL',
    btn_continue: 'Continue', btn_newgame: 'New Game',

    // ---- Slot / Prize Zone ----
    prize_zone: 'Prize Zone', slot_intro: 'You landed in the prize zone!',
    slot_spin: 'Spin Reels', slot_bullseye: 'Bullseye! +{v} {coin}', slot_aim_prize: 'Accuracy prize!',
    slot_spinning: '...Spinning...', slot_line_money: 'LINE! +{v} {coin}',
    slot_line_club: 'LINE! Club: {v}', slot_line_gem: 'LINE! Gem: {v}',
    slot_line_upg: 'LINE! Upgrade: {v}', slot_no_prize: 'No extra prize.',

    // ---- Mission complete / rewards ----
    mr_title: 'Mission Complete!', mr_pick: 'Choose 1 new club for your bag.',
    mr_accept: 'Accept Reward', btn_accept: 'Accept',
    reward_title: 'Reward!', reward_sub: 'Items added to your deck/inventory.',
    pick_birdie: 'Birdie!', pick_mission: 'Mission Reward!', pick_eagle: 'Eagle or Better!',
    pick_sub: 'Choose {n} club from the 3.', pick_continue: 'Continue',
    reward_hio: 'Hole In One! 3 Cards', reward_front9: 'Front 9! 3 Cards',

    // ---- Softlock / Game over ----
    softlock_title: 'No Clubs',
    softlock_sub: 'You have no clubs to hit. Select cards to return to the deck and draw new ones.',
    softlock_btn: 'Shuffle and Draw',
    gameover_title: 'Empty Bag', gameover_sub: 'You have no clubs in hand or cards in the deck.',
    gameover_btn: 'Back to Start',

    // ---- Shop ----
    shop_title: 'Shop', shop_money: 'Coins:', shop_in_bag: 'Clubs in bag:',
    shop_offers: 'OFFERS', shop_sell: 'SELL GEMS AND CLUBS', shop_nothing: 'You have no items to sell.',
    shop_total: 'Total', shop_exit: 'Exit Shop', shop_buy: 'Buy',

    // ---- Mulligan ----
    mul_title: 'Oh no!',
    mul_desc: 'You have a Mulligan in hand. Do you want to spend it to rewind time and recover your shot (and the cards spent)?',
    mul_no: 'Penalty', mul_yes: 'Use Mulligan',
    mul_water: 'In the Water!', mul_ob: 'Out of Bounds!',

    // ---- Penalty ----
    pen_water: 'WATER', pen_ob: 'OUT OF BOUNDS', pen_sub: 'Penalty: +1 stroke',

    // ---- Hole end ----
    hole_limit: 'LIMIT +5', hole_in_one: 'HOLE IN ONE!',
    hole_result: 'Hole {hole} in {strokes} strokes.<br><br>You earned {money} {coin}',
    hole_missions: 'Missions completed: {done} / {total}',
    hole_collect_mission: 'Collect Mission Reward', hole_to_rewards: 'Continue to Rewards',

    // ---- Toasts ----
    toast_rewound: '⏳ Time rewound', toast_mission: 'Mission Complete',

    // ---- Score names ----
    'sn_-4': 'Condor', 'sn_-3': 'Albatross', 'sn_-2': 'Eagle', 'sn_-1': 'Birdie',
    'sn_0': 'Par', 'sn_1': 'Bogey', 'sn_2': 'Double Bogey', 'sn_3': 'Triple Bogey', 'sn_4': 'Quadruple Bogey',

    // ---- Gems ----
    g_dia: 'Diamond', g_rub: 'Ruby', g_esm: 'Emerald', g_top: 'Topaz', g_cua: 'Quartz',

    // ---- Upgrade descriptions ----
    upg_u_power: '+25% distance', upg_u_heavy: 'Ignores wind', upg_u_mulligan: 'Rewind (OB/Water)',
    upg_u_frog: 'Bounces on water', upg_u_tractor: 'No lie penalty', upg_u_control: 'Best accuracy',

    // ---- Missions ----
    m_drive: 'Drive {v}m+', m_prize: 'Land in Prize Zone', m_bunker: 'Land in Bunker',
    m_chip: 'Hole out off the Green', m_club: 'Hole out with {v}', m_score: 'Score: {v}',
    m_hio: 'Hole in 1', m_u0: 'Use 0 Upgrades', m_u1: 'Use 1 or more upgrades',
    m_u2: 'Use 2 or more upgrades', m_nohaz: 'No Water/OB/Bunker', m_noc200: 'No 200m+ clubs',

    // ---- Golfer descriptions ----
    golfer_g_marray_desc: 'Precise, controlled shots, but lacks power.',
    golfer_g_mckinze_desc: 'Balanced. Suffers from a slight constant Fade.',
    golfer_g_rehm_desc: 'Extreme power. Hard to control and prone to Slice.'
  }
};

// Idioma inicial: preferencia guardada, si no detecta el navegador (en-* -> en, resto -> es)
let currentLang = (() => {
  const saved = localStorage.getItem('dg_lang');
  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
})();

const getLang = () => currentLang;

function t(key, params) {
  const dict = I18N[currentLang] || I18N.es;
  let str = dict[key];
  if (str == null) str = I18N.es[key];
  if (str == null) return key;
  if (params) for (const k in params) str = str.split('{' + k + '}').join(params[k]);
  return str;
}

// Nombre localizado de un objeto: gemas se traducen por id; el resto mantiene su nombre propio.
function itemName(it) {
  if (it && it.type === 'gem' && I18N[currentLang][it.id] != null) return t(it.id);
  return it ? it.name : '';
}

// Traduce y reemplaza placeholders de iconos como {coin} por SVG
function tWithIcons(key, params) {
  let result = t(key, params);
  if (typeof getIcon !== 'undefined') {
    result = result.replace('{coin}', getIcon('coin'));
  }
  return result;
}

function applyStatic(root) {
  root = root || document;
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.getAttribute('data-i18n-title')); });
  document.documentElement.lang = currentLang;
}

function updateLangButtons() {
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
  });
}

// Refresca el contenido dinámico de la partida ya en curso al cambiar de idioma.
function refreshDynamic() {
  if (typeof state === 'undefined' || !state) return;
  if (typeof renderMissions === 'function' && state.missions) renderMissions();
  if (typeof renderCards === 'function' && state.hand) renderCards();
  if (typeof renderUpgrades === 'function' && state.activeUpgrades) renderUpgrades();
  if (typeof updateShootBtnUI === 'function') updateShootBtnUI();
  if (typeof updateReachDisplay === 'function') updateReachDisplay();
  // Posición actual
  const dPos = document.getElementById('d-pos');
  if (dPos && state.currentTerrain) {
    dPos.textContent = t('pos_' + state.currentTerrain) || t('pos_fairway');
  }
}

function setLang(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem('dg_lang', lang);
  applyStatic();
  updateLangButtons();
  refreshDynamic();
}

// Inicialización: aplica textos estáticos y conecta selectores de idioma + ajustes.
window.addEventListener('load', () => {
  applyStatic();
  updateLangButtons();

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });

  const gear = document.getElementById('gear-btn');
  const settings = document.getElementById('settings-overlay');
  const closeBtn = document.getElementById('settings-close');
  if (gear) { gear.style.fontSize = '18px'; gear.innerHTML = getIcon('gear'); }
  if (gear && settings) gear.addEventListener('click', () => { settings.style.display = 'flex'; });
  if (closeBtn && settings) closeBtn.addEventListener('click', () => { settings.style.display = 'none'; });
  if (settings) settings.addEventListener('click', (e) => { if (e.target === settings) settings.style.display = 'none'; });
});
