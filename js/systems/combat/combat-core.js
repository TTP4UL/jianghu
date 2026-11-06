const CombatCore = {
  getEffectiveAC(target) {
    let baseAC = target.ac;
    if (target.buffs && target.buffs.acMods) {
      target.buffs.acMods.forEach(mod => { baseAC += mod.val; });
    }
    return baseAC;
  },

  enter(payload) {
    const ev = payload.event;
    G.currentCombatEvent = ev;
    G.enemy = { ...ev.enemy }; 
    G.enemy.arts = ev.enemyArts ? String(ev.enemyArts).split('|').map(s => s.trim()) : [];
    
    if (ev.enemyInner && G.data.MARTIAL_ARTS[ev.enemyInner]) {
      G.enemy.innerArt = G.data.MARTIAL_ARTS[ev.enemyInner];
    }
    G.enemy.maxQi = Number(ev.enemyQi) || 10;
    G.enemy.qi = G.enemy.maxQi;
    G.enemy.atk = Number(ev.enemyAtk) || 4;

    if (ev.phase2HpTrigger || ev.phase2Arts) {
      G.enemy.phase2Data = {
        hpTrigger: Number(ev.phase2HpTrigger) || 50,
        dialog: ev.phase2Dialog || '',
        newArts: ev.phase2Arts || '',
        healPercent: Number(ev.phase2Heal) || 0
      };
      G.enemy.phase2Triggered = false;
    }
    
    G.companionAttackUsed = false; // 舊版，可保留
    G.companionUsedThisCombat = false; // ★ 新增：記錄同伴本場是否已出手
    G.utilityUsedThisTurn = false; 
    G.combatTurn = 1;
    
    // ★ 新增：判定「看戲模式」
    (G.player.companions || []).forEach(cid => {
      const c = G.data.COMPANIONS[cid];
      if (c) {
        c._isIdling = false;
        const minHp = Number(c.minHpForAction) || 0;
        if (G.enemy.maxHp < minHp) {
          c._isIdling = true;
          // 開場彈出台詞
          const waitText = this.getCompanionDialog(c, 'tooWeak');
          if (waitText) HUD.log('dialogue', waitText, c.name);
        }
      }
    });
    document.getElementById('loadoutBtn').classList.add('hidden'); 
    document.getElementById('enemyHud').classList.remove('hidden');
    
    HUD.setScene(ev.badge || '戰鬥', ev.title || '遭遇強敵');
    this.updateHUD();
    this.triggerInnerEffect();
    this.renderActions();
    SaveSystem.save();
  },

  updateHUD() {
    const e = G.enemy;
    if (!e) return;
    const turnBadge = document.getElementById('combatTurnBadge');
    if (turnBadge) {
      turnBadge.textContent = `第 ${G.combatTurn} 回合`;
      turnBadge.classList.remove('hidden');
    }

    document.getElementById('enemyName').textContent = e.name;
    
    let baseAC = e.ac;
    let finalAC = this.getEffectiveAC(e);
    let diff = finalAC - baseAC;
    let acHtml = `<span>${finalAC}</span>`;
    if (diff > 0) acHtml += `<span class="text-[11px] text-[#047857] ml-0.5">(+${diff})</span>`;
    if (diff < 0) acHtml += `<span class="text-[11px] text-[#b91c1c] ml-0.5">(${diff})</span>`;
    document.getElementById('enemyAC').innerHTML = acHtml;

    document.getElementById('enemyHpText').textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
    document.getElementById('enemyHpBar').style.width = `${Math.min(100, Math.max(0, (e.hp / e.maxHp) * 100))}%`;
    document.getElementById('enemyPosText').textContent = `${Math.max(0, e.pos)} / ${e.maxPos}`;
    document.getElementById('enemyPosBar').style.width = `${Math.min(100, Math.max(0, (e.pos / e.maxPos) * 100))}%`;

    const curQi = e.qi !== undefined ? Math.max(0, e.qi) : (e.maxQi || 10);
    const maxQi = e.maxQi || 10;
    const qiTextEl = document.getElementById('enemyQiText');
    const qiBarEl = document.getElementById('enemyQiBar');
    if (qiTextEl) qiTextEl.textContent = `${curQi} / ${maxQi}`;
    if (qiBarEl) qiBarEl.style.width = `${Math.min(100, Math.max(0, (curQi / maxQi) * 100))}%`;

    const statusContainer = document.getElementById('enemyStatusTag');
    if (statusContainer) {
      statusContainer.innerHTML = '';
      if (e.isStunned) statusContainer.innerHTML += `<span class="wuxia-status-badge status-stun"><span>⚡ 眩暈</span></span>`;
      if (e.isPoisoned > 0) statusContainer.innerHTML += `<span class="wuxia-status-badge status-poison"><span>☠️ 劇毒</span><span class="status-badge-count">${e.isPoisoned}回</span></span>`;
      
      if (e.buffs && e.buffs.acMods && e.buffs.acMods.length > 0) {
        e.buffs.acMods.forEach(mod => {
          const sign = mod.val > 0 ? '+' : '';
          const color = mod.val > 0 ? 'status-shield' : 'status-stun';
          statusContainer.innerHTML += `<span class="wuxia-status-badge ${color}"><span>🌀 閃避 ${sign}${mod.val}</span><span class="status-badge-count">${mod.turns}回</span></span>`;
        });
      }
    }
    HUD.updateGauges();
  },

  triggerInnerEffect() {
    const p = G.player, e = G.enemy;
    
    if (p.isSealed > 0) {
      HUD.log('combat', `【封脈】你的經脈受阻，內功無法運轉！`, 'enemy');
    } else if (p.loadout?.inner[0]) {
      const art = G.data.MARTIAL_ARTS[p.loadout.inner[0]];
      if (art && art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const num = Number(val);
          if (key === 'regen' && p.hp < p.maxHp) { p.hp = Math.min(p.maxHp, p.hp + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 氣血。`, 'player'); }
          if (key === 'hp_regen' && p.hp < p.maxHp) { p.hp = Math.min(p.maxHp, p.hp + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 氣血。`, 'player'); }
          if (key === 'qi_regen' && p.qi < p.maxQi) { p.qi = Math.min(p.maxQi, p.qi + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 內力。`, 'player'); }
          if (key === 'pos_regen' && p.pos < p.maxPos) { p.pos = Math.min(p.maxPos, p.pos + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 架勢。`, 'player'); }
        });
      }
    }

    if (e.innerArt && e.innerArt.innerEffect) {
      if (e.isSealed > 0) {
        HUD.log('combat', `【封脈】${e.name}經脈受阻，內功無法運轉！`, 'player');
      } else {
        String(e.innerArt.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const num = Number(val);
          if (key === 'regen' && e.hp < e.maxHp) { e.hp = Math.min(e.maxHp, e.hp + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 氣血。`, 'enemy'); }
          if (key === 'pos_regen' && e.pos < e.maxPos) { e.pos = Math.min(e.maxPos, e.pos + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 架勢。`, 'enemy'); }
          if (key === 'qi_regen' && e.qi < e.maxQi) { e.qi = Math.min(e.maxQi, e.qi + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 內力。`, 'enemy'); }
        });
      }
    }
    this.updateHUD();
  },

    nextTurn() {
    if (G.enemy.hp <= 0) return this.end(true);
    if (G.player.hp <= 0) return this.end(false);

    // 先跑同伴，再跑敵人
    this.companionTurn(() => {
      if (G.enemy.hp <= 0) return this.end(true);
      if (G.player.hp <= 0) return this.end(false);
      this.enemyTurn();
    });
  },

  startPlayerTurn(isExtraAction = false) {
    const p = G.player, e = G.enemy;
    
    // ★ 修正：只有非額外行動，才重置身法使用狀態
    if (!isExtraAction) {
      G.utilityUsedThisTurn = false; 
    }
    
    this.tickBuffs(p); 

    this.triggerInnerEffect();
    this.updateHUD();
    this.renderActions();

    if (p.isSealed > 0) p.isSealed--;
    if (p.isSilenced > 0) p.isSilenced--;
  },

  renderActions() {
    if (G.player.hp <= 0) return this.end(false);
    if (G.enemy.hp <= 0) return this.end(true);
    

    const p = G.player;
    const isSkillBlocked = p.isSealed > 0 || p.isSilenced > 0; 

    const utilPanel = document.getElementById('utilityPanel');
    if (utilPanel) {
      utilPanel.innerHTML = '';
      const utilId = p.loadout?.utility[0];
      if (utilId) {
        const art = G.data.MARTIAL_ARTS[utilId];
        if (art) {
          const cost = art.qiCost || 2;
          const canUse = p.qi >= cost && !G.utilityUsedThisTurn && !isSkillBlocked;
          
          if (G.utilityUsedThisTurn) {
             utilPanel.classList.remove('hidden');
             utilPanel.innerHTML = `<div class="text-center text-xs text-[#a8a29e]">本回合已使用過身法絕技</div>`;
          } else {
            utilPanel.classList.remove('hidden');
            const btn = document.createElement('button');
            
            btn.className = `w-full px-3.5 py-2 rounded-lg border text-left flex justify-between items-center transition-all ${canUse ? 'bg-[#faf5ff] border-[#d8b4fe] text-[#7e22ce] hover:bg-[#f3e8ff] cursor-pointer shadow-sm' : 'bg-[#f5f5f4] border-[#e5dcce] text-[#a8a29e] cursor-not-allowed'}`;
            
            btn.innerHTML = `
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-wind"></i>
                <span class="font-black text-sm tracking-wide">施展【${art.name}】</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/50 border border-black/10">不消耗回合</span>
              </div>
              <div class="text-[11px] font-mono font-bold">消耗 ${cost} 真氣</div>
            `;
            
            btn.onclick = () => {
              if (!canUse) {
                if (isSkillBlocked) HUD.log('combat', '你穴道被封，無法施展身法！', 'neutral');
                else HUD.log('combat', '真氣不足，無法施展身法！', 'neutral');
                return;
              }
              this.useUtility(art);
            };
            utilPanel.appendChild(btn);
          }
        } else {
          utilPanel.classList.add('hidden');
        }
      } else {
        utilPanel.classList.add('hidden');
      }
    }

    const actions = [];
    actions.push({
      label: '⚔️ 普通攻擊',
      checkText: `vs 閃避 ${this.getEffectiveAC(G.enemy)}`,
      primary: true,
      action: () => this.attack()
    });

    const attackArts = p.loadout?.attack.filter(Boolean) || [];
    attackArts.forEach(artId => {
      const art = G.data.MARTIAL_ARTS[artId];
      if (!art) return;
      
      const cost = art.qiCost || 2;
      const hasEnoughQi = p.qi >= cost && !isSkillBlocked;
      const count = Number(art.diceCount) || 1;
      const dmgDesc = art.fixedDamage ? `固定傷害 ${art.fixedDamage}` : `基礎傷害 ${count}d${art.diceType || 8}`;

      actions.push({
        label: `✨ 施展【${art.name}】`,
        checkText: isSkillBlocked ? '穴道被封' : (hasEnoughQi ? `消耗 ${cost} 真氣` : '真氣匱乏'),
        desc: `威力大增，${dmgDesc}。`,
        primary: false,
        disabled: !hasEnoughQi,
        action: () => {
          if (isSkillBlocked) {
            HUD.log('combat', '你穴道被封，無法施展武學！', 'neutral');
            return;
          }
          if (!hasEnoughQi) {
            HUD.log('combat', '真氣不足，無法施展絕學！', 'neutral');
            return;
          }
          this.useArt(art);
        }
      });
    });

    actions.push({
      label: '🛡️ 凝神格擋',
      checkText: '回復架勢',
      primary: false,
      action: () => this.parry()
    });

    actions.push({
      label: '🧘 運功調息',
      checkText: '回復 3 真氣',
      primary: false,
      action: () => this.meditate()
    });

    HUD.renderChoices(actions);
  },

  dealDamage(target, dmg, isCrit = false, hitIndex = 1, totalHits = 1) {
    const isPlayer = (target === G.player);
    const attacker = isPlayer ? G.enemy : G.player;
    const targetEl = isPlayer ? document.getElementById('hudHpCur').parentElement : document.getElementById('enemyHpText').parentElement;
    const hitStr = totalHits > 1 ? `第 ${hitIndex} 段：` : '';
    const stance = isPlayer ? 'enemy' : 'player';
    
    if (!target.buffs) target.buffs = {};

    if (target.buffs.reflect && target.buffs.reflect.turns > 0) {
      const reflectDmg = Math.max(1, Math.floor(dmg * target.buffs.reflect.val));
      attacker.hp = Math.max(0, attacker.hp - reflectDmg);
      HUD.log('combat', `【反傷】${target === G.player ? '你' : '敵方'}的護體氣勁反震，造成 ${reflectDmg} 點真實傷害！`, isPlayer ? 'player' : 'enemy');
      HUD.floatDamage(isPlayer ? document.getElementById('enemyHpText').parentElement : document.getElementById('hudHpCur').parentElement, `-${reflectDmg}`, 'crit');
      this.updateHUD(); 
    }

    let finalIncomingDmg = dmg;
    if (target.buffs.shieldPct && target.buffs.shieldPct.turns > 0) { finalIncomingDmg = Math.floor(finalIncomingDmg * (1 - target.buffs.shieldPct.val)); }
    if (target.buffs.shield && target.buffs.shield.turns > 0) { finalIncomingDmg = Math.max(1, finalIncomingDmg - target.buffs.shield.val); }

    if (target.pos > 0) {
      target.pos -= finalIncomingDmg;
      if (target.pos <= 0) {
        target.pos = 0;
        HUD.triggerBreakEffect(isPlayer);
        HUD.log('combat', `${hitStr}【破防】${isPlayer ? '你的護體架勢被打崩！' : '敵方招架不及！'}`, stance);
        HUD.floatDamage(targetEl, '破防！', 'crit');
      } else {
        HUD.log('combat', `${hitStr}${isPlayer ? '你消耗架勢化解了攻勢' : '敵方消耗架勢抵擋了傷害'} (-${finalIncomingDmg} 架勢)。`, isPlayer ? 'enemy' : 'player');
        HUD.floatDamage(targetEl, `-${finalIncomingDmg}`, 'dodge');
      }
      return;
    }

    const realDmg = Math.floor(finalIncomingDmg * 1.5);
    target.hp = Math.max(0, target.hp - realDmg);
    HUD.log('combat', `${hitStr}【真實傷害】${isPlayer ? '你受到' : '敵方受到'} ${realDmg} 點重創！`, stance);
    HUD.floatDamage(targetEl, `-${realDmg}`, isCrit ? 'crit' : 'normal');
    
    if (isCrit || (isPlayer && realDmg >= 15)) { HUD.shakeScreen(); }
    this.checkBossPhase();
  },

  triggerParryCounter(enemy) {
    const p = G.player;
    const counterMod = Math.floor((p.stats.str - 10) / 2);
    const counterRoll = Math.floor(Math.random() * (Number(p.punchDiceType) || 8)) + 1;
    const counterDmg = Math.max(1, counterRoll + counterMod);

    HUD.log('combat', `【精準格擋】你架開攻勢，順勢反擊造成 ${counterDmg} 點傷害！`, 'player');
    this.dealDamage(enemy, counterDmg, false);
    HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${counterDmg}`, 'crit');
  },

  end(win) {
    document.getElementById('enemyHud').classList.add('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden'); 
    const turnBadge = document.getElementById('combatTurnBadge');
    if (turnBadge) turnBadge.classList.add('hidden');
    HUD.clearChoices(); 
    
    const ev = G.currentCombatEvent;
    const p = G.player;

    if (p) {
      p.buffs = {};            
      p.isPoisoned = 0;        
      p.poisonStacks = 0;
      p.isBleeding = 0;        
      p.bleedPct = 0;
      p.isSealed = 0;          
      p.isSilenced = 0;        
      p.isStunned = false;     
      p.parrying = false;      
    }

    if (win) {
      soundEngine.playGong();
      HUD.log('narrative', T('victory', { name: G.enemy.name }));
      if (ev.onVictory) EventSystem.load(ev.onVictory);
      else ExplorationSystem.endEvent();
    } else {
      HUD.log('combat', T('defeat'), 'enemy');
      if (ev.onDefeat) EventSystem.load(ev.onDefeat);
      else switchSystem('ending', { id: 'defeat' });
    }
    G.currentCombatEvent = null;
    SaveSystem.save();
  }
};

// ★ 核心：將 4 個模塊合併成一個 CombatSystem！
const CombatSystem = Object.assign(
  {}, 
  CombatEffects, 
  CombatActions, 
  CombatEnemy, 
  CombatCore
);

Systems.combat = CombatSystem;