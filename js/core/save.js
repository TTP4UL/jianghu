const SaveSystem = {
  KEY: 'jianghu_save_v1',

  save() {
    if (!G.player) return;
    try {
      const data = {
        player: G.player,
        currentAge: G.currentAge,
        usedEvents: G.usedEvents,
        currentSystem: G.currentSystem,
        currentCombatEvent: G.currentCombatEvent,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(this.KEY, JSON.stringify(data));
      // 喺頂部顯示個小提示（可選）
      // console.log('[系統] 遊戲已自動存檔');
    } catch (e) {
      console.error('存檔失敗', e);
    }
  },

  load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};