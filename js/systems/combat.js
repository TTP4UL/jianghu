const CombatSystem = {

    _effectHandlers: {
    pierce: function(ctx) { 
      ctx.isPierce = true; 
      HUD.log('combat', `【${ctx.sourceName}】無視護體，直擊經脈！`, ctx.stance); 
    },
    
    stun: function(ctx) {
      if (this.isImmune(ctx.target, 'stun')) {
        HUD.log('combat', `【${ctx.sourceName}】試圖擊暈${ctx.targetName}，但被護體神功化解！`, 'neutral');
      } else {
        ctx.target.isStunned = true;
        HUD.log('combat', `【${ctx.sourceName}】使${ctx.targetName}陷入眩暈！`, ctx.stance); 
      }
    },
    
    heal: function(ctx) {
      ctx.attacker.hp = Math.min(ctx.attacker.maxHp, ctx.attacker.hp + 15);
      HUD.log('combat', `【${ctx.sourceName}】真氣流轉，回復 15 點氣血！`, ctx.stance);
    },
    
    poison: function(ctx) {
      if (this.isImmune(ctx.target, 'poison')) {
        HUD.log('combat', `【${ctx.sourceName}】的劇毒被${ctx.targetName === '你' ? '你的' : '敵方的'}內功逼出體外！`, 'neutral');
        return;
      }
      const turns = ctx.args[0] ? parseInt(ctx.args[0]) : 3;
      const dmgPerTurn = ctx.args[1] ? parseInt(ctx.args[1]) : 5;
      ctx.target.isPoisoned = (ctx.target.isPoisoned || 0) + turns;
      ctx.target.poisonDamage = dmgPerTurn;
      HUD.log('combat', `【${ctx.sourceName}】使${ctx.targetName}中毒了！(無視架勢，每回合扣 ${dmgPerTurn} 血，持續 ${turns} 回合)`, ctx.stance);
    },
    
    shield: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      const turns = parseInt(ctx.args[1]) || 1;
      ctx.attacker.buffs.shield = { val, turns };
      HUD.log('combat', `【${ctx.sourceName}】凝聚罡氣，獲得 ${val} 點固定減傷，持續 ${turns} 回合。`, ctx.stance);
    },
    
    shield_pct: function(ctx) {
      const val = parseFloat(ctx.args[0]) || 0;
      const turns = parseInt(ctx.args[1]) || 1;
      ctx.attacker.buffs.shieldPct = { val, turns };
      HUD.log('combat', `【${ctx.sourceName}】護體大成，獲得 ${val * 100}% 百分比減傷，持續 ${turns} 回合。`, ctx.stance);
    },
    
    reflect: function(ctx) {
      const val = parseFloat(ctx.args[0]) || 0;
      const turns = parseInt(ctx.args[1]) || 1;
      ctx.attacker.buffs.reflect = { val, turns };
      HUD.log('combat', `【${ctx.sourceName}】周身氣勁鼓盪，獲得 ${val * 100}% 反傷，持續 ${turns} 回合。`, ctx.stance);
    },
    
    drain_qi: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      if (ctx.target.qi > 0) {
        const actualDrain = Math.min(ctx.target.qi, val);
        ctx.target.qi -= actualDrain;
        ctx.attacker.qi = Math.min(ctx.attacker.maxQi || 10, ctx.attacker.qi + actualDrain);
        HUD.log('combat', `【${ctx.sourceName}】吸取了${ctx.targetName} ${actualDrain} 點真氣！`, ctx.stance);
        this.updateHUD();
      } else {
        HUD.log('combat', `${ctx.targetName}已經真氣枯竭，無法吸取。`, 'neutral');
      }
    },
    
    enemy_qi: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      if (val < 0) {
        const actualDmg = Math.min(ctx.target.qi || 0, Math.abs(val));
        ctx.target.qi = Math.max(0, (ctx.target.qi || 0) - actualDmg);
        HUD.log('combat', `【${ctx.sourceName}】散去${ctx.targetName} ${actualDmg} 點真氣！`, ctx.stance);
        this.updateHUD();
      }
    },
    
    self_qi: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      const actualHeal = Math.min(val, (ctx.attacker.maxQi || 10) - ctx.attacker.qi);
      if (actualHeal > 0) {
        ctx.attacker.qi += actualHeal;
        HUD.log('combat', `【${ctx.sourceName}】使你回復了 ${actualHeal} 點真氣！`, ctx.stance);
        this.updateHUD();
      }
    },

    self_ac: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      const turns = parseInt(ctx.args[1]) || 1;
      if (!ctx.attacker.buffs.acMods) ctx.attacker.buffs.acMods = [];
      ctx.attacker.buffs.acMods = ctx.attacker.buffs.acMods.filter(m => m.source !== ctx.sourceName);
      ctx.attacker.buffs.acMods.push({ source: ctx.sourceName, val, turns });
      const sign = val > 0 ? '+' : '';
      HUD.log('combat', `【${ctx.sourceName}】使${ctx.attacker === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns} 回合。`, ctx.stance);
    },

    enemy_ac: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      let turns = parseInt(ctx.args[1]) || 1;
      if (val < 0) turns += 1;
      
      if (val < 0 && this.isImmune(ctx.target, 'ac_down')) {
        HUD.log('combat', `【${ctx.sourceName}】試圖壓制${ctx.targetName}的閃避，但毫無效果！`, 'neutral');
      } else {
        if (!ctx.target.buffs.acMods) ctx.target.buffs.acMods = [];
        ctx.target.buffs.acMods = ctx.target.buffs.acMods.filter(m => m.source !== ctx.sourceName);
        ctx.target.buffs.acMods.push({ source: ctx.sourceName, val, turns });
        const sign = val > 0 ? '+' : '';
        HUD.log('combat', `【${ctx.sourceName}】使${ctx.target === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns - (val < 0 ? 1 : 0)} 回合。`, ctx.stance);
      }
    },

    // 兼容舊版 ac（當沒有 self_ac 或 enemy_ac 時）
    ac: function(ctx) {
      const val = parseInt(ctx.args[0]) || 0;
      const turns = parseInt(ctx.args[1]) || 1;
      const receiver = val > 0 ? ctx.attacker : ctx.target;
      if (!receiver.buffs.acMods) receiver.buffs.acMods = [];
      receiver.buffs.acMods = receiver.buffs.acMods.filter(m => m.source !== ctx.sourceName);
      receiver.buffs.acMods.push({ source: ctx.sourceName, val, turns });
      const sign = val > 0 ? '+' : '';
      HUD.log('combat', `【${ctx.sourceName}】使${receiver === G.player ? '你' : '敵方'}的閃避 ${sign}${val}，持續 ${turns} 回合。`, ctx.stance);
    }
  },

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
    
    G.companionAttackUsed = false; 
    G.utilityUsedThisTurn = false; 
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
    // 1. 取得目標嘅內功（玩家讀 loadout，敵人讀 innerArt）
    let innerArt = null;
    if (target === G.player) {
      const innerId = G.player.loadout?.inner[0];
      if (innerId) innerArt = G.data.MARTIAL_ARTS[innerId];
    } else if (G.enemy && G.enemy.innerArt) {
      innerArt = G.enemy.innerArt;
    }
    if (!innerArt) return false;

    const debuff = debuffType.toLowerCase();
    const allImmunities = [];

    // 2. 獨立 immune 欄位（例：immune: "poison" 或 "poison|stun"）
    if (innerArt.immune) {
      String(innerArt.immune).split('|').forEach(s => {
        const v = s.trim().toLowerCase();
        if (v) allImmunities.push(v);
      });
    }

    // 3. innerEffect 中的 immune（例：qi_regen:2|immune:poison|stun）
    //    注意：immune:poison|stun 經 | 分割後會變成 ["immune:poison", "stun"]
    //    所以要收集「immune: 之後」以及「緊接住嘅無冒號 token」
    if (innerArt.innerEffect) {
      const parts = String(innerArt.innerEffect).split('|').map(s => s.trim());
      let collecting = false;
      for (const p of parts) {
        if (p.startsWith('immune:')) {
          allImmunities.push(p.substring(7).toLowerCase());
          collecting = true;
        } else if (collecting && !p.includes(':')) {
          allImmunities.push(p.toLowerCase());
        } else {
          collecting = false;
        }
      }
    }

    return allImmunities.includes(debuff);
  },

  applySpecialEffect(sourceName, effectsStr, attacker, target) {
    if (!effectsStr) return { isPierce: false };
    
    let isPierce = false;
    const stance = attacker === G.player ? 'player' : 'enemy';
    const targetName = attacker === G.player ? '敵方' : '你';
    
    if (!target.buffs) target.buffs = {};
    if (!attacker.buffs) attacker.buffs = {};

    // ★ 核心重構：遍歷效果字串，分發比對應嘅 Handler
    String(effectsStr).split('|').forEach(eff => {
      const parts = eff.trim().split(':');
      const key = parts[0].toLowerCase();
      const args = parts.slice(1); // 取得冒號後面嘅所有參數

      // 建立上下文 (Context)
      const ctx = { sourceName, target, attacker, targetName, stance, args,};

      if (this._effectHandlers[key]) {
        // 呼叫對應嘅特效處理器，並將 this 綁定返 CombatSystem
        this._effectHandlers[key].call(this, ctx);
        
        // 如果 Handler 入面將 isPierce 改咗做 true，我哋要同步返出嚟
        if (ctx.isPierce) isPierce = true;
      } else {
        console.warn(`[Combat] 未識別的特效: ${key}`);
      }
    });
    
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

let attr = art.useAttr;
if (!attr || !p.stats[attr]) attr = 'str'; 
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
              if (fixedDmg > 0) { 
                dmg = fixedDmg * (res.nat20 ? 2 : 1);  // 固定傷害都翻倍（因為冇骰子可翻）
              }
              else {
                let totalRoll = 0;
                for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
                dmg = (totalRoll * (res.nat20 ? 2 : 1)) + mod;  // 只翻倍骰子，修正唔翻倍
              }
              
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
      if (isPierce) {
        e.hp = Math.max(0, e.hp - art.fixedDamage);
        HUD.log('combat', `造成 ${art.fixedDamage} 點穿透真實傷害！`, 'player');
        HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${art.fixedDamage}`, 'crit');
      } else {
        this.dealDamage(e, art.fixedDamage);
      }
    }
    
    this.updateHUD();
    if (e.hp <= 0) this.end(true);
    else this.renderActions();
  },

  parry() {
    G.player.pos = Math.min(G.player.maxPos, G.player.pos + 5);
    G.player.parrying = true; 
    HUD.log('combat', T('parry', { pos: 5 }), 'player');
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
      HUD.log('combat', T('poison_player', { dmg: pDmg }), 'enemy');
      HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${pDmg}`, 'normal');
      p.isPoisoned--;
      this.updateHUD();
      if (p.hp <= 0) return this.end(false);
    }

    if (e.isPoisoned > 0) {
      const pDmg = e.poisonDamage || 5;
      e.hp = Math.max(0, e.hp - pDmg);
      HUD.log('combat', T('poison_enemy', { dmg: pDmg }), 'player');
      HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${pDmg}`, 'normal');
      e.isPoisoned--;
      this.updateHUD();
      if (e.hp <= 0) return this.end(true);
    }

    if (e.isStunned) {
      e.isStunned = false;
      HUD.log('combat', T('enemy_stunned'), 'player');
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
      
      const eAtk = Number(e.atk) || 4;
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
            if (fixedDmg > 0) { 
              dmg = fixedDmg * (d20 === 20 ? 2 : 1);
            }
            else {
              let totalRoll = 0;
              for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
              dmg = (totalRoll * (d20 === 20 ? 2 : 1)) + Math.floor(eAtk / 2);
            }

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
      const eAtk = Number(e.atk) || 4;
      const targetAC = this.getEffectiveAC(p); 
      const total = d20 + eAtk;

      HUD.log('combat', `敵方普通攻擊！擲出 ${d20} + ${eAtk} = ${total} vs 你的閃避 ${targetAC}`, 'neutral');

      if (total >= targetAC) {
        let dmg = Math.floor(Math.random() * 10) + 4;
        const isCrit = d20 === 20;
        if (isCrit) dmg = (Math.floor(Math.random() * 10) * 2) + 4; 
        
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
    HUD.log('combat', T('meditate', { qi: 3, pos: 2 }), 'player');
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
Systems.combat = CombatSystem;