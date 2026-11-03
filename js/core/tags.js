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

  // ★ 核心修復：使用 _parseTags 進行防呆
  bonus(tagIds, checkAttr) {
    const arr = this._parseTags(tagIds);
    let total = 0;
    let detail = [];
    
    arr.forEach(t => {
      if (this.has(t) && G.data.TAGS[t]) {
        const tag = G.data.TAGS[t];
        const bonusStr = String(tag.bonus || '0');
        
        // 1. 舊版相容：如果直接填數字
        if (!isNaN(bonusStr) && !bonusStr.includes(':')) {
          const val = Number(bonusStr);
          if (val !== 0) {
            total += val;
            detail.push(`${tag.name}${val > 0 ? '+' : ''}${val}`);
          }
          return;
        }
        
        // 2. 新版定向加成：解析 str:2|dex:-1 格式
        bonusStr.split('|').forEach(part => {
          const [attr, valStr] = part.split(':');
          const val = Number(valStr) || 0;
          const a = attr.trim().toLowerCase();
          
          if (a === 'all' || a === checkAttr) {
            total += val;
            detail.push(`${tag.name}${val > 0 ? '+' : ''}${val}`);
          }
        });
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