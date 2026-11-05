function parseEffectsToText(effects) {
  if (!effects) return '';
  const parts = [];
  Object.entries(effects).forEach(([k, v]) => {
    if (k === 'hp' || k === 'hp_regen') parts.push(`氣血 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'pos') parts.push(`架勢 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'posSet') parts.push(`架勢設為 ${v}`);
    else if (k === 'qi') parts.push(`真氣 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'gold') parts.push(`金錢 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxHp') parts.push(`氣血上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxPos') parts.push(`架勢上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'maxQi') parts.push(`真氣上限 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'reputation') parts.push(`江湖威望 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'morality') parts.push(`正邪行事 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'contribution') parts.push(`門派貢獻 ${v > 0 ? '+' : ''}${v}`);
    else if (k === 'addTag') parts.push(`獲得特性【${G.data.TAGS[v]?.name || v}】`);
    else if (k === 'removeTag') parts.push(`解除特性【${G.data.TAGS[v]?.name || v}】`);
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
        arr.forEach(t => {
          if (TagUtils.add(t)) {
            const tag = G.data.TAGS[t];
            const tagName = tag?.name || t;
            const grade = (tag?.grade || 'E').toUpperCase();
            const bonus = String(tag?.bonus || '0');
            const isNegative = grade === 'F' || bonus.includes('-');
            const isSkill = tag?.category === 'skill' || tag?.category === 'martial';

            if (isNegative) {
              HUD.log('combat', `身中【${tagName}】`, 'enemy');
            } else if (isSkill) {
              HUD.log('dice', `領悟【${tagName}】`);
            } else {
              HUD.log('lifepath', `獲得【${tagName}】`);
            }
          }
        });
      }
      else if (k === 'removeTag') {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(t => {
          if (TagUtils.remove(t)) {
            const tagName = G.data.TAGS[t]?.name || t;
            HUD.log('lifepath', `【${tagName}】已解除。`);
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
      else if (k === 'addMartialArt') {
        const artId = String(v).trim();
        const art = G.data.MARTIAL_ARTS[artId];
        if (!art) return;

        if (!p.martialArts) p.martialArts = [];
        if (!p.martialArts.includes(artId)) p.martialArts.push(artId);

        if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

        const slot = art.slot;
        let equipped = false;
        if (slot && p.loadout[slot]) {
          const idx = p.loadout[slot].indexOf(null);
          if (idx !== -1) {
            p.loadout[slot][idx] = artId;
            equipped = true;
            
            // ★ 改用 MartialArtUtils
            MartialArtUtils.toggleInnerEffect(p, art, true);
          }
        }

        if (equipped) {
          HUD.log('lifepath', `習得並裝備【${art.name}】`);
        } else {
          HUD.log('lifepath', `習得【${art.name}】，但槽位已滿，請手動裝備。`);
        }
      }
      else if (k === 'reputation') {
        // ★ 名聲：可負，-100 到 +100，唔再 clamp 到 0
        const oldRep = p.reputation || 0;
        p.reputation = Math.max(-100, Math.min(100, oldRep + num));
        const actual = p.reputation - oldRep;
        if (actual !== 0) {
          HUD.log('lifepath', `江湖名聲 ${actual > 0 ? '+' : ''}${actual}（目前 ${p.reputation}）`);
        } else if (num !== 0) {
          HUD.log('lifepath', `江湖名聲已達極限，無法再${num > 0 ? '升' : '降'}。`, 'neutral');
        }
      }
      else if (k === 'morality') {
        // 正邪冇下限，可以負數
        p.morality = (p.morality || 0) + num;
        const dir = num > 0 ? '正道' : '邪道';
        HUD.log('lifepath', `行事偏向${dir} ${num > 0 ? '+' : ''}${num}（目前 ${p.morality}）`);
      }
      else if (k === 'contribution') {
        p.contribution = Math.max(0, (p.contribution || 0) + num);
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
      else if (k === 'hp' || k === 'hp_regen') p.hp = Math.max(0, Math.min(p.maxHp, p.hp + num));
      else if (k === 'pos') p.pos = Math.max(0, Math.min(p.maxPos, p.pos + num));
      else if (k === 'posSet') p.pos = Math.max(0, Math.min(p.maxPos, num));
      else if (k === 'qi') p.qi = Math.max(0, Math.min(p.maxQi, p.qi + num));
      else if (k === 'gold') p.gold = Math.max(0, p.gold + num);
      else if (k in p.stats) {
        const oldStats = { ...p.stats }; // 記錄舊屬性
        const newStat = p.stats[k] + num;

        if (newStat < 10) {
          p.stats[k] = 10;
          const debuffId = `debuff_${k}`;
          if (G.data.TAGS[debuffId] && TagUtils.add(debuffId)) {
            HUD.log('combat', `屬性已達底線，經脈留下永久損傷，身中【${G.data.TAGS[debuffId].name}】！`, 'enemy');
          }
        } else {
          p.stats[k] = newStat;
        }

        // 自動計算衍生屬性
        StatUtils.applyDerivedStats(p, oldStats);
      }
      else if (k === 'ac') p.ac += num;
    });

    HUD.updateGauges();
    HUD.render();
  }
};