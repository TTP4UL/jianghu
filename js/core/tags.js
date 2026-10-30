const TagUtils = {
  has(tagId) {
    if (!G.player) return false;
    return G.player.tags.includes(tagId) || getCompanionTags().includes(tagId);
  },
  hasAll(tagIds) {
    if (!tagIds || !tagIds.length) return true;
    return tagIds.every(t => this.has(t));
  },
  hasNone(tagIds) {
    if (!tagIds || !tagIds.length) return true;
    return !tagIds.some(t => this.has(t));
  },
  bonus(tagIds) {
    let total = 0, detail = [];
    (tagIds || []).forEach(t => {
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