/**
 * DECK GOLF - Lógica de Cartas y Construcción de Mazo
 */

function cardIcon(c) {
  if (c && c.iconKey) return getIcon(c.iconKey);
  return (c && c.icon) || '❓';
}

function getUIAdjustedDist(baseDist) {
    if (!state.golfer) return baseDist;
    let m = 1.0;
    if (state.golfer.id === 'g_marray') m = 0.925; 
    else if (state.golfer.id === 'g_rehm') m = 1.075; 
    return Math.round(baseDist * m);
}

function initDeck() { 
    state.drawPile=[]; state.hand=[]; state.money=0; state.gems=[]; state.activeUpgrades=[];
    CLUBS_POOL.forEach(c => state.drawPile.push(cloneCard(c))); 
    for(const[id,c] of Object.entries(state.upgradesConfig)) { 
        if(c > 0) { 
            let t = UPGRADES_POOL.find(x=>x.id===id); 
            if(t) state.activeUpgrades.push({...t, uses:3, active:false}); 
        } 
    }

    state.handicaps = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    shuffle(state.handicaps);

    shuffle(state.drawPile); $('h-money').textContent=state.money; renderUpgrades();
}

function renderUpgrades() {
    const bar = $('upgrades-bar'); bar.innerHTML = '';
    let controlActive = false; 
    
    state.activeUpgrades.forEach(u => {
        if (u.id === 'u_control' && u.active) controlActive = true;
        
        const btn = document.createElement('div'); 
        btn.className = 'upgrade-btn' + (u.active ? ' active' : '') + (u.uses === 0 ? ' empty' : '');
        btn.innerHTML = `${cardIcon(u)}<div class="upgrade-uses">${u.uses}</div>`;
        btn.onclick = () => { 
            if(state.phase !== 'card_select' || u.uses === 0) return; 
            u.active = !u.active; 
            renderUpgrades(); updateShootBtnUI(); updateReachDisplay(); drawUI(); 
        };
        bar.appendChild(btn);
    });

    const aimTrack = $('aim-track');
    if (aimTrack) {
        aimTrack.style.width = controlActive ? '50%' : '100%';
        aimTrack.style.margin = controlActive ? '0 auto' : '0';
        aimTrack.style.transition = 'width 0.25s ease-in-out'; 
    }
}

function drawCardsToHand() {
  if(!state.holeData) return;
  const sHP = state.currentTerrain === 'green';
  if(sHP && typeof AudioEngine!=='undefined') AudioEngine.playBGM('tension');
  
  let pD = (state.holeData.greenR / state.holeData.scale) > 30 ? 60 : 30;
  const ePI = state.hand.findIndex(c=>c.isPutt); 
  if(!sHP && ePI !== -1) state.hand.splice(ePI,1); 
  
  while(state.hand.length < 5) { if(!state.drawPile.length) break; state.hand.push(state.drawPile.pop()); }
  
  if(sHP && ePI === -1){ 
      let p = {baseId:'putt', name:'Putt', dist:pD, icon:ICONS.club_putt, iconKey:'putt', type:'club', isPutt:true};
      state.hand.push(cloneCard(p)); 
  } else if (sHP && ePI !== -1) {
      state.hand[ePI].dist = pD;
  }
  
  if(!state.hand.some(c=>c.type==='club') && !sHP && state.hand.length>0) {
      return state.drawPile.some(c=>c.type==='club') ? showSoftlockOverlay() : $('gameover-overlay').style.display='flex';
  }
  if(!state.hand.length && !state.drawPile.length) return $('gameover-overlay').style.display='flex';
  $('deck-count').textContent=state.drawPile.length; renderCards();
}

function discardPlayedCards() { 
    state.hand=state.hand.filter(c=>c.uid!==state.selectedClub); state.selectedClub=null; 
    state.activeUpgrades.forEach(u => { if(u.active && u.id !== 'u_mulligan') { u.uses--; u.active=false; } }); 
    renderUpgrades();
}

