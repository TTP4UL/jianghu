const CombatEffects = {
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
      const stacks = ctx.args[1] ? parseInt(ctx.args[1]) : 1;
      
      ctx.target.isPoisoned = (ctx.target.isPoisoned || 0) + turns;
      ctx.target.poisonStacks = (ctx.target.poisonStacks || 0) + stacks;
      
      HUD.log('combat', `【${ctx.sourceName}】使${ctx.targetName}中毒！(目前 ${ctx.target.poisonStacks} 層，持續 ${ctx.target.isPoisoned} 回合)`, ctx.stance);
    },
    bleed: function(ctx) {
      if (this.isImmune(ctx.target, 'bleed')) {
        HUD.log('combat', `【${ctx.sourceName}】的撕裂傷被化解！`, 'neutral');
        return;
      }
      const turns = ctx.args[0] ? parseInt(ctx.args[0]) : 3;
      const pct = ctx.args[1] ? parseFloat(ctx.args[1]) : 0.1;
      
      ctx.target.isBleeding = turns; 
      ctx.target.bleedPct = pct;
      
      HUD.log('combat', `【${ctx.sourceName}】造成撕裂重創！${ctx.targetName}每回合流血 (最大氣血 ${pct * 100}%)，持續 ${turns} 回合。`, ctx.stance);
    },
    seal: function(ctx) {
      if (this.isImmune(ctx.target, 'seal')) {
        HUD.log('combat', `【${ctx.sourceName}】試圖封鎖經脈，但被護體神功化解！`, 'neutral');
        return;
      }
      const turns = ctx.args[0] ? parseInt(ctx.args[0]) : 1;
      ctx.target.isSealed = Math.max(ctx.target.isSealed || 0, turns);
      HUD.log('combat', `【${ctx.sourceName}】重手點中${ctx.targetName}經脈要穴！真氣阻滯，無法出招且內功停止運轉！(持續 ${ctx.target.isSealed} 回合)`, ctx.stance);
    },
    silence: function(ctx) {
      if (this.isImmune(ctx.target, 'silence')) {
        HUD.log('combat', `【${ctx.sourceName}】試圖封穴，但被${ctx.targetName}的護體真氣彈開！`, 'neutral');
        return;
      }
      const turns = ctx.args[0] ? parseInt(ctx.args[0]) : 1;
      ctx.target.isSilenced = Math.max(ctx.target.isSilenced || 0, turns);
      HUD.log('combat', `【${ctx.sourceName}】點中${ctx.targetName}手臂穴道！暫時無法施展招式與身法！(持續 ${ctx.target.isSilenced} 回合)`, ctx.stance);
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

  isImmune(target, debuffType) {
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

    if (innerArt.immune) {
      String(innerArt.immune).split('|').forEach(s => {
        const v = s.trim().toLowerCase();
        if (v) allImmunities.push(v);
      });
    }

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

    String(effectsStr).split('|').forEach(eff => {
      const parts = eff.trim().split(':');
      const key = parts[0].toLowerCase();
      const args = parts.slice(1);

      const ctx = { sourceName, target, attacker, targetName, stance, args, isPierce };

      if (this._effectHandlers[key]) {
        this._effectHandlers[key].call(this, ctx);
        if (ctx.isPierce) isPierce = true;
      } else {
        console.warn(`[Combat] 未識別的特效: ${key}`);
      }
    });
    
    return { isPierce };
  }
};