const CombatEnemy = {
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

  checkBossPhase() {
    const e = G.enemy;
    if (!e || !e.phase2Data || e.phase2Triggered) return;
    
    const hpPercent = (e.hp / e.maxHp) * 100;
    if (hpPercent <= e.phase2Data.hpTrigger) {
      e.phase2Triggered = true;
      
      if (e.phase2Data.dialog) HUD.log('dialogue', e.phase2Data.dialog, e.name);
      if (e.phase2Data.newArts) {
        e.arts = e.phase2Data.newArts.split('|').map(s => s.trim());
        HUD.log('combat', `【${e.name}】招式突變，殺氣暴漲！`, 'enemy');
      }
      if (e.phase2Data.healPercent > 0) {
        const healAmt = Math.floor(e.maxHp * (e.phase2Data.healPercent / 100));
        e.hp = Math.min(e.maxHp, e.hp + healAmt);
        HUD.log('combat', `【${e.name}】氣血翻湧，回復了 ${healAmt} 點氣血！`, 'enemy');
      }
      HUD.shakeScreen();
      this.updateHUD();
    }
  },

  // ★ 抽取同伴台詞
  getCompanionDialog(comp, type) {
    const text = comp[`dialog_${type}`] || '';
    if (!text) return '';
    const lines = String(text).split('|');
    return lines[Math.floor(Math.random() * lines.length)];
  },

  // ★ 全自動同伴回合
  companionTurn(onComplete) {
    const p = G.player;
    if (!p.companions || p.companions.length === 0) {
      return onComplete(); 
    }

    const compId = p.companions[Math.floor(Math.random() * p.companions.length)];
    const c = G.data.COMPANIONS[compId];
    if (!c) return onComplete();

    const e = G.enemy;
    
    // 檢查該同伴是否因為敵人太弱而整場罷工（需要在 enter 時標記）
    if (c._isIdling) {
      return onComplete();
    }

    // 1. 判斷當前局勢機率
    let rate = Number(c.actionRate) || 0.5;
    let isBossFight = (e.maxHp >= 100 || e.phase2Triggered);
    let isLowHp = (p.hp / p.maxHp <= 0.3);

    if (isBossFight && c.actionRate_boss) rate = Number(c.actionRate_boss);
    else if (isLowHp && c.actionRate_lowHp) rate = Number(c.actionRate_lowHp);

    // 2. 擲骰判定
    if (Math.random() > rate) {
      // 摸魚：完全靜默，直接跳過
      return setTimeout(() => onComplete(), 500);
    }

    // 3. 準備出手 (抽取武學)
    let artIds = c.martialArts ? String(c.martialArts).split('|').map(s => s.trim()) : [];
    if (artIds.length === 0) artIds = ['c_basic_sword']; // 防呆
    const artId = artIds[Math.floor(Math.random() * artIds.length)];
    
    // ★ 新增防呆：
    let art = G.data.MARTIAL_ARTS[artId];
    if (!art) art = G.data.MARTIAL_ARTS['c_basic_sword']; 
    if (!art) return onComplete(); // 如果連基礎劍法都冇，直接跳過

    // 4. 決定台詞
    let dialogText = '';
    let isFirstTurn = !G.companionUsedThisCombat; // 需要喺 enter 初始化
    let willKill = false; // 粗略判斷能否尾刀

    // 傷害計算 (簡化版：同伴不看骰子，直接根據武學基礎威力計算，或固定傷害)
    const baseDmg = art.fixedDamage ? Number(art.fixedDamage) : (Number(art.diceCount || 1) * 5);
    if (e.hp <= baseDmg) willKill = true;

    if (willKill && c.dialog_kill) {
      dialogText = this.getCompanionDialog(c, 'kill');
    } else if (isBossFight && c.dialog_boss) {
      dialogText = this.getCompanionDialog(c, 'boss');
    } else if (isLowHp && c.dialog_lowHp) {
      dialogText = this.getCompanionDialog(c, 'lowHp');
    } else if (isFirstTurn && c.dialog_first) {
      dialogText = this.getCompanionDialog(c, 'first');
    } else if (Math.random() < 0.2 && c.dialog_attack) {
      dialogText = this.getCompanionDialog(c, 'attack');
    }

    // 5. 執行出手
    setTimeout(() => {
      if (dialogText) {
        HUD.log('dialogue', dialogText, c.name);
      }

      HUD.log('combat', `【${c.name}】施展【${art.name}】策應！`, 'player');
      
      // 同伴傷害直接無視真氣消耗，走 applySpecialEffect 同 dealDamage
      const { isPierce } = this.applySpecialEffect(art.name, art.specialEffect, c, e);
      
      if (isPierce) {
        e.hp = Math.max(0, e.hp - baseDmg);
        HUD.log('combat', `造成 ${baseDmg} 點穿透傷害！`, 'player');
        HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${baseDmg}`, 'crit');
      } else {
        this.dealDamage(e, baseDmg, false);
      }

      G.companionUsedThisCombat = true; // 標記已出手
      this.updateHUD();
      
      // 判斷敵人是否死亡
      if (e.hp <= 0) {
        return this.end(true);
      }
      
      setTimeout(() => onComplete(), 800);
    }, 500);
  },

  enemyTurn() {
    const p = G.player, e = G.enemy;
    if (e.hp <= 0) return this.end(true);

    this.tickBuffs(e); 

    if (p.isPoisoned > 0) {
      const pDmg = (p.poisonStacks || 1) * 1; 
      p.hp = Math.max(0, p.hp - pDmg);
      HUD.log('combat', `你劇毒發作！(目前 ${p.poisonStacks} 層) 受到 ${pDmg} 點傷害！`, 'enemy');
      HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${pDmg}`, 'normal');
      p.isPoisoned--; 
      if (p.isPoisoned <= 0) p.poisonStacks = 0; 
      this.updateHUD();
      if (p.hp <= 0) return this.end(false);
    }
    
    if (p.isBleeding > 0) {
      const pDmg = Math.floor(p.maxHp * (p.bleedPct || 0.1));
      p.hp = Math.max(0, p.hp - pDmg);
      HUD.log('combat', `你傷口撕裂，流血不止！受到最大氣血 ${Math.floor((p.bleedPct || 0.1) * 100)}% 傷害 (${pDmg} 點)！`, 'enemy');
      HUD.floatDamage(document.getElementById('hudHpCur').parentElement, `-${pDmg}`, 'crit');
      p.isBleeding--;
      this.updateHUD();
      if (p.hp <= 0) return this.end(false);
    }

    if (e.isPoisoned > 0) {
      const eDmg = (e.poisonStacks || 1) * 1;
      e.hp = Math.max(0, e.hp - eDmg);
      HUD.log('combat', `敵方劇毒發作！(目前 ${e.poisonStacks} 層) 受到 ${eDmg} 點傷害！`, 'player');
      HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${eDmg}`, 'normal');
      e.isPoisoned--;
      if (e.isPoisoned <= 0) e.poisonStacks = 0;
      this.updateHUD();
      if (e.hp <= 0) return this.end(true);
    }

    if (e.isBleeding > 0) {
      const eDmg = Math.floor(e.maxHp * (e.bleedPct || 0.1));
      e.hp = Math.max(0, e.hp - eDmg);
      HUD.log('combat', `敵方傷口撕裂，血流如注！受到最大氣血 ${Math.floor((e.bleedPct || 0.1) * 100)}% 傷害 (${eDmg} 點)！`, 'player');
      HUD.floatDamage(document.getElementById('enemyHpText').parentElement, `-${eDmg}`, 'crit');
      e.isBleeding--;
      this.updateHUD();
      if (e.hp <= 0) return this.end(true);
    }

    this.checkBossPhase();
    if (e.hp <= 0) return this.end(true);

    let canAct = true;
    let isSkillBlocked = false;

    if (e.isStunned) {
      e.isStunned = false;
      canAct = false;
      HUD.log('combat', T('enemy_stunned'), 'player');
    }

    if (e.isSealed > 0) {
      if (canAct) HUD.log('combat', '敵方要穴被封，無法施展武學！', 'player');
      e.isSealed--;
      isSkillBlocked = true;
    } else if (e.isSilenced > 0) {
      if (canAct) HUD.log('combat', '敵方穴道被封，無法施展身法！', 'player');
      e.isSilenced--;
      isSkillBlocked = true;
    }

    if (!canAct) {
      p.parrying = false; 
      this.updateHUD(); 
      G.combatTurn++;
      return this.startPlayerTurn();
    }

    let usedArt = null;
    if (!isSkillBlocked && e.arts && e.arts.length > 0 && Math.random() > 0.4) { 
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
        const diceCount = Number(usedArt.diceCount) || 1;
        const diceType = Number(usedArt.diceType) || 8;
        const fixedDmg = Number(usedArt.fixedDamage) || 0;
        
        HUD.log('combat', `【${usedArt.name}】命中！造成 ${hits} 段傷害！`, 'enemy');
        const { isPierce } = this.applySpecialEffect(usedArt.name, usedArt.specialEffect, e, p);
        
        for (let i = 0; i < hits; i++) {
          setTimeout(() => {
            let dmg = 0;
            if (fixedDmg > 0) { 
              dmg = fixedDmg * (d20 === 20 ? 2 : 1);
            } else {
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
          else {
            G.combatTurn++;
            this.startPlayerTurn();
          }
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
    else { 
      G.combatTurn++;
      this.startPlayerTurn(); 
    }
  }
};