const TagUtils = {
  // ★ 新增：將傳入的數據統一轉成陣列
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

  bonus(tagIds) {
    // ★ 先轉換成陣列，再用 forEach
    const arr = this._parseTags(tagIds);
    let total = 0, detail = [];
    
    arr.forEach(t => {
      if (this.has(t) && G.data.TAGS[t]) {
        total += G.data.TAGS[t].bonus;
        detail.push(`${G.data.TAGS[t].name}+${G.data.TAGS[t].bonus}`);
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