function renderCards() {
  $('cards-row').innerHTML='';
  state.hand.forEach(c => {
    let d = (state.currentTerrain==='green' && !c.isPutt);
    const div=document.createElement('div'); 
    div.className='card'+(d?' disabled':'')+(state.selectedClub===c.uid?' selected':'');
    if(d) div.style.cssText='opacity:0.3;pointer-events:none;';
    
    const displayDist = getUIAdjustedDist(c.dist);
    div.innerHTML=`<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(c)}</div><div class="card-name">${c.name}</div><div class="card-dist">~${displayDist}m</div>`;
    
    div.onclick=() => { 
        if(state.phase!=='card_select'||d) return; 
        state.selectedClub=state.selectedClub===c.uid?null:c.uid; 
        renderCards(); updateShootBtnUI(); updateReachDisplay(); drawUI(); 
    };
    $('cards-row').appendChild(div);
  });
}

function showDeckBuilder() {
    const overlay = $('deck-overlay');
    const grid = $('deck-grid');
    const btn = $('deck-btn');
    const counter = $('deck-counter');
    overlay.style.display = 'flex'; 
    state.upgradesConfig = {}; 
    let tU = 0; 
    state.golfer = typeof GOLFERS !== 'undefined' ? GOLFERS[0] : null;

    grid.innerHTML = '';
    const step1Div = document.createElement('div');
    step1Div.style.cssText = 'width: 100%; display: flex; flex-direction: column; align-items: center;';
    const step2Div = document.createElement('div');
    step2Div.style.cssText = 'width: 100%; display: none; flex-direction: column; align-items: center;';
    
    grid.appendChild(step1Div);
    grid.appendChild(step2Div);

    function renderStep1() {
        step1Div.innerHTML = '';
        counter.style.display = 'none';
        
        const tGolfers = document.createElement('div');
        tGolfers.className = 'db-title';
        tGolfers.style.marginTop = '45px';
        tGolfers.textContent = t('db_pick_golfer');
        step1Div.appendChild(tGolfers);

        const cGolfers = document.createElement('div');
        cGolfers.className = 'db-wrap';
        step1Div.appendChild(cGolfers);

        if (typeof GOLFERS !== 'undefined') {
            GOLFERS.forEach((g, i) => {
                const div = document.createElement('div');
                const isSelected = state.golfer ? state.golfer.id === g.id : i === 0;
                div.className = 'golfer-card' + (isSelected ? ' selected' : '');
                let colorClass = i === 1 ? 'g-color-2' : (i === 2 ? 'g-color-3' : '');
                let diffClass = g.diffKey === 'easy' ? 'diff-Facil' : (g.diffKey === 'normal' ? 'diff-Normal' : 'diff-Dificil');
                div.innerHTML = `
                    <div class="card-badge" style="display:${isSelected ? 'flex' : 'none'}; position:absolute; top:-6px; left:-6px; background:var(--accent2); color:#000; font-size:10px; font-weight:bold; width:20px; height:20px; border-radius:10px; align-items:center; justify-content:center; z-index:2;">${getIcon('check')}</div>
                    <div class="golfer-icon ${colorClass}" style="font-size:32px">${getIcon('golfer')}</div>
                    <div style="font-size:14px; color:#fff; margin-bottom:8px; letter-spacing:0.12em; text-transform:uppercase; font-weight:bold;">${g.name}</div>
                    <div style="display:flex; flex-direction:column; gap:6px; width:100%;">
                        <div class="stat-row"><span>${t('stat_straight')}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${(g.stats.straight/5)*100}%"></div></div></div>
                        <div class="stat-row"><span>${t('stat_power')}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${(g.stats.power/5)*100}%"></div></div></div>
                        <div class="stat-row"><span>${t('stat_control')}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${(g.stats.control/5)*100}%"></div></div></div>
                    </div>
                    <div class="golfer-diff ${diffClass}">${t('diff_'+g.diffKey)}</div>
                    <div class="card-tooltip">${t(g.descKey)}</div>
                `;
                div.onclick = () => {
                    cGolfers.querySelectorAll('.golfer-card').forEach(x => { 
                        x.classList.remove('selected', 'show-tooltip'); 
                        x.querySelector('.card-badge').style.display='none'; 
                        let t = x.querySelector('.card-tooltip');
                        if(t) t.classList.remove('tooltip-right', 'tooltip-left');
                    });
                    
                    div.classList.add('selected', 'show-tooltip'); 
                    div.querySelector('.card-badge').style.display='flex';
                    setTimeout(() => div.classList.remove('show-tooltip'), 2500);

                    const tooltip = div.querySelector('.card-tooltip');
                    if (tooltip) {
                        tooltip.classList.remove('tooltip-right', 'tooltip-left');
                        
                        // Forzamos al navegador a recalcular el CSS en este milisegundo exacto
                        void tooltip.offsetWidth; 
                        
                        const gridRect = grid.getBoundingClientRect();
                        const tRect = tooltip.getBoundingClientRect();
                        
                        if (tRect.right > gridRect.right) {
                            tooltip.classList.add('tooltip-right');
                        } else if (tRect.left < gridRect.left) {
                            tooltip.classList.add('tooltip-left');
                        }
                    }

                    state.golfer = g;
                    btn.disabled = false;
                };
                cGolfers.appendChild(div);
            });
        }
        btn.textContent = t('db_confirm_golfer');
        btn.disabled = !state.golfer;
        btn.onclick = () => {
            step1Div.style.display = 'none';
            renderStep2();
            step2Div.style.display = 'flex';
        };
    }

    function renderStep2() {
        step2Div.innerHTML = '';
        counter.style.display = 'block';
        const maxU = (typeof MAX_UPGRADES !== 'undefined') ? MAX_UPGRADES : 2;
        counter.textContent = t('db_upgrades_counter',{n:tU, max:maxU});

        const tUpgrades = document.createElement('div');
        tUpgrades.className = 'db-title';
        tUpgrades.textContent = t('db_pick_upgrades');
        step2Div.appendChild(tUpgrades);

        const cUpgrades = document.createElement('div');
        cUpgrades.className = 'db-wrap';
        step2Div.appendChild(cUpgrades);

        UPGRADES_POOL.forEach(c => {
            if (state.upgradesConfig[c.id] === undefined) state.upgradesConfig[c.id] = 0; 
            const div = document.createElement('div'); 
            div.className = 'card upgrade-card' + (state.upgradesConfig[c.id] > 0 ? ' selected' : '');
            div.innerHTML = `
                <div class="card-badge" style="display:${state.upgradesConfig[c.id] > 0 ? 'flex' : 'none'}">${getIcon('check')}</div>
                <div class="card-icon">${cardIcon(c)}</div>
                <div class="card-name">${c.name}</div>
                <div class="card-dist" style="font-size:12px; color:var(--text)">${t('db_uses')}</div>
                ${c.desc ? `<div class="card-tooltip">${t('upg_'+c.id)}</div>` : ''}
            `;
            div.onclick = () => {
                cUpgrades.querySelectorAll('.card').forEach(x => {
                    x.classList.remove('show-tooltip');
                    let t = x.querySelector('.card-tooltip');
                    if(t) t.classList.remove('tooltip-right', 'tooltip-left');
                }); 
                
                if(c.desc) { 
                    div.classList.add('show-tooltip'); 
                    setTimeout(() => div.classList.remove('show-tooltip'), 2500);

                    const tooltip = div.querySelector('.card-tooltip');
                    if (tooltip) {
                        tooltip.classList.remove('tooltip-right', 'tooltip-left');
                        
                        // Forzamos al navegador a recalcular el CSS
                        void tooltip.offsetWidth; 
                        
                        const gridRect = grid.getBoundingClientRect();
                        const tRect = tooltip.getBoundingClientRect();

                        if (tRect.right > gridRect.right) {
                            tooltip.classList.add('tooltip-right');
                        } else if (tRect.left < gridRect.left) {
                            tooltip.classList.add('tooltip-left');
                        }
                    }
                }

                const n = state.upgradesConfig[c.id];
                if (n === 1) { state.upgradesConfig[c.id] = 0; tU--; } else if (n === 0 && tU < maxU) { state.upgradesConfig[c.id] = 1; tU++; }
                const badge = div.querySelector('.card-badge');
                if (state.upgradesConfig[c.id] > 0) { div.classList.add('selected'); badge.style.display='flex'; badge.innerHTML=getIcon('check'); } else { div.classList.remove('selected'); badge.style.display='none'; }
                counter.textContent = t('db_upgrades_counter',{n:tU, max:maxU}); 
                btn.disabled = (tU !== maxU);
            }; 
            cUpgrades.appendChild(div);
        });

        const sep = document.createElement('div');
        sep.className = 'db-sep';
        step2Div.appendChild(sep);

        const tClubs = document.createElement('div');
        tClubs.className = 'db-title muted';
        tClubs.textContent = t('db_base_clubs');
        step2Div.appendChild(tClubs);

        const cClubs = document.createElement('div');
        cClubs.className = 'db-wrap';
        step2Div.appendChild(cClubs);

        if (typeof CLUBS_POOL !== 'undefined') {
            CLUBS_POOL.forEach(c => {
                const div = document.createElement('div'); 
                div.className = 'card'; 
                div.style.cssText = 'opacity:0.5; transform:scale(0.85); pointer-events:none; margin:-4px;';
                const dDist = getUIAdjustedDist(c.dist);
                div.innerHTML = `<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(c)}</div><div class="card-name">${c.name}</div><div class="card-dist">~${dDist}m</div>`;
                cClubs.appendChild(div);
            });
        }

        btn.textContent = t('deck_confirm');
        btn.disabled = (tU !== maxU);
        btn.onclick = () => { overlay.style.display='none'; initDeck(); startHole(0); };
    }
    renderStep1();
}

