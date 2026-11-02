// ★ 確保你有呢句！將呢個 URL 換成你自己嘅 Apps Script 鏈接
const GAME_DATA_URL = 'https://script.google.com/macros/s/AKfycbwevvcYed2tpoaLp5bSao0H5lY1dv9kxZXELsPke8dc6TSkU4ki8PV7KOtWYFNFXQL7/exec';

const DataLoader = {
  init() {
    // 1. 即刻載入本地 fallback 數據（0.01 秒）
    this._apply(FALLBACK_DATA);
    console.log('[DataLoader] 已載入本地數據 (fallback.js)');

    // 2. 判斷係咪喺開發環境 (localhost / 127.0.0.1)
    const isDev = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    
    if (isDev && GAME_DATA_URL && !GAME_DATA_URL.includes('PASTE_YOUR')) {
      console.log('[DataLoader] 開發環境：開始從 Google Sheet 獲取最新數據...');
      this.fetchRemote(); // 開發時才拉 Sheet
    } else {
      console.log('[DataLoader] 正式環境：直接使用本地數據，極速開局！');
    }
  },

  async fetchRemote() {
    try {
      const resp = await fetch(GAME_DATA_URL);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      
      if (!data.ORIGINS || Object.keys(data.ORIGINS).length === 0) {
        throw new Error('Google Sheet 數據為空');
      }
      
      this._apply(data);
      console.log('[DataLoader] ✅ 雲端數據已更新！');
      
      // 如果你在創角畫面，重新刷新 UI
      if (G.currentSystem === 'characterCreation' && typeof CharacterCreationSystem !== 'undefined') {
        CharacterCreationSystem.refreshUI();
      }
    } catch (err) {
      console.warn('[DataLoader] ❌ 雲端加載失敗，繼續使用本地數據:', err.message);
    }
  },

  _apply(d) {
    G.data.TAGS = d.TAGS || {};
    G.data.ORIGINS = d.ORIGINS || {};
    G.data.SECTS = d.SECTS || {};
    G.data.MARTIAL_ARTS = d.MARTIAL_ARTS || {};
    G.data.EVENTS = d.EVENTS || {};
    G.data.COMPANIONS = d.COMPANIONS || {};
  }
};