function parseEffectsToText(effects) {
  if (!effects) return '';
  const parts = [];
  Object.entries(effects).forEach(([k, v]) => {
    if (k === 'hp' || k === 'hp_regen') parts.push(`氣血 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'pos') parts.push(`架勢 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'qi') parts.push(`真氣 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'gold') parts.push(`金錢 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxHp') parts.push(`氣血上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxPos') parts.push(`架勢上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxQi') parts.push(`真氣上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'addTag') parts.push(`獲得特性【${G.data.TAGS[v]?.name || v}】`);
    else if (k === 'addMartialArt') parts.push(`習得武學【${G.data.MARTIAL_ARTS[v]?.name || v}】`);
    else if (k === 'addCompanion') parts.push(`結識同伴【${G.data.COMPANIONS[v]?.name || v}】`);
    else if (k in STATS_INFO) parts.push(`${STATS_INFO[k].name} ${v > 0 ? '+' : ''}${v}`);
  });
  return parts.join(' · ');
}

const EffectSystem = {
  apply(effects) {
    if (!effects || !G.player) return;
    const p = G.player;
    
    Object.entries(effects).forEach(([k, v]) => {
      const num = Number(v) || 0;
      
      if (k === 'addTag') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(t => { if (TagUtils.add(t)) HUD.log('dice', `領悟【${G.data.TAGS[t]?.name || t}】`); });
      }
      else if (k === 'removeTag') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(t => TagUtils.remove(t));
      }
      else if (k === 'addMartialArt') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(a => {
          if (!p.martialArts.includes(a) && G.data.MARTIAL_ARTS[a]) {
            p.martialArts.push(a);
            HUD.log('dice', `習得【${G.data.MARTIAL_ARTS[a].name}】`);
          }
        });
      }
      else if (k === 'addCompanion') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(cid => {
          if (!p.companions.includes(cid) && G.data.COMPANIONS[cid] && p.companions.length < 2) {
            p.companions.push(cid);
            HUD.log('lifepath', `${G.data.COMPANIONS[cid].name} 加入了你的旅途`);
          }
        });
      }
      else if (k === 'maxHp') {
        p.maxHp = Math.max(1, p.maxHp + num);
        if (p.hp > p.maxHp) p.hp = p.maxHp;
      }
      else if (k === 'maxPos') {
        p.maxPos = Math.max(1, p.maxPos + num);
        if (p.pos > p.maxPos) p.pos = p.maxPos;
      }
      else if (k === 'maxQi') {
        p.maxQi = Math.max(1, p.maxQi + num);
        if (p.qi > p.maxQi) p.qi = p.maxQi;
      }
      // 兼容 hp 和 hp_regen
      else if (k === 'hp' || k === 'hp_regen') p.hp = Math.max(0, Math.min(p.maxHp, p.hp + num));
      else if (k === 'pos') p.pos = Math.max(0, Math.min(p.maxPos, p.pos + num));
      else if (k === 'posSet') p.pos = Math.max(0, Math.min(p.maxPos, num));
      else if (k === 'qi') p.qi = Math.max(0, Math.min(p.maxQi, p.qi + num));
      else if (k === 'gold') p.gold = Math.max(0, p.gold + num);
      else if (k in p.stats) {
        const oldStat = p.stats[k];
        p.stats[k] = Math.max(1, p.stats[k] + num);
        
        if (k === 'dex') {
          const dexMod = Math.floor((p.stats.dex - 10) / 2);
          p.ac = 10 + dexMod;
        }
        if (k === 'con') {
          const oldConMod = Math.floor((oldStat - 10) / 2);
          const newConMod = Math.floor((p.stats.con - 10) / 2);
          const hpDiff = (newConMod - oldConMod) * 3;
          p.maxHp = Math.max(1, p.maxHp + hpDiff);
          p.hp = Math.max(1, Math.min(p.maxHp, p.hp + hpDiff));
        }
        // ★ 新增：如果加減的是悟性，重新計算架勢上限
        if (k === 'int') {
          const oldIntMod = Math.floor((oldStat - 10) / 2);
          const newIntMod = Math.floor((p.stats.int - 10) / 2);
          const posDiff = (Math.max(0, newIntMod) - Math.max(0, oldIntMod)) * 2;
          p.maxPos = Math.max(1, p.maxPos + posDiff);
          p.pos = Math.max(0, Math.min(p.maxPos, p.pos + posDiff));
        }
      }
      else if (k === 'ac') p.ac += num;

    });
    
    HUD.updateGauges();
    HUD.render();
  }
};