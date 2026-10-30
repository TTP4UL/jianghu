const GAME_DATA_URL = 'https://script.google.com/macros/s/AKfycbwevvcYed2tpoaLp5bSao0H5lY1dv9kxZXELsPke8dc6TSkU4ki8PV7KOtWYFNFXQL7/exec';

const DataLoader = {
  // ★ 新增：一開始即刻用本地數據，唔使等
  init() {
    this._apply(FALLBACK_DATA);
    console.log('[DataLoader] 已載入本地基礎數據 (瞬間開啟)');
    
    // 同時喺背景拉取 Google Sheet
    this.fetchRemote();
  },

  // ★ 新增：背景拉取，唔阻塞畫面
  async fetchRemote() {
    if (!GAME_DATA_URL || GAME_DATA_URL.includes('PASTE_YOUR')) return;
    try {
      const resp = await fetch(GAME_DATA_URL);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      if (!data.ORIGINS || Object.keys(data.ORIGINS).length === 0) throw new Error('空數據');
      
      this._apply(data);
      console.log('[DataLoader] ✅ 雲端數據已更新！');
      
      // ★ 關鍵：如果玩家已經喺 Step 2 等緊，即刻幫佢畫返出嚟！
      if (G.currentSystem === 'characterCreation' && CharacterCreationSystem.state.step === 2) {
        CharacterCreationSystem.renderOrigins();
      }
      
    } catch (err) {
      console.warn('[DataLoader] ❌ 雲端加載失敗:', err.message);
      // 如果失敗但玩家等緊，就用 fallback 畫
      if (G.currentSystem === 'characterCreation' && CharacterCreationSystem.state.step === 2) {
        CharacterCreationSystem.renderOrigins();
      }
    }
  },

  _apply(d) {
    G.data.TAGS = d.TAGS || {};
    G.data.ORIGINS = d.ORIGINS || {};
    G.data.SECTS = d.SECTS || {};
    G.data.MARTIAL_ARTS = d.MARTIAL_ARTS || {};
    G.data.LIFEPATH_EVENTS = d.LIFEPATH_EVENTS || {};
    G.data.LIFEPATH_CHOICES = d.LIFEPATH_CHOICES || {};
    G.data.EVENTS = d.EVENTS || {};
    G.data.COMPANIONS = d.COMPANIONS || {};
  }
};