function showSoftlockOverlay() {
  const o=$('softlock-overlay'), c=$('softlock-cards'), b=$('softlock-btn'); c.innerHTML=''; let s=new Set();
  state.hand.forEach(x => {
    const dDist = getUIAdjustedDist(x.dist);
    const div=document.createElement('div'); div.className='card'; 
    div.innerHTML=`<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(x)}</div><div class="card-name">${x.name}</div><div class="card-dist">~${dDist}m</div>`;
    div.onclick=()=>{ if(s.has(x.uid)){s.delete(x.uid);div.classList.remove('to-return');}else{s.add(x.uid);div.classList.add('to-return');} b.disabled=!s.size; }; 
    c.appendChild(div);
  });
  b.disabled=true; o.style.display='flex';
  b.onclick=()=>{ o.style.display='none'; state.hand.filter(x=>s.has(x.uid)).forEach(x=>state.drawPile.push(x)); state.hand=state.hand.filter(x=>!s.has(x.uid)); shuffle(state.drawPile); drawCardsToHand(); };
}

function grantReward(n, title, cb) {
    $('reward-title').textContent=title; $('reward-cards').innerHTML='';
    for(let i=0;i<n;i++){ 
        const c=cloneCard(CLUBS_POOL[Math.floor(Math.random()*CLUBS_POOL.length)]); state.drawPile.push(c); 
        const dDist = getUIAdjustedDist(c.dist);
        const d=document.createElement('div'); d.className='card'; 
        d.innerHTML=`<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(c)}</div><div class="card-name">${c.name}</div><div class="card-dist">~${dDist}m</div>`;
        $('reward-cards').appendChild(d); 
    }
    shuffle(state.drawPile); $('reward-overlay').style.display='flex'; $('reward-btn').onclick=()=>{ $('reward-overlay').style.display='none'; if(cb)cb(); };
}

