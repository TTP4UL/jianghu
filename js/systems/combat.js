const CombatSystem = {
  enter(payload) {
    const ev = payload.event;
    G.currentCombatEvent = ev;
    G.enemy = { ...ev.enemy }; 
    G.enemy.arts = ev.enemyArts ? String(ev.enemyArts).split('|').map(s => s.trim()) : [];
    
    // ★ 新增：讀取敵人的內功
    if (ev.enemyInner && G.data.MARTIAL_ARTS[ev.enemyInner]) {
      G.enemy.innerArt = G.data.MARTIAL_ARTS[ev.enemyInner];
    }
    // ★ 新增：初始化敵人真氣（預設 10）
    G.enemy.maxQi = Number(ev.enemyQi) || 10;
    G.enemy.qi = G.enemy.maxQi;
    
    G.companionAttackUsed = false; 
    document.getElementById('loadoutBtn').classList.add('hidden'); 
    document.getElementById('enemyHud').classList.remove('hidden');
    
    HUD.setScene(ev.badge || '戰鬥', ev.title || '遭遇強敵');
    this.updateHUD();
    this.triggerInnerEffect(); // 戰鬥開場先觸發一次內功
    this.renderActions();
  },

  updateHUD() {
    const e = G.enemy;
    document.getElementById('enemyName').textContent = e.name;
    document.getElementById('enemyAC').textContent = e.ac;
    
    // 氣血
    document.getElementById('enemyHpText').textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
    document.getElementById('enemyHpBar').style.width = `${Math.min(100, Math.max(0, (e.hp / e.maxHp) * 100))}%`;
    
    // 架勢
    document.getElementById('enemyPosText').textContent = `${Math.max(0, e.pos)} / ${e.maxPos}`;
    document.getElementById('enemyPosBar').style.width = `${Math.min(100, Math.max(0, (e.pos / e.maxPos) * 100))}%`;
    
    // ★ 狀態 Buff 標籤徽章化（分行美化，絕不爆行）
    const statusTags = [];
    if (e.isStunned) {
      statusTags.push(`<span class="px-1.5 py-0.5 rounded bg-[#fef08a] text-[#854d0e] border border-[#fde047] text-[10px] font-bold animate-pulse">【眩暈】</span>`);
    }
    if (e.isPoisoned > 0) {
      statusTags.push(`<span class="px-1.5 py-0.5 rounded bg-[#f3e8ff] text-[#7e22ce] border border-[#d8b4fe] text-[10px] font-bold animate-pulse">【劇毒:${e.isPoisoned}回合】</span>`);
    }
    if (e.innerArt) {
      statusTags.push(`<span class="px-1.5 py-0.5 rounded bg-[#faf5ff] text-[#7e22ce] border border-[#e9d5ff] text-[10px] font-bold">心法:${e.innerArt.name}</span>`);
    }
    if (e.maxQi !== undefined) {
      statusTags.push(`<span class="px-1.5 py-0.5 rounded bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-[10px] font-mono font-bold">真氣:${e.qi}/${e.maxQi}</span>`);
    }
    
    const tagContainer = document.getElementById('enemyStatusTag');
    if (tagContainer) {
      tagContainer.className = 'flex flex-wrap gap-1 mt-1';
      tagContainer.innerHTML = statusTags.join('');
    }
    
    HUD.updateGauges();
  },

  triggerInnerEffect() {
    const p = G.player;
    const innerId = p.loadout?.inner[0];
    
    // 1. 玩家內功結算
    if (innerId) {
      const art = G.data.MARTIAL_ARTS[innerId];
      if (art && art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const num = Number(val);
          
          if (key === 'regen' && p.hp < p.maxHp) { p.hp = Math.min(p.maxHp, p.hp + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 氣血。`, 'player'); }
          if (key === 'hp_regen' && p.hp < p.maxHp) { p.hp = Math.min(p.maxHp, p.hp + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 氣血。`, 'player'); }
          if (key === 'qi_regen' && p.qi < p.maxQi) { p.qi = Math.min(p.maxQi, p.qi + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 真氣。`, 'player'); }
          if (key === 'pos_regen' && p.pos < p.maxPos) { p.pos = Math.min(p.maxPos, p.pos + num); HUD.log('combat', `【你的${art.name}】運轉，回復 ${num} 架勢。`, 'player'); }
        });
      }
    }

    // ★ 2. 敵人內功與真氣結算
    const e = G.enemy;
    if (e.innerArt && e.innerArt.innerEffect) {
      String(e.innerArt.innerEffect).split('|').forEach(eff => {
        const [key, val] = eff.split(':');
        const num = Number(val);
        
        if (key === 'regen' && e.hp < e.maxHp) {
          e.hp = Math.min(e.maxHp, e.hp + num);
          HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 氣血。`, 'enemy');
        }
        if (key === 'pos_regen' && e.pos < e.maxPos) {
          e.pos = Math.min(e.maxPos, e.pos + num);
          HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 架勢。`, 'enemy');
        }
        if (key === 'qi_regen' && e.qi < e.maxQi) {
          e.qi = Math.min(e.maxQi, e.qi + num);
          HUD.log('combat', `【敵方${e.innerArt.name}】運轉，回復 ${num} 真氣。`, 'enemy');
        }
      });
    }
    
    // ★ 敵人基礎真氣回復（每回合回 1 點，防止後期變啞巴）
    if (!e.innerArt || !String(e.innerArt.innerEffect).includes('qi_regen')) {
      e.qi = Math.min(e.maxQi, (e.qi || 0) + 1);
    }
    
    this.updateHUD();
  },

  renderActions() {
    if (G.player.hp <= 0) return this.end(false);
    if (G.enemy.hp <= 0) return this.end(true);

    const actions = [];
    const p = G.player;

    actions.push({
      label: '⚔️ 普通攻擊',
      checkText: `命中 vs AC ${G.enemy.ac}`,
      desc: `1d${Number(p.punchDiceType) || 8} + 屬性調整，不消耗真氣。`,
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
      desc: '本回合受擊傷害減少，並回復 5 點架勢與化解破防。',
      primary: false,
      action: () => this.parry()
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

  applySpecialEffect(sourceName, effectsStr, attacker, target) {
    if (!effectsStr) return { isPierce: false };
    
    let isPierce = false;
    const stance = attacker === G.player ? 'player' : 'enemy';
    const targetName = attacker === G.player ? '敵方' : '你';
    
    if (!target.buffs) target.buffs = {};
    if (!attacker.buffs) attacker.buffs = {};

    if (effectsStr.includes('pierce')) {
      isPierce = true;
      HUD.log('combat', `【${sourceName}】無視護體，直擊經脈！`, stance);
    }
    if (effectsStr.includes('stun')) {
      target.isStunned = true;
      HUD.log('combat', `【${sourceName}】使${targetName}陷入眩暈！`, stance); 
    }
    if (effectsStr.includes('heal')) {
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + 15);
      HUD.log('combat', `【${sourceName}】真氣流轉，回復 15 點氣血！`, stance);
    }
    
    if (effectsStr.includes('poison')) {
      let turns = 3;
      let dmgPerTurn = 5;
      const match = effectsStr.match(/poison:(\d+):(\d+)/);
      if (match) {
        turns = parseInt(match[1]);
        dmgPerTurn = parseInt(match[2]);
      }
      target.isPoisoned = (target.isPoisoned || 0) + turns;
      target.poisonDamage = dmgPerTurn;
      HUD.log('combat', `【${sourceName}】使${targetName}中毒了！(無視架勢，每回合扣 ${dmgPerTurn} 血，持續 ${turns} 回合)`, stance);
    }

    if (effectsStr.includes('shield')) {
      const match = effectsStr.match(/shield:(\d+):(\d+)/);
      if (match) {
        attacker.buffs.shield = { val: parseInt(match[1]), turns: parseInt(match[2]) };
        HUD.log('combat', `【${sourceName}】凝聚罡氣，獲得 ${match[1]} 點固定減傷，持續 ${match[2]} 回合。`, stance);
      }
    }
    if (effectsStr.includes('shield_pct')) {
      const match = effectsStr.match(/shield_pct:([\d.]+):(\d+)/);
      if (match) {
        attacker.buffs.shieldPct = { val: parseFloat(match[1]), turns: parseInt(match[2]) };
        HUD.log('combat', `【${sourceName}】護體大成，獲得 ${match[1] * 100}% 百分比減傷，持續 ${match[2]} 回合。`, stance);
      }
    }
    if (effectsStr.includes('reflect')) {
      const match = effectsStr.match(/reflect:([\d.]+):(\d+)/);
      if (match) {
        attacker.buffs.reflect = { val: parseFloat(match[1]), turns: parseInt(match[2]) };
        HUD.log('combat', `【${sourceName}】周身氣勁鼓盪，獲得 ${match[1] * 100}% 反傷，持續 ${match[2]} 回合。`, stance);
      }
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
      HUD.floatDamage(
        isPlayer ? document.getElementById('enemyHpText').parentElement : document.getElementById('hudHpCur').parentElement, 
        `-${reflectDmg}`, 'crit'
      );
      this.updateHUD(); 
    }

    let finalIncomingDmg = dmg;
    if (target.buffs.shieldPct && target.buffs.shieldPct.turns > 0) {
      finalIncomingDmg = Math.floor(finalIncomingDmg * (1 - target.buffs.shieldPct.val));
    }
    if (target.buffs.shield && target.buffs.shield.turns > 0) {
      finalIncomingDmg = Math.max(1, finalIncomingDmg - target.buffs.shield.val);
    }

    if (target.pos > 0) {
      target.pos -= finalIncomingDmg;
      
      if (target.pos <= 0) {
        target.pos = 0;
        HUD.triggerBreakEffect(isPlayer);
        const breakText = isPlayer ? '你的護體架勢被打崩！破綻大露！' : '敵方招架不及！破綻盡現！';
        HUD.log('combat', `${hitStr}【破防】${breakText}`, stance);
        HUD.floatDamage(targetEl, '破防！', 'crit');
      } else {
        const blockStance = isPlayer ? 'enemy' : 'player'; 
        const blockText = isPlayer ? '你消耗架勢化解了攻勢' : '敵方消耗架勢抵擋了傷害';
        HUD.log('combat', `${hitStr}${blockText} (-${finalIncomingDmg} 架勢)。`, blockStance);
        HUD.floatDamage(targetEl, `-${finalIncomingDmg}`, 'dodge');
      }
      return;
    }

    const realDmg = Math.floor(finalIncomingDmg * 1.5);
    target.hp = Math.max(0, target.hp - realDmg);
    const dmgText = isPlayer ? '你受到' : '敵方受到';
    
    HUD.log('combat', `${hitStr}【真實傷害】${dmgText} ${realDmg} 點重創！`, stance);
    HUD.floatDamage(targetEl, `-${realDmg}`, isCrit ? 'crit' : 'normal');
    
    if (isCrit || (isPlayer && realDmg >= 15)) {
      HUD.shakeScreen();
    }
  },

  attack() {
    const p = G.player, e = G.enemy;
    const attr = 'str'; 
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: '普通攻擊', attr: attr, dc: e.ac, tags: p.tags,
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
    
    if (p.qi < cost) {
      HUD.log('combat', '真氣不足，無法施展絕學！', 'neutral');
      return this.renderActions();
    }
    p.qi -= cost;
    p.qi = Math.max(0, p.qi);
    HUD.updateGauges();

    let attr = art.useAttr;
    if (!attr) {
      attr = art.type === '拳法' ? 'str' : 'dex';
    }
    if (!p.stats[attr]) attr = 'dex'; 

    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: `施展【${art.name}】`, attr: attr, dc: e.ac, tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          const hits = Number(art.hits) || 1;
          const diceCount = Math.max(1, Math.floor(art.basePower / 10)); 
          const diceType = Number(art.diceType) || 8; 
          const fixedDmg = Number(art.fixedDamage) || 0;
          
          soundEngine.playQiSurge();
          
          if (fixedDmg > 0) {
            HUD.log('combat', `【${art.name}】命中！施展固定傷害 ${fixedDmg} 點，共 ${hits} 段！`, 'player');
          } else {
            HUD.log('combat', `【${art.name}】命中！造成 ${hits} 段傷害！`, 'player');
          }

          const { isPierce } = this.applySpecialEffect(art.name, art.specialEffect, p, e);

          for (let i = 0; i < hits; i++) {
            setTimeout(() => {
              let dmg = 0;
              if (fixedDmg > 0) {
                dmg = fixedDmg;
              } else {
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

          setTimeout(() => {
            setTimeout(() => this.enemyTurn(), 1000);
          }, hits * 600);

        } else {
          HUD.log('combat', `【${art.name}】被敵方化解！`, 'enemy');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
          setTimeout(() => this.enemyTurn(), 1000);
        }
        
        this.updateHUD();
      }
    });
  },

  parry() {
    G.player.pos = Math.min(G.player.maxPos, G.player.pos + 5);
    G.player.parrying = true; 
    HUD.log('combat', '你擺出防禦架勢，架勢回復。', 'player');
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
    
    HUD.log('combat', `同伴【${c.name}】出手！擲出 ${d20} + ${hitBonus} = ${total} vs AC ${G.enemy.ac}`, 'neutral');
    
    if (total >= G.enemy.ac) {
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
      return this.renderActions();
    }

    let usedArt = null;
    if (e.arts && e.arts.length > 0 && Math.random() > 0.4) { 
      // ★ 核心：過濾出敵人真氣足夠施放的技能
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
      e.qi = Math.max(0, e.qi - cost); // ★ 扣除真氣
      
      const eAtk = 4; 
      const targetAC = p.ac + (p.parrying ? 4 : 0); 
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + eAtk;
      
      HUD.log('combat', `敵方施展【${usedArt.name}】！擲出 ${d20} + ${eAtk} = ${total} vs 你的 AC ${targetAC}`, 'neutral');

      if (total >= targetAC) {
        const hits = Number(usedArt.hits) || 1;
        const diceCount = Math.max(1, Math.floor(usedArt.basePower / 10));
        const diceType = Number(usedArt.diceType) || 8;
        const fixedDmg = Number(usedArt.fixedDamage) || 0;
        
        if (fixedDmg > 0) {
           HUD.log('combat', `【${usedArt.name}】命中！施展固定傷害 ${fixedDmg} 點，共 ${hits} 段！`, 'enemy');
        } else {
           HUD.log('combat', `【${usedArt.name}】命中！造成 ${hits} 段傷害！`, 'enemy');
        }
        
        const { isPierce } = this.applySpecialEffect(usedArt.name, usedArt.specialEffect, e, p);
        
        for (let i = 0; i < hits; i++) {
          setTimeout(() => {
            let dmg = 0;
            if (fixedDmg > 0) {
              dmg = fixedDmg;
            } else {
              let totalRoll = 0;
              for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
              dmg = totalRoll + Math.floor(eAtk / 2);
            }
            if (d20 === 20) dmg *= 2;

            if (isPierce) {
              p.hp = Math.max(0, p.hp - dmg);
              HUD.log('combat', `第 ${i+1} 段：敵方無視護體，造成 ${dmg} 點穿透真實傷害！`, 'enemy');
              HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${dmg}`, 'crit');
            } else {
              this.dealDamage(p, dmg, d20 === 20, i + 1, hits);
            }
            this.updateHUD();
          }, i * 600);
        }

        setTimeout(() => {
          p.parrying = false; 
          this.updateHUD();
          if (p.hp <= 0) this.end(false);
          else {
            this.processBuffs(); // ★ 敵人打完結算 Buff
            this.triggerInnerEffect(); 
            this.renderActions();
          }
        }, hits * 600 + 500); 

        return; 
      } else {
        HUD.log('combat', `你成功閃避了敵方的【${usedArt.name}】！`, 'player');
        HUD.floatDamage(document.getElementById('hudHpCur').parentElement, '閃避', 'dodge');
      }
    } else {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const eAtk = 4; 
      const targetAC = p.ac + (p.parrying ? 4 : 0); 
      const total = d20 + eAtk;

      HUD.log('combat', `敵方普通攻擊！擲出 ${d20} + ${eAtk} = ${total} vs 你的 AC ${targetAC}`, 'neutral');

      if (total >= targetAC) {
        let dmg = Math.floor(Math.random() * 10) + 4;
        const isCrit = d20 === 20;
        if (isCrit) dmg *= 2;
        
        HUD.log('combat', isCrit ? '敵方發動【暴擊】命中！' : '敵方招式擊中你！', 'enemy');
        this.dealDamage(p, dmg, isCrit);
      } else {
        HUD.log('combat', '你身法輕盈，成功【閃避】了敵方的攻擊！', 'player');
        HUD.floatDamage(document.getElementById('hudHpCur').parentElement, '閃避', 'dodge');
      }
    }

    p.parrying = false; 
    this.updateHUD(); 
    
    if (p.hp <= 0) {
      this.end(false);
    } else {
      this.processBuffs(); // ★ 統一結算 Buff 倒數
      this.triggerInnerEffect();
      this.renderActions();
    }
  },

  // ★ 新增：統一的 Buff 回合結算
  processBuffs() {
    const p = G.player, e = G.enemy;
    if (p.buffs) {
      Object.keys(p.buffs).forEach(k => {
        if (p.buffs[k].turns > 0) p.buffs[k].turns--;
        if (p.buffs[k].turns <= 0) delete p.buffs[k];
      });
    }
    if (e.buffs) {
      Object.keys(e.buffs).forEach(k => {
        if (e.buffs[k].turns > 0) e.buffs[k].turns--;
        if (e.buffs[k].turns <= 0) delete e.buffs[k];
      });
    }
  },

  end(win) {
    document.getElementById('enemyHud').classList.add('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden'); 
    const ev = G.currentCombatEvent;
    
    if (win) {
      soundEngine.playGong();
      HUD.log('narrative', `【戰勝】你擊敗了 ${G.enemy.name}！`);
      if (ev.onVictory) {
        EventSystem.load(ev.onVictory);
      } else {
        ExplorationSystem.endEvent();
      }
    } else {
      HUD.log('combat', '眼前一黑，你倒在了血泊之中……', 'enemy');
      if (ev.onDefeat) {
        EventSystem.load(ev.onDefeat);
      } else {
        switchSystem('ending', { id: 'defeat' });
      }
    }
    G.currentCombatEvent = null;
  }
};
Systems.combat = CombatSystem;