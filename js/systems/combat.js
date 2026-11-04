const CombatSystem = {
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
    
    G.companionAttackUsed = false; 
    G.utilityUsedThisTurn = false; 
    document.getElementById('loadoutBtn').classList.add('hidden'); 
    document.getElementById('enemyHud').classList.remove('hidden');
    
    HUD.setScene(ev.badge || '戰鬥', ev.title || '遭遇強敵');
    this.updateHUD();
    this.triggerInnerEffect();
    this.renderActions();
  },

  updateHUD() {
    const e = G.enemy;
    if (!e) return;

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
    
    if (p.loadout?.inner[0]) {
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
      String(e.innerArt.innerEffect).split('|').forEach(eff => {
        const [key, val] = eff.split(':');
        const num = Number(val);
        if (key === 'regen' && e.hp < e.maxHp) { e.hp = Math.min(e.maxHp, e.hp + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 氣血。`, 'enemy'); }
        if (key === 'pos_regen' && e.pos < e.maxPos) { e.pos = Math.min(e.maxPos, e.pos + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 架勢。`, 'enemy'); }
        if (key === 'qi_regen' && e.qi < e.maxQi) { e.qi = Math.min(e.maxQi, e.qi + num); HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 內力。`, 'enemy'); }
      });
    }
    this.updateHUD();
  },

  startPlayerTurn() {
    const p = G.player, e = G.enemy;
    G.utilityUsedThisTurn = false; 
    
    // ★ 核心修正 1：玩家回合開始，扣除【玩家自己】身上的 Buff 回合數
    this.tickBuffs(p); 

    this.triggerInnerEffect();
    this.updateHUD();
    this.renderActions();
  },

  renderActions() {
    if (G.player.hp <= 0) return this.end(false);
    if (G.enemy.hp <= 0) return this.end(true);

    const p = G.player;
    
    const utilPanel = document.getElementById('utilityPanel');
    if (utilPanel) {
      utilPanel.innerHTML = '';
      const utilId = p.loadout?.utility[0];
      if (utilId) {
        const art = G.data.MARTIAL_ARTS[utilId];
        if (art) {
          const cost = art.qiCost || 2;
          const canUse = p.qi >= cost && !G.utilityUsedThisTurn;
          
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
                HUD.log('combat', '真氣不足，無法施展身法！', 'neutral');
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
      const hasEnoughQi = p.qi >= cost;
      const dmgDesc = art.fixedDamage ? `固定傷害 ${art.fixedDamage}` : `基礎傷害 ${Math.max(1, Math.floor(art.basePower / 10))}d${art.diceType || 8}`;
      
      actions.push({
        label: `✨ 施展【${art.name}】`,
        checkText: hasEnoughQi ? `消耗 ${cost} 真氣` : '真氣匱乏',
        desc: `威力大增，${dmgDesc}。`,
        primary: false,
        disabled: !hasEnoughQi,
        action: () => {
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

    if (p.companions && p.companions.length > 0 && !G.companionAttackUsed) {
      const compNames = p.companions.map(id => G.data.COMPANIONS[id]?.name).join(' / ');
      actions.push({
        label: `👥 同伴援助 · ${compNames}`,
        checkText: '每場限一次',
        desc: '由同伴出手策應，威力視等級而定。',
        primary: false,
        action: () => this.companionAttack()
      });
    }

    HUD.renderChoices(actions);
  },

    isImmune(target, debuffType) {
    if (target !== G.player) return false; // 目前設定為只有玩家的內功有免疫，敵人之後可擴充
    const innerId = G.player.loadout?.inner[0];
    if (!innerId) return false;
    const art = G.data.MARTIAL_ARTS[innerId];
    if (!art || !art.immune) return false;
    
    const immunities = String(art.immune).split('|').map(s => s.trim().toLowerCase());
    return immunities.includes(debuffType.toLowerCase());
  },

  applySpecialEffect(sourceName, effectsStr, attacker, target) {
    if (!effectsStr) return { isPierce: false };
    
    let isPierce = false;
    const stance = attacker === G.player ? 'player' : 'enemy';
    const targetName = attacker === G.player ? '敵方' : '你';
    
    if (!target.buffs) target.buffs = {};
    if (!attacker.buffs) attacker.buffs = {};

    // ★ 新增：吸取真氣 (drain_qi)
    const drainQiMatch = effectsStr.match(/drain_qi:(\d+)/);
    if (drainQiMatch) {
      const val = parseInt(drainQiMatch[1]);
      if (target.qi > 0) {
        const actualDrain = Math.min(target.qi, val);
        target.qi -= actualDrain;
        // 注意：不能超過自己真氣上限
        attacker.qi = Math.min(attacker.maxQi || 10, attacker.qi + actualDrain);
        HUD.log('combat', `【${sourceName}】吸取了${targetName} ${actualDrain} 點真氣！`, stance);
        this.updateHUD();
      } else {
        HUD.log('combat', `${targetName}已經真氣枯竭，無法吸取。`, 'neutral');
      }
    }

    // ★ 新增：直接扣除敵方真氣 (enemy_qi)
    const enemyQiMatch = effectsStr.match(/enemy_qi:(-?\d+)/);
    if (enemyQiMatch) {
      const val = parseInt(enemyQiMatch[1]);
      if (val < 0) {
        const actualDmg = Math.min(target.qi || 0, Math.abs(val));
        target.qi = Math.max(0, (target.qi || 0) - actualDmg);
        HUD.log('combat', `【${sourceName}】散去${targetName} ${actualDmg} 點真氣！`, stance);
        this.updateHUD();
      }
    }

    // ★ 新增：自己即時回復真氣 (self_qi)
    const selfQiMatch = effectsStr.match(/self_qi:(\d+)/);
    if (selfQiMatch) {
      const val = parseInt(selfQiMatch[1]);
      const actualHeal = Math.min(val, (attacker.maxQi || 10) - attacker.qi);
      if (actualHeal > 0) {
        attacker.qi += actualHeal;
        HUD.log('combat', `【${sourceName}】使你回復了 ${actualHeal} 點真氣！`, stance);
        this.updateHUD();
      }
    }

    if (effectsStr.includes('pierce')) { isPierce = true; HUD.log('combat', `【${sourceName}】無視護體，直擊經脈！`, stance); }
    if (effectsStr.includes('stun')) {
      if (this.isImmune(target, 'stun')) {
        HUD.log('combat', `【${sourceName}】試圖擊暈${targetName}，但被護體神功化解！`, 'neutral');
      } else {
        target.isStunned = true;
        HUD.log('combat', `【${sourceName}】使${targetName}陷入眩暈！`, stance); 
      }
    }    if (effectsStr.includes('heal')) { attacker.hp = Math.min(attacker.maxHp, attacker.hp + 15); HUD.log('combat', `【${sourceName}】真氣流轉，回復 15 點氣血！`, stance); }
    
    if (effectsStr.includes('poison')) {
      if (this.isImmune(target, 'poison')) {
        HUD.log('combat', `【${sourceName}】的劇毒被${targetName === '你' ? '你的' : '敵方的'}內功逼出體外！`, 'neutral');
      } else {
        let turns = 3, dmgPerTurn = 5;
        const match = effectsStr.match(/poison:(\d+):(\d+)/);
        if (match) { turns = parseInt(match[1]); dmgPerTurn = parseInt(match[2]); }
        target.isPoisoned = (target.isPoisoned || 0) + turns;
        target.poisonDamage = dmgPerTurn;
        HUD.log('combat', `【${sourceName}】使${targetName}中毒了！(無視架勢，每回合扣 ${dmgPerTurn} 血，持續 ${turns} 回合)`, stance);
      }
    }

    if (effectsStr.includes('shield')) {
      const match = effectsStr.match(/shield:(\d+):(\d+)/);
      if (match) { attacker.buffs.shield = { val: parseInt(match[1]), turns: parseInt(match[2]) }; HUD.log('combat', `【${sourceName}】凝聚罡氣，獲得 ${match[1]} 點固定減傷，持續 ${match[2]} 回合。`, stance); }
    }
    if (effectsStr.includes('shield_pct')) {
      const match = effectsStr.match(/shield_pct:([\d.]+):(\d+)/);
      if (match) { attacker.buffs.shieldPct = { val: parseFloat(match[1]), turns: parseInt(match[2]) }; HUD.log('combat', `【${sourceName}】護體大成，獲得 ${match[1] * 100}% 百分比減傷，持續 ${match[2]} 回合。`, stance); }
    }
    if (effectsStr.includes('reflect')) {
      const match = effectsStr.match(/reflect:([\d.]+):(\d+)/);
      if (match) { attacker.buffs.reflect = { val: parseFloat(match[1]), turns: parseInt(match[2]) }; HUD.log('combat', `【${sourceName}】周身氣勁鼓盪，獲得 ${match[1] * 100}% 反傷，持續 ${match[2]} 回合。`, stance); }
    }

    // ★ 移除隱藏加時，現在靠正確的 tick 時機來保證公平
    const selfAcMatch = effectsStr.match(/self_ac:(-?\d+):(\d+)/);
    if (selfAcMatch) {
      const val = parseInt(selfAcMatch[1]);
      const turns = parseInt(selfAcMatch[2]);
      
      if (!attacker.buffs.acMods) attacker.buffs.acMods = [];
      attacker.buffs.acMods = attacker.buffs.acMods.filter(m => m.source !== sourceName);
      attacker.buffs.acMods.push({ source: sourceName, val, turns });
      const sign = val > 0 ? '+' : '';
      HUD.log('combat', `【${sourceName}】使${attacker === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns} 回合。`, stance);
    }

    const enemyAcMatch = effectsStr.match(/enemy_ac:(-?\d+):(\d+)/);
    if (enemyAcMatch) {
      const val = parseInt(enemyAcMatch[1]);
      let turns = parseInt(enemyAcMatch[2]);
      if (val < 0) turns += 1;
      
      if (val < 0 && this.isImmune(target, 'ac_down')) {
        HUD.log('combat', `【${sourceName}】試圖壓制${targetName}的閃避，但毫無效果！`, 'neutral');
      } else {
        if (!target.buffs.acMods) target.buffs.acMods = [];
        target.buffs.acMods = target.buffs.acMods.filter(m => m.source !== sourceName);
        target.buffs.acMods.push({ source: sourceName, val, turns });
        const sign = val > 0 ? '+' : '';
        HUD.log('combat', `【${sourceName}】使${target === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns - (val < 0 ? 1 : 0)} 回合。`, stance);
      }
    }

    const legacyAcMatch = effectsStr.match(/(?<!_|self_|enemy_)ac:(-?\d+):(\d+)/);
    if (legacyAcMatch && !selfAcMatch && !enemyAcMatch) {
      const val = parseInt(legacyAcMatch[1]);
      const turns = parseInt(legacyAcMatch[2]);
      
      const receiver = val > 0 ? attacker : target;
      if (!receiver.buffs.acMods) receiver.buffs.acMods = [];
      receiver.buffs.acMods = receiver.buffs.acMods.filter(m => m.source !== sourceName);
      receiver.buffs.acMods.push({ source: sourceName, val, turns });
      const sign = val > 0 ? '+' : '';
      HUD.log('combat', `【${sourceName}】使${receiver === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns} 回合。`, stance);
    }
    
    return { isPierce };
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

  attack() {
    const p = G.player, e = G.enemy;
    const attr = 'str'; 
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: '普通攻擊', attr: attr, dc: this.getEffectiveAC(e), tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          const diceType = Number(p.punchDiceType) || 8;
          const roll = Math.floor(Math.random() * diceType) + 1;
          const dmg = (roll * (res.nat20 ? 2 : 1)) + mod;
          soundEngine.playBladeClash();
          this.dealDamage(e, dmg, res.nat20);
        } else {
          HUD.log('combat', '你的攻擊被敵方【閃避】！', 'enemy');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
        }
        this.updateHUD();
        setTimeout(() => this.enemyTurn(), 1000);
      }
    });
  },

  useArt(art) {
    const p = G.player, e = G.enemy;
    const cost = art.qiCost || 2;
    if (p.qi < cost) { HUD.log('combat', '真氣不足，無法施展絕學！', 'neutral'); return this.renderActions(); }
    p.qi -= cost; p.qi = Math.max(0, p.qi); HUD.updateGauges();

    let attr = art.useAttr || (art.type === '拳法' ? 'str' : 'dex');
    if (!p.stats[attr]) attr = 'dex'; 
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: `施展【${art.name}】`, attr: attr, dc: this.getEffectiveAC(e), tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          const hits = Number(art.hits) || 1;
          const diceCount = Math.max(1, Math.floor(art.basePower / 10)); 
          const diceType = Number(art.diceType) || 8; 
          const fixedDmg = Number(art.fixedDamage) || 0;
          
          soundEngine.playQiSurge();
          HUD.log('combat', `【${art.name}】命中！造成 ${hits} 段傷害！`, 'player');

          const { isPierce } = this.applySpecialEffect(art.name, art.specialEffect, p, e);

          for (let i = 0; i < hits; i++) {
            setTimeout(() => {
              let dmg = 0;
              if (fixedDmg > 0) { dmg = fixedDmg; }
              else {
                let totalRoll = 0;
                for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
                dmg = totalRoll + mod;
              }
              if (res.nat20) dmg *= 2; 
              
              if (isPierce) {
                e.hp = Math.max(0, e.hp - dmg);
                HUD.log('combat', `第 ${i+1} 段：造成 ${dmg} 點穿透真實傷害！`, 'player');
                HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${dmg}`, 'crit');
              } else {
                this.dealDamage(e, dmg, res.nat20, i + 1, hits);
              }
              this.updateHUD();
            }, i * 600);
          }
          setTimeout(() => { setTimeout(() => this.enemyTurn(), 1000); }, hits * 600);
        } else {
          HUD.log('combat', `【${art.name}】被敵方化解！`, 'enemy');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
          setTimeout(() => this.enemyTurn(), 1000);
        }
        this.updateHUD();
      }
    });
  },

  useUtility(art) {
    const p = G.player, e = G.enemy;
    const cost = art.qiCost || 2;
    
    if (p.qi < cost || G.utilityUsedThisTurn) return;
    
    p.qi -= cost;
    p.qi = Math.max(0, p.qi);
    G.utilityUsedThisTurn = true;
    HUD.updateGauges();
    soundEngine.playQiSurge();
    
    HUD.log('combat', `【${art.name}】施展！`, 'player');

    const { isPierce } = this.applySpecialEffect(art.name, art.specialEffect, p, e);
    
    if (art.fixedDamage) {
      e.hp = Math.max(0, e.hp - art.fixedDamage);
      HUD.log('combat', `造成 ${art.fixedDamage} 點傷害！`, 'player');
      HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${art.fixedDamage}`, 'normal');
    }
    
    this.updateHUD();
    if (e.hp <= 0) this.end(true);
    else this.renderActions();
  },

  parry() {
    G.player.pos = Math.min(G.player.maxPos, G.player.pos + 5);
    G.player.parrying = true; 
    HUD.log('combat', '你沉肩墜肘，擺出防禦架勢。架勢回復 5 點，若成功架開攻擊，將順勢反擊！', 'player');
    HUD.updateGauges();
    setTimeout(() => this.enemyTurn(), 1000);
  },

  companionAttack() {
    G.companionAttackUsed = true;
    const comps = G.player.companions.map(id => G.data.COMPANIONS[id]).filter(Boolean);
    const gradeOrder = { EX: 6, S: 5, A: 4, B: 3, C: 2, D: 1 };
    comps.sort((a, b) => (gradeOrder[b.grade] || 0) - (gradeOrder[a.grade] || 0));
    const c = comps[0];
    if (!c) return this.renderActions();

    const hitBonus = { EX: 8, S: 6, A: 5, B: 3, C: 2, D: 1 }[c.grade] || 1;
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + hitBonus;
    const targetAC = this.getEffectiveAC(G.enemy);
    HUD.log('combat', `同伴【${c.name}】出手！擲出 ${d20} + ${hitBonus} = ${total} vs 閃避 ${targetAC}`, 'neutral');
    
    if (total >= targetAC) {
      const { isPierce } = this.applySpecialEffect(c.name, c.attackEffect, G.player, G.enemy);
      if (isPierce) {
        G.enemy.hp = Math.max(0, G.enemy.hp - c.attackPower);
        HUD.log('combat', `【${c.name}】造成 ${c.attackPower} 點穿透真實傷害！`, 'player');
        HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${c.attackPower}`, 'crit');
      } else {
        this.dealDamage(G.enemy, c.attackPower);
      }
    } else {
      HUD.log('combat', '同伴的攻擊被閃避了！', 'enemy');
    }
    this.updateHUD();
    setTimeout(() => this.enemyTurn(), 1000);
  },

  enemyTurn() {
    const p = G.player, e = G.enemy;
    if (e.hp <= 0) return this.end(true);

    // ★ 核心修正 2：敵人回合開始，扣除【敵人自己】身上的 Buff 回合數
    this.tickBuffs(e); 

    if (p.isPoisoned > 0) {
      const pDmg = p.poisonDamage || 5;
      p.hp = Math.max(0, p.hp - pDmg);
      HUD.log('combat', `你劇毒發作！無視架勢，直接受到 ${pDmg} 點真實傷害！`, 'enemy');
      HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${pDmg}`, 'normal');
      p.isPoisoned--;
      this.updateHUD();
      if (p.hp <= 0) return this.end(false);
    }

    if (e.isPoisoned > 0) {
      const pDmg = e.poisonDamage || 5;
      e.hp = Math.max(0, e.hp - pDmg);
      HUD.log('combat', `敵方劇毒發作！無視架勢，直接受到 ${pDmg} 點真實傷害！`, 'player');
      HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${pDmg}`, 'normal');
      e.isPoisoned--;
      this.updateHUD();
      if (e.hp <= 0) return this.end(true);
    }

    if (e.isStunned) {
      e.isStunned = false;
      HUD.log('combat', '敵方處於眩暈，無法行動！', 'player');
      this.updateHUD();
      p.parrying = false; 
      return this.startPlayerTurn();
    }

    let usedArt = null;
    if (e.arts && e.arts.length > 0 && Math.random() > 0.4) { 
      const affordableArts = e.arts.filter(id => {
        const art = G.data.MARTIAL_ARTS[id];
        return art && e.qi >= (Number(art.qiCost) || 2);
      });
      if (affordableArts.length > 0) {
        const randomArtId = affordableArts[Math.floor(Math.random() * affordableArts.length)];
        usedArt = G.data.MARTIAL_ARTS[randomArtId];
      }
    }

    if (usedArt) {
      const cost = Number(usedArt.qiCost) || 2;
      e.qi = Math.max(0, e.qi - cost); 
      
      const eAtk = 4; 
      const targetAC = this.getEffectiveAC(p); 
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + eAtk;
      
      HUD.log('combat', `敵方施展【${usedArt.name}】！擲出 ${d20} + ${eAtk} = ${total} vs 你的閃避 ${targetAC}`, 'neutral');

      if (total >= targetAC) {
        const hits = Number(usedArt.hits) || 1;
        const diceCount = Math.max(1, Math.floor(usedArt.basePower / 10));
        const diceType = Number(usedArt.diceType) || 8;
        const fixedDmg = Number(usedArt.fixedDamage) || 0;
        
        HUD.log('combat', `【${usedArt.name}】命中！造成 ${hits} 段傷害！`, 'enemy');
        const { isPierce } = this.applySpecialEffect(usedArt.name, usedArt.specialEffect, e, p);
        
        for (let i = 0; i < hits; i++) {
          setTimeout(() => {
            let dmg = 0;
            if (fixedDmg > 0) { dmg = fixedDmg; }
            else {
              let totalRoll = 0;
              for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
              dmg = totalRoll + Math.floor(eAtk / 2);
            }
            if (d20 === 20) dmg *= 2;

            const prevPos = p.pos; 
            if (isPierce) {
              p.hp = Math.max(0, p.hp - dmg);
              HUD.log('combat', `第 ${i+1} 段：敵方無視護體，造成 ${dmg} 點穿透真實傷害！`, 'enemy');
              HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${dmg}`, 'crit');
            } else {
              this.dealDamage(p, dmg, d20 === 20, i + 1, hits);
              
              if (p.parrying && p.pos > 0 && prevPos > 0) {
                this.triggerParryCounter(e);
              }
            }
            this.updateHUD();
          }, i * 600);
        }
        setTimeout(() => {
          p.parrying = false; 
          this.updateHUD();
          if (p.hp <= 0) this.end(false);
          else this.startPlayerTurn();
        }, hits * 600 + 500); 
        return; 
      } else {
        HUD.log('combat', `你成功閃避了敵方的【${usedArt.name}】！`, 'player');
        HUD.floatDamage(document.getElementById('hudHpCur').parentElement, '閃避', 'dodge');
      }
    } else {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const eAtk = 4; 
      const targetAC = this.getEffectiveAC(p); 
      const total = d20 + eAtk;

      HUD.log('combat', `敵方普通攻擊！擲出 ${d20} + ${eAtk} = ${total} vs 你的閃避 ${targetAC}`, 'neutral');

      if (total >= targetAC) {
        let dmg = Math.floor(Math.random() * 10) + 4;
        const isCrit = d20 === 20;
        if (isCrit) dmg *= 2;
        
        HUD.log('combat', isCrit ? '敵方發動【暴擊】命中！' : '敵方招式擊中你！', 'enemy');
        
        const prevPos = p.pos;
        this.dealDamage(p, dmg, isCrit);

        if (p.parrying && p.pos > 0 && prevPos > 0) {
          this.triggerParryCounter(e);
        }
      } else {
        HUD.log('combat', '你身法輕盈，成功【閃避】了敵方的攻擊！', 'player');
        HUD.floatDamage(document.getElementById('hudHpCur').parentElement, '閃避', 'dodge');
      }
    }

    p.parrying = false; 
    this.updateHUD(); 
    if (p.hp <= 0) { this.end(false); }
    else { this.startPlayerTurn(); }
  },

  meditate() {
    const p = G.player;
    p.qi = Math.min(p.maxQi, p.qi + 3);
    p.pos = Math.min(p.maxPos, p.pos + 2); 
    
    soundEngine.playQiSurge();
    HUD.log('combat', '你退後半步，雙目微閉，運轉真氣。回復 3 點真氣與 2 點架勢。', 'player');
    HUD.updateGauges();
    
    setTimeout(() => this.enemyTurn(), 1000);
  },

  tickBuffs(target) {
    if (!target.buffs) return;
    Object.keys(target.buffs).forEach(k => {
      if (k === 'acMods') {
        target.buffs.acMods.forEach(mod => mod.turns--);
        target.buffs.acMods = target.buffs.acMods.filter(mod => mod.turns > 0);
      } else if (target.buffs[k] && typeof target.buffs[k] === 'object') {
        if (target.buffs[k].turns > 0) target.buffs[k].turns--;
        if (target.buffs[k].turns <= 0) delete target.buffs[k];
      }
    });
  },

  end(win) {
    document.getElementById('enemyHud').classList.add('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden'); 
    HUD.clearChoices(); // ★ 新增：立刻清空下方的按鈕，防止死後還能點
    
    const ev = G.currentCombatEvent;
    
    if (win) {
      soundEngine.playGong();
      HUD.log('narrative', `【戰勝】你擊敗了 ${G.enemy.name}！`);
      if (ev.onVictory) EventSystem.load(ev.onVictory);
      else ExplorationSystem.endEvent();
    } else {
      HUD.log('combat', '眼前一黑，你倒在了血泊之中……', 'enemy');
      if (ev.onDefeat) EventSystem.load(ev.onDefeat);
      else switchSystem('ending', { id: 'defeat' });
    }
    G.currentCombatEvent = null;
  }
};
Systems.combat = CombatSystem;