function showPickReward(n, clubsOnly, cb) {
    $('pick-title').textContent=clubsOnly?t('pick_mission'):(n>1?t('pick_eagle'):t('pick_birdie'));
    $('pick-sub').textContent=t('pick_sub',{n}); $('pick-cards').innerHTML=''; let pL=n; $('pick-btn').disabled=true;
    let pool = [...CLUBS_POOL];
    for(let i=0;i<3;i++){
        let c = pool.splice(Math.floor(Math.random()*pool.length), 1)[0];
        const dDist = getUIAdjustedDist(c.dist);
        const d=document.createElement('div'); d.className='card face-down';
        const bD=document.createElement('div'); bD.style.cssText='font-size:30px;'; bD.textContent='❓';
        const fD=document.createElement('div'); fD.style.cssText='display:none;flex-direction:column;align-items:center;'; 
        fD.innerHTML=`<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(c)}</div><div class="card-name">${c.name}</div><div class="card-dist">~${dDist}m</div>`;
        d.append(bD, fD); let f=false;
        d.onclick=()=>{ if(!f&&pL>0){ f=true; pL--; d.classList.remove('face-down'); bD.style.display='none'; fD.style.display='flex'; state.drawPile.push(cloneCard(c)); if(!pL)$('pick-btn').disabled=false; } };
        $('pick-cards').appendChild(d);
    }
    $('pick-reward-overlay').style.display='flex'; $('pick-btn').onclick=()=>{ $('pick-reward-overlay').style.display='none'; shuffle(state.drawPile); if(cb)cb(); };
}

