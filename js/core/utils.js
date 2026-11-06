
const StatUtils = {
  // 計算屬性變動後的衍生數值 (氣血、架勢、閃避)
  applyDerivedStats(p, oldStats) {
    const newStats = p.stats;
    
    // 1. 更新閃避 (身法)
    const dexMod = Math.floor((newStats.dex - 10) / 2);
    p.ac = 10 + dexMod;

    // 2. 更新氣血上限 (根骨)
    const oldConMod = Math.floor((oldStats.con - 10) / 2);
    const newConMod = Math.floor((newStats.con - 10) / 2);
    const hpDiff = (newConMod - oldConMod) * 3;
    if (hpDiff !== 0) {
      p.maxHp = Math.max(1, p.maxHp + hpDiff);
      p.hp = Math.max(1, Math.min(p.maxHp, p.hp + hpDiff));
    }

    // 3. 更新架勢上限 (悟性)
    const oldIntMod = Math.floor((oldStats.int - 10) / 2);
    const newIntMod = Math.floor((newStats.int - 10) / 2);
    const posDiff = (Math.max(0, newIntMod) - Math.max(0, oldIntMod)) * 2;
    if (posDiff !== 0) {
      p.maxPos = Math.max(1, p.maxPos + posDiff);
      p.pos = Math.max(0, Math.min(p.maxPos, p.pos + posDiff));
    }
  },

  // 加點所需潛力
  getCostForNextPoint(rawVal) {
    const displayVal = rawVal - 10;
    if (displayVal < 3) return 1;
    if (displayVal < 6) return 2;
    if (displayVal < 9) return 3;
    return 4;
  },

  // 降點退還潛力
  getRefundForPoint(prevRawVal) {
    return this.getCostForNextPoint(prevRawVal);
  }
};

const MartialArtUtils = {
  // 處理內功裝備/卸下時的加成與 Tag
  toggleInnerEffect(p, art, isEquip) {
    if (!art) return;

    if (art.innerEffect) {
      String(art.innerEffect).split('|').forEach(eff => {
        const [key, val] = eff.split(':');
        const k = key.trim().toLowerCase();
        const num = Number(val) || 0;
        const dir = isEquip ? 1 : -1;

        if (k === 'maxhp') { 
          p.maxHp = Math.max(1, p.maxHp + num * dir); 
          if (p.hp > p.maxHp) p.hp = p.maxHp; 
          if (isEquip && num > 0) p.hp += num;
        }
        if (k === 'maxpos') { 
          p.maxPos = Math.max(1, p.maxPos + num * dir); 
          if (p.pos > p.maxPos) p.pos = p.maxPos; 
          if (isEquip && num > 0) p.pos += num;
        }
        if (k === 'maxqi') { 
          p.maxQi = Math.max(1, p.maxQi + num * dir); 
          if (p.qi > p.maxQi) p.qi = p.maxQi; 
          if (isEquip && num > 0) p.qi += num;
        }
      });
    }

    if (art.grantTags) {
      String(art.grantTags).split('|').map(t => t.trim()).filter(Boolean).forEach(t => {
        if (isEquip) {
          TagUtils.add(t);
        } else {
          const stillGranted = ['attack', 'inner', 'utility'].some(slot =>
            (p.loadout[slot] || []).filter(Boolean).some(id => {
              const a = G.data.MARTIAL_ARTS[id];
              if (!a || !a.grantTags) return false;
              return String(a.grantTags).split('|').map(s => s.trim()).includes(t);
            })
          );
          if (!stillGranted) TagUtils.remove(t);
        }
      });
    }
  }
};

