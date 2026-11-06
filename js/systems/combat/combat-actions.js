const CombatActions = {
  checkExtraHits(art, baseHits) {
    const p = G.player;
    let triggerSource = null;
    let effectStr = '';

    (p.tags || []).forEach(t => {
      const tag = G.data.TAGS[t];
      if (tag && tag.passiveStats && tag.passiveStats.includes('double_attack')) {
        triggerSource = tag;
        effectStr = tag.passiveStats;
      }
      if (tag && tag.bonus && tag.bonus.includes('double_attack')) {
        triggerSource = tag;
        effectStr = tag.bonus;
      }
    });

    if (!triggerSource && p.loadout?.inner[0]) {
      const innerArt = G.data.MARTIAL_ARTS[p.loadout.inner[0]];
      if (innerArt && innerArt.innerEffect && innerArt.innerEffect.includes('double_attack')) {
        triggerSource = innerArt;
        effectStr = innerArt.innerEffect;
      }
    }

    if (!triggerSource) return baseHits;

    let chance = 0.5;
    const match = effectStr.match(/double_attack:(\w+):([\d.]+):([\d.]+)/);
    
    if (match) {
      const [, attr, baseStr, bonusStr] = match;
      const base = parseFloat(baseStr);
      const bonus = parseFloat(bonusStr);
      const penalty = Math.max(0, 10 - (p.stats[attr] || 10)); 
      chance = Math.min(0.9, base + penalty * bonus);
    }

    if (Math.random() < chance) {
      HUD.log('combat', `【${triggerSource.name}】觸發！招式化作漫天殘影！`, 'player');
      return baseHits * 2; 
    }
    return baseHits;
  },

  checkExtraTurn(art) {
    if (!art || !art.specialEffect) return false;
    const match = art.specialEffect.match(/extra_action(?::([\d.]+))?/);
    if (match) {
      const chance = match[1] ? parseFloat(match[1]) : 1.0;
      if (Math.random() < chance) {
        HUD.log('combat', `【${art.name}】身法詭譎，你搶得了下一次先機！`, 'player');
        return true; 
      }
    }
    return false;
  },

  attack() {
    const p = G.player, e = G.enemy;
    const attr = 'str'; 
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: '普通攻擊', attr: attr, dc: this.getEffectiveAC(e), tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          const baseHits = 1;
          let hits = this.checkExtraHits(null, baseHits); 
          const diceType = Number(p.punchDiceType) || 8;
          
          for (let i = 0; i < hits; i++) {
            setTimeout(() => {
              if (i === baseHits && hits > baseHits) {
                HUD.log('combat', `【左右互搏】觸發！招式化作漫天殘影！`, 'player');
              }
              const roll = Math.floor(Math.random() * diceType) + 1;
              const dmg = (roll * (res.nat20 ? 2 : 1)) + mod;
              soundEngine.playBladeClash();
              this.dealDamage(e, dmg, res.nat20, i + 1, hits);
              this.updateHUD();
            }, i * 600);
          }
          setTimeout(() => this.nextTurn(), hits * 600 + 500);
        } else {
          HUD.log('combat', '你的攻擊被敵方【閃避】！', 'enemy');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
        }
        this.updateHUD();
        setTimeout(() => this.nextTurn(), 1000);
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
          const baseHits = Number(art.hits) || 1;
          const hits = this.checkExtraHits(art, baseHits);
          const diceCount = Number(art.diceCount) || 1; 
          const diceType = Number(art.diceType) || 8; 
          const fixedDmg = Number(art.fixedDamage) || 0;
          
          soundEngine.playQiSurge();
          HUD.log('combat', `【${art.name}】命中！造成 ${hits} 段傷害！`, 'player');
          const { isPierce } = this.applySpecialEffect(art.name, art.specialEffect, p, e);

          for (let i = 0; i < hits; i++) {
            setTimeout(() => {
              if (i === baseHits && hits > baseHits) {
                HUD.log('combat', `【左右互搏】觸發！招式化作漫天殘影！`, 'player');
              }
              let dmg = 0;
              if (fixedDmg > 0) { 
                dmg = fixedDmg * (res.nat20 ? 2 : 1);
              } else {
                let totalRoll = 0;
                for (let j = 0; j < diceCount; j++) totalRoll += Math.floor(Math.random() * diceType) + 1;
                dmg = (totalRoll * (res.nat20 ? 2 : 1)) + mod;
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
          setTimeout(() => { setTimeout(() => this.nextTurn(), 1000); }, hits * 600);
        } else {
          HUD.log('combat', `【${art.name}】被敵方化解！`, 'enemy');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
          setTimeout(() => this.nextTurn(), 1000);
        }
        this.updateHUD();
      }
    });
  },

  useUtility(art) {
    const p = G.player, e = G.enemy;
    const cost = art.qiCost || 2;
    if (p.qi < cost || G.utilityUsedThisTurn) return;
    
    p.qi -= cost; p.qi = Math.max(0, p.qi);
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
    if (e.hp <= 0) return this.end(true);

    if (this.checkExtraTurn(art)) {
      return this.startPlayerTurn(true); // ★ 傳入 true 代表「不重置身法狀態」
    }
    this.renderActions();
  },

  parry() {
    G.player.pos = Math.min(G.player.maxPos, G.player.pos + 5);
    G.player.parrying = true; 
    HUD.log('combat', T('parry', { pos: 5 }), 'player');
    HUD.updateGauges();
    setTimeout(() => this.nextTurn(), 1000);
  },

  meditate() {
    const p = G.player;
    p.qi = Math.min(p.maxQi, p.qi + 3);
    soundEngine.playQiSurge();
    HUD.log('combat', T('meditate', { qi: 3 }), 'player');
    HUD.updateGauges();
    setTimeout(() => this.nextTurn(), 1000);
  }

};