function showMissionReward(mCount, cb) {
    const par = state.holeData.par;
    $('mission-reward-overlay').style.display = 'flex';
    $('mr-pick-cards').innerHTML = '';
    $('mr-extra-rewards').innerHTML = '';
    $('mr-btn').disabled = true;
    $('mr-btn').textContent = t('mr_accept');

    let pool = [...CLUBS_POOL];
    let selectedClub = null;

    for(let i=0;i<3;i++) {
        let c = pool.splice(Math.floor(Math.random()*pool.length), 1)[0];
        const dDist = getUIAdjustedDist(c.dist);
        const d=document.createElement('div'); d.className='card';
        d.innerHTML=`<span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(c)}</div><div class="card-name">${c.name}</div><div class="card-dist">~${dDist}m</div>`;

        d.onclick=()=>{
            Array.from($('mr-pick-cards').children).forEach(el => el.classList.remove('selected'));
            d.classList.add('selected');
            selectedClub = c;
            $('mr-btn').disabled = false;
        };
        $('mr-pick-cards').appendChild(d);
    }

    if (mCount >= 2 && par >= 4) {
        let u = UPGRADES_POOL[Math.floor(Math.random()*UPGRADES_POOL.length)];
        const dU=document.createElement('div'); dU.className='card upgrade-card'; dU.style.pointerEvents='none';
        dU.innerHTML=`<div class="card-badge" style="display:flex; background:var(--accent)">+1</div><span class="card-type">${t('type_upgrade')}</span><div class="card-icon">${cardIcon(u)}</div><div class="card-name">${u.name}</div><div class="card-dist gold">${t('bonus')}</div>`;
        $('mr-extra-rewards').appendChild(dU);
        state._tempRewardUpgrade = u;
    } else {
        state._tempRewardUpgrade = null;
    }

    if (mCount >= 3 && par === 5) {
        let g = cloneCard(getRandomGem());
        const dG=document.createElement('div'); dG.className='card gem-card'; dG.style.pointerEvents='none';
        dG.innerHTML=`<div class="card-badge" style="display:flex; background:var(--accent2)">+1</div><span class="card-type">${t('type_gem')}</span><div class="card-icon">${cardIcon(g)}</div><div class="card-name">${itemName(g)}</div><div class="card-dist gold">${g.price}${getIcon('coin')}</div>`;
        $('mr-extra-rewards').appendChild(dG);
        state._tempRewardGem = g;
    } else {
        state._tempRewardGem = null;
    }

    $('mr-btn').onclick = () => {
        if(selectedClub) state.drawPile.push(cloneCard(selectedClub));
        if(state._tempRewardUpgrade) grantSpecificUpgrade(state._tempRewardUpgrade);
        if(state._tempRewardGem) state.gems.push(state._tempRewardGem);
        
        $('mission-reward-overlay').style.display = 'none';
        shuffle(state.drawPile);
        if(cb) cb();
    };
}

function grantSpecificUpgrade(u) {
    let ex = state.activeUpgrades.find(x=>x.id===u.id); 
    if(ex) ex.uses++; 
    else state.activeUpgrades.push({...u, uses:1, active:false}); 
    renderUpgrades();
}

