const SaveSystem = {
  KEY: 'jianghu_save_v1',
  VERSION: 1,

  save() {
    if (!G.player) return;
    try {
      const data = {
        version: this.VERSION,
        player: G.player,
        currentAge: G.currentAge,
        currentSeason: G.currentSeason,
        usedEvents: G.usedEvents || [],
        currentSystem: G.currentSystem,
        currentCombatEvent: G.currentCombatEvent,
        pendingPoints: G.pendingPoints || 0,
        tempAllocStats: G.tempAllocStats || null,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.error('存檔失敗', e);
    }
  },

  load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return null;
    try {
      const saved = JSON.parse(raw);
      return this._migrate(saved);
    } catch (e) {
      console.error('讀檔失敗', e);
      return null;
    }
  },

  // ★ 版本遷移：補全舊存檔缺失嘅欄位
  _migrate(saved) {
    if (!saved) return null;

    if (saved.version === undefined) saved.version = 0;

    // G 層級
    if (saved.currentSeason === undefined) saved.currentSeason = 0;
    if (saved.usedEvents === undefined) saved.usedEvents = [];
    if (saved.pendingPoints === undefined) saved.pendingPoints = 0;
    if (saved.tempAllocStats === undefined) saved.tempAllocStats = null;

    // player 層級
    if (saved.player) {
      const p = saved.player;
      if (p.punchDiceType === undefined) p.punchDiceType = 8;
      if (p.reputation === undefined) p.reputation = 0;
      if (p.morality === undefined) p.morality = 0;
      if (p.contribution === undefined) p.contribution = 0;
      if (p.savedPoints === undefined) p.savedPoints = 0;
      if (p.buffs === undefined) p.buffs = {};
      if (p.isPoisoned === undefined) p.isPoisoned = 0;
      if (p.isStunned === undefined) p.isStunned = false;
      if (p.companions === undefined) p.companions = [];
      if (p.tags === undefined) p.tags = [];
      if (p.martialArts === undefined) p.martialArts = [];
      if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };
    }

    saved.version = this.VERSION;
    return saved;
  },

  hasSave() {
    return localStorage.getItem(this.KEY) !== null;
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};