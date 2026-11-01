// ★ 將 effects 物件翻譯成中文句子
function parseEffectsToText(effects) {
  if (!effects) return '';
  const parts = [];
  Object.entries(effects).forEach(([k, v]) => {
    if (k === 'hp') parts.push(`氣血 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'pos') parts.push(`架勢 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'qi') parts.push(`真氣 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'gold') parts.push(`金錢 ${v > 0 ? '+' : ''}${v}`);
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
      if (k === 'addTag') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(t => {
          if (TagUtils.add(t)) HUD.log('dice', `領悟【${G.data.TAGS[t]?.name || t}】`);
        });
      }
      else if (k === 'removeTag') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(t => { TagUtils.remove(t); });
      }
      else if (k === 'addMartialArt') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(a => {
          if (!p.martialArts.includes(a) && G.data.MARTIAL_ARTS[a]) {
            p.martialArts.push(a);
            const art = G.data.MARTIAL_ARTS[a];
            HUD.log('dice', `習得【${art.name}】(${art.grade}級)`);
          }
        });
      }
      else if (k === 'addCompanion') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(cid => {
          if (p.companions.includes(cid) || !G.data.COMPANIONS[cid]) return;
          if (p.companions.length >= 2) return;
          p.companions.push(cid);
          HUD.log('lifepath', `${G.data.COMPANIONS[cid].name} 加入了你的旅途`);
        });
      }
      else if (k === 'removeCompanion') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(cid => {
          const idx = p.companions.indexOf(cid);
          if (idx !== -1) {
            const name = G.data.COMPANIONS[cid]?.name || cid;
            p.companions.splice(idx, 1);
            HUD.log('combat', `${name} 離開了你的旅途`);
          }
        });
      }
      else if (k === 'hp') p.hp = Math.max(0, Math.min(p.maxHp, p.hp + v));
      else if (k === 'pos') p.pos = Math.max(0, Math.min(p.maxPos, p.pos + v));
      else if (k === 'posSet') p.pos = Math.max(0, Math.min(p.maxPos, v));
      else if (k === 'qi') p.qi = Math.max(0, Math.min(p.maxQi, p.qi + v));
      else if (k === 'gold') p.gold = Math.max(0, p.gold + v);
      else if (k in p.stats) p.stats[k] = Math.max(1, p.stats[k] + v);
    });
    HUD.updateGauges();
    HUD.render();
  }
};