function showSlotMachine(spins, baseCash, cb) {
    const o = $('slot-overlay'), rls = [$('slot-reel-1'), $('slot-reel-2'), $('slot-reel-3')], btn = $('slot-spin-btn'), eBtn = $('slot-exit-btn'), res = $('slot-result');
    let sL = spins; $('slot-spins').textContent = sL; eBtn.style.display = 'none'; btn.style.display = 'block'; btn.disabled = false; 
    state.money += baseCash; $('h-money').textContent = state.money; res.innerHTML = tWithIcons('slot_bullseye',{v:baseCash}); $('slot-sub').textContent = t('slot_aim_prize'); rls.forEach(r => r.innerHTML = getIcon('question'));

    const SLOT_COIN = 'coin', SLOT_IRON = 'iron', SLOT_GEM = 'diamond', SLOT_UPG = 'power';
    const slotKeys = [SLOT_COIN, SLOT_IRON, SLOT_GEM, SLOT_UPG];
    let sI; o.style.display = 'flex';

    btn.onclick = () => {
        if(sL <= 0) return; sL--; $('slot-spins').textContent = sL; btn.disabled = true; $('slot-machine').classList.add('slot-spinning'); res.textContent = t('slot_spinning');
        if(typeof AudioEngine!=='undefined') AudioEngine.playBGM('slot');
        let ticks = 0; sI = setInterval(() => { rls.forEach(r => r.innerHTML = getIcon(slotKeys[ticks % slotKeys.length])); ticks++; if(typeof AudioEngine!=='undefined') AudioEngine.playSFX('tick'); }, 100);
        setTimeout(() => {
            clearInterval(sI); $('slot-machine').classList.remove('slot-spinning');
            if(typeof AudioEngine!=='undefined') { AudioEngine.stopBGM(); AudioEngine.playSFX('slot_stop'); }
            let r1, r2, r3;
            if (getTotalClubsInDeck() < 8 && Math.random() < 0.8) { r1 = r2 = r3 = SLOT_IRON; }
            else if (Math.random() < 0.35) { let w = slotKeys[Math.floor(Math.random()*slotKeys.length)]; r1 = r2 = r3 = w; }
            else { r1 = slotKeys[Math.floor(Math.random()*slotKeys.length)]; r2 = slotKeys[Math.floor(Math.random()*slotKeys.length)]; r3 = slotKeys[Math.floor(Math.random()*slotKeys.length)]; if (r1 === r2 && r2 === r3) r3 = slotKeys[(slotKeys.indexOf(r3)+1)%slotKeys.length]; }
            rls[0].innerHTML = getIcon(r1); rls[1].innerHTML = getIcon(r2); rls[2].innerHTML = getIcon(r3);

            if (r1 === r2 && r2 === r3) {
                if(r1 === SLOT_COIN) { let m = [50,100][Math.floor(Math.random()*2)]; state.money += m; $('h-money').textContent = state.money; res.innerHTML = tWithIcons('slot_line_money',{v:m}); }
                else if(r1 === SLOT_IRON) { const c=cloneCard(CLUBS_POOL[Math.floor(Math.random()*CLUBS_POOL.length)]); state.drawPile.push(c); res.textContent = t('slot_line_club',{v:c.name}); }
                else if(r1 === SLOT_GEM) { const g=cloneCard(getRandomGem()); state.gems.push(g); res.textContent = t('slot_line_gem',{v:itemName(g)}); }
                else if(r1 === SLOT_UPG) { let u=UPGRADES_POOL[Math.floor(Math.random()*UPGRADES_POOL.length)]; grantSpecificUpgrade(u); res.textContent = t('slot_line_upg',{v:u.name}); }
                if(typeof AudioEngine!=='undefined') setTimeout(()=>AudioEngine.playSFX('slot_win'), 200);
            } else { res.textContent = t('slot_no_prize'); if(typeof AudioEngine!=='undefined') setTimeout(()=>AudioEngine.playSFX('slot_lose'), 200); }
            if(sL > 0) btn.disabled = false; else { btn.style.display = 'none'; eBtn.style.display = 'block'; }
        }, 1500);
    };
    eBtn.onclick = () => { o.style.display = 'none'; if(typeof AudioEngine!=='undefined') AudioEngine.playBGM('game'); if(cb)cb(); };
}

