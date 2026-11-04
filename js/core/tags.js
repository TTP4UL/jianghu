const TagUtils = {
  // ★ 終極防禦：不管傳入什麼鬼東西，都轉成陣列
  _parseTags(tagIds) {
    if (!tagIds) return [];
    if (Array.isArray(tagIds)) return tagIds;
    if (typeof tagIds === 'string') {
      return tagIds.split('|').map(s => s.trim()).filter(Boolean);
    }
    return [];
  },

  has(tagId) {
    if (!G.player) return false;
    return G.player.tags.includes(tagId) || getCompanionTags().includes(tagId);
  },

  hasAll(tagIds) {
    const arr = this._parseTags(tagIds);
    if (arr.length === 0) return true;
    return arr.every(t => this.has(t));
  },

  hasNone(tagIds) {
    const arr = this._parseTags(tagIds);
    if (arr.length === 0) return true;
    return !arr.some(t => this.has(t));
  },

  // ★ 新增：專門處理單一 Tag 加成的輔助函數
  _calcTagBonus(tag, checkAttr) {
    const bonusStr = String(tag.bonus || '0');
    let total = 0;
    const detail = [];

    // 舊版相容：如果是純數字，代表全屬性加成
    if (!isNaN(bonusStr) && !bonusStr.includes(':')) {
      const val = Number(bonusStr);
      if (val !== 0) {
        total += val;
        detail.push(`${tag.name}${val > 0 ? '+' : ''}${val}`);
      }
      return { total, detail };
    } 
    
    // 新版定向加成：str:2|int:-1
    bonusStr.split('|').forEach(part => {
      const [attr, valStr] = part.split(':');
      const val = Number(valStr) || 0;
      const a = attr.trim().toLowerCase();
      // 如果填了 all 或者匹配當前檢定屬性
      if (a === 'all' || a === checkAttr) {
        total += val;
        detail.push(`${tag.name}${val > 0 ? '+' : ''}${val}`);
      }
    });

    return { total, detail };
  },

  // ★ 核心修復：使用 _parseTags 並結合全局判定
  bonus(tagIds, checkAttr) {
    let total = 0;
    let detail = [];
    
    // 1. 處理「全局發動」的 Tag (不需要在選項中填寫)
    (G.player.tags || []).forEach(tId => {
      const tag = G.data.TAGS[tId];
      if (tag && String(tag.global).toLowerCase() === 'true') {
        const res = this._calcTagBonus(tag, checkAttr);
        total += res.total;
        detail.push(...res.detail);
      }
    });

    // 2. 處理「選項指定」的 Tag (條件觸發) - ★ 這裡加上 _parseTags 防呆
    const parsedTagIds = this._parseTags(tagIds);
    parsedTagIds.forEach(t => {
      const tag = G.data.TAGS[t];
      // 避免重複計算：如果這個 Tag 已經是全局 Tag，上面算過了，這裡就跳過
      if (!tag || String(tag.global).toLowerCase() === 'true') return;
      
      if (this.has(t)) {
        const res = this._calcTagBonus(tag, checkAttr);
        total += res.total;
        detail.push(...res.detail);
      }
    });
    
    return { total, detail };
  },

  add(tagId) {
    if (!G.data.TAGS[tagId]) return false;
    if (G.player.tags.includes(tagId)) return false;
    G.player.tags.push(tagId);
    return true;
  },

  remove(tagId) {
    const idx = G.player.tags.indexOf(tagId);
    if (idx !== -1) { G.player.tags.splice(idx, 1); return true; }
    return false;
  }
};