const EventPicker = {
  pick(options = {}) {
    if (!G.data.EVENTS) return null;

    const candidates = Object.values(G.data.EVENTS).filter(e => {
      if (e.type === 'ending' || e.type === 'combat') return false;
      if (e.weight !== undefined && e.weight !== '' && Number(e.weight) === 0) return false;
      if (!e.text && (!e.choices || e.choices.length === 0)) return false;

      // 年齡過濾
      if (e.age) {
        if (String(e.age).includes('-')) {
          const [min, max] = String(e.age).split('-').map(Number);
          if (G.currentAge < min || G.currentAge > max) return false;
        } else if (Number(e.age) !== G.currentAge) {
          return false;
        }
      } else {
        if (options.isLifepath) return false;
        if (G.currentAge < 18) return false;
      }

      if (options.isLifepath && options.usedEvents && options.usedEvents.includes(e.id)) return false;

      if (!options.isLifepath && options.actionType) {
        if (options.actionType === 'tavern') {
          if (e.actionType && e.actionType !== 'tavern' && e.actionType !== 'both') return false;
          if (!e.actionType) {
            if (e.badge !== '酒館' && e.uiType !== 'tavern' && !String(e.title || '').includes('酒')) return false;
          }
        } else if (options.actionType === 'explore') {
          if (e.actionType && e.actionType !== 'explore' && e.actionType !== 'both') return false;
          if (!e.actionType) {
            if (e.badge === '酒館' || e.uiType === 'tavern') return false;
          }
        }
      }

      if (e.requireTags && e.requireTags.length > 0 && !TagUtils.hasAll(e.requireTags)) return false;
      if (e.forbidTags && e.forbidTags.length > 0 && !TagUtils.hasNone(e.forbidTags)) return false;

      return true;
    });

    if (candidates.length === 0) return null;

    const specific = candidates.filter(e => Number(e.priority) > 0)
      .sort((a, b) => Number(b.priority) - Number(a.priority));
    if (specific.length > 0) return specific[0].id;

    const safeWeight = (w) => {
      if (w === undefined || w === '') return 10;
      const n = Number(w);
      return isNaN(n) ? 10 : n;
    };

    const totalWeight = candidates.reduce((sum, e) => sum + safeWeight(e.weight), 0);
    let rand = Math.random() * totalWeight;

    for (const ev of candidates) {
      const w = safeWeight(ev.weight);
      if (rand < w) return ev.id;
      rand -= w;
    }

    return candidates[0].id;
  }
};

const ChoiceUtils = {
  process(rawChoices) {
    if (!rawChoices) return [];

    return rawChoices.map(c => {
      let isLocked = false;
      let lockReason = '';

      // 1. 檢查 requireTags
      if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) {
        isLocked = true;
        const missingTags = c.requireTags.filter(t => !TagUtils.has(t));
        const tagNames = missingTags.map(t => G.data.TAGS[t]?.name || t).join('、');
        lockReason = `需要特性【${tagNames}】`;
      }

      // 2. 檢查 forbidTags
      if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) {
        isLocked = true;
        lockReason = `擁有某種特性，無法選擇`;
      }

      // 3. 檢查 requireStats (能力值限制)
      if (c.requireStats && String(c.requireStats).trim() !== '') {
        String(c.requireStats).split('|').forEach(req => {
          const [attr, valStr] = req.split(':');
          const reqVal = Number(valStr);
          if (G.player.stats[attr] < reqVal) {
            isLocked = true;
            const attrName = STATS_INFO[attr]?.name || attr;
            lockReason = `需要 ${attrName} 達到 ${reqVal - 10}（目前 ${G.player.stats[attr] - 10}）`;
          }
        });
      }

      // ★ 新增：4. 檢查 requireGold (金錢限制)
      if (c.requireGold) {
        const reqGold = Number(c.requireGold);
        if (G.player.gold < reqGold) {
          isLocked = true;
          lockReason = `需要 ${reqGold} 兩（目前 ${G.player.gold} 兩）`;
        }
      }

      // 如果被鎖定，且 Excel 未設定 showIfLocked，則直接隱藏 (返回 null)
      if (isLocked && !c.showIfLocked) return null;

      // 返回 HUD 需要的格式
      return {
        label: c.text,
        checkText: c.type === 'check' ? `${STATS_INFO[c.attr]?.name || c.attr} DC ${c.dc}` : '',
        desc: c.desc,
        primary: c.type === 'check',
        disabled: isLocked,
        lockReason: lockReason,
        action: () => {
          if (isLocked) {
            HUD.log('combat', `你無法選擇此項：${lockReason}`, 'neutral');
            return;
          }
          EventSystem.handleChoice(c);
        }
      };
    }).filter(Boolean); // 過濾掉 null
  }
};