function showShop(callback) {
    const overlay = $('shop-overlay'); $('shop-money').textContent = state.money;
    const moneyIcon = $('shop-money-icon'); if(moneyIcon) moneyIcon.innerHTML = getIcon('coin');
    const costIcon = $('shop-cost-icon'); if(costIcon) costIcon.innerHTML = getIcon('coin');
    const grid = $('shop-grid');
    grid.innerHTML = `<div style="width:100%;font-weight:bold;color:var(--text);margin-bottom:5px;text-align:center;">${t('shop_offers')}</div><div id="shop-buy-area" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;"></div><div style="width:100%;font-weight:bold;color:var(--text);margin-top:15px;margin-bottom:5px;text-align:center;">${t('shop_sell')}</div><div id="shop-sell-area" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;"></div>`;
    const buyArea = $('shop-buy-area'), sellArea = $('shop-sell-area'), btnBuy = $('shop-buy-btn'), costSpan = $('shop-cost'), cardsSpan = $('shop-total-cards');
    let selectedItems = new Set(), shopCards = [];

    for(let i=0;i<6;i++){ let t=CLUBS_POOL[Math.floor(Math.random()*CLUBS_POOL.length)]; shopCards.push({ id:Math.random().toString(), t, p:t.dist*2, oP:t.dist*2 }); }
    let validClubs = shopCards.filter(x => x.t.dist >= 100);
    if(validClubs.length > 0) { let dc = validClubs[Math.floor(Math.random()*validClubs.length)]; let desc = [0.2, 0.3, 0.4, 0.5][Math.floor(Math.random()*4)]; dc.p = Math.round(dc.p * (1-desc)); dc.discount = `-${desc*100}%`; }
    shuffle(shopCards);

    const upd = () => { 
        let c=0; selectedItems.forEach(x=>c+=x.p); 
        costSpan.textContent=c; $('shop-money').textContent=state.money; 
        let cTC=getTotalClubsInDeck(); 
        cardsSpan.innerHTML=selectedItems.size>0?`${cTC} <span style="color:var(--accent)">(+${selectedItems.size})</span>`:cTC; 
        costSpan.style.color=c>state.money?'var(--danger)':!selectedItems.size?'var(--text)':'var(--accent)'; 
        btnBuy.disabled=c>state.money||!selectedItems.size; 
    };

    function renderSellArea() {
        sellArea.innerHTML = ''; 
        let myItems = [...state.gems, ...state.hand.filter(c=>!c.isPutt), ...state.drawPile];
        if(myItems.length === 0) sellArea.innerHTML = `<span style="color:var(--text-muted);font-size:11px;">${t('shop_nothing')}</span>`;
        myItems.forEach(b => {
            const isGem = b.type === 'gem'; const d = document.createElement('div'); d.className = 'card' + (isGem?' gem-card':'');
            const dPrice = isGem ? b.price : 40;
            const dDist = isGem ? "" : `~${getUIAdjustedDist(b.dist)}m`;
            d.innerHTML = `<span class="card-type">${isGem?t('type_gem'):t('type_club')}</span><div class="card-icon">${cardIcon(b)}</div><div class="card-name">${itemName(b)}</div><div class="card-dist gold">${isGem?b.price:40}${getIcon('coin')}</div>`;
            d.onclick = () => {
                state.money += dPrice; $('h-money').textContent=state.money;
                if(isGem) { state.gems.splice(state.gems.findIndex(x=>x.uid===b.uid), 1); } 
                else { const hIdx = state.hand.findIndex(x=>x.uid === b.uid); if(hIdx > -1) state.hand.splice(hIdx, 1); else { const pIdx = state.drawPile.findIndex(x=>x.uid === b.uid); if(pIdx > -1) state.drawPile.splice(pIdx, 1); } }
                renderSellArea(); upd();
            }; sellArea.appendChild(d);
        });
    }

    shopCards.forEach(x => {
        const d=document.createElement('div'); d.className='card';
        const dDist = getUIAdjustedDist(x.t.dist);
        d.innerHTML=`<div class="shop-price">${x.p}${getIcon('coin')}</div><span class="card-type">${t('type_club')}</span><div class="card-icon">${cardIcon(x.t)}</div><div class="card-name">${x.t.name}</div><div class="card-dist">~${dDist}m</div>${x.discount?`<div style="position:absolute;bottom:-10px;background:var(--danger);color:#fff;font-size:9px;padding:2px 4px;border-radius:4px;z-index:5;">${x.discount} (<del>${x.oP}</del>)</div>`:''}`;
        d.onclick=() => { if(state.money>=x.p){ if(selectedItems.has(x)){selectedItems.delete(x);d.classList.remove('shop-selected');}else{selectedItems.add(x);d.classList.add('shop-selected');} upd(); } }; 
        buyArea.appendChild(d);
    });

    renderSellArea(); upd(); overlay.style.display='flex';
    $('shop-buy-btn').onclick=() => { let c=0; selectedItems.forEach(x=>{c+=x.p; state.drawPile.push(cloneCard(x.t));}); state.money-=c; $('h-money').textContent=state.money; $('shop-overlay').style.display='none'; shuffle(state.drawPile); if(callback)callback(); };
    $('shop-exit-btn').onclick=() => { $('shop-overlay').style.display='none'; if(callback)callback(); };
}