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
    // ★ 判斷是否為正式環境 (只要不是 localhost/127.0.0.1 就是正式環境)
    const isProd = window.location.hostname !== '127.0.0.1' && 
                   window.location.hostname !== 'localhost' &&
                   !window.location.protocol.includes('file'); // 防止本地直接開 HTML 也觸發過濾

    console.log(`[DataLoader] 當前環境: ${isProd ? '🚀 正式環境 (將過濾 test_)' : '🛠️ 開發環境 (不過濾)'}`);

    // 輔助過濾函數：兼容對象和陣列
    const filterData = (data) => {
      if (!data || !isProd) return data || {};
      
      // 如果是陣列 (Array)
      if (Array.isArray(data)) {
        return data.filter(item => {
          const id = String(item.id || '').toLowerCase();
          return !id.startsWith('test_') && !id.startsWith('dev_');
        });
      }
      
      // 如果是對象 (Object)
      if (typeof data === 'object') {
        const filtered = {};
        Object.keys(data).forEach(key => {
          const lowerKey = key.toLowerCase();
          if (!lowerKey.startsWith('test_') && !lowerKey.startsWith('dev_')) {
            filtered[key] = data[key];
          }
        });
        return filtered;
      }
      return data;
    };

    // 套用過濾
    G.data.TAGS = filterData(d.TAGS);
    G.data.ORIGINS = filterData(d.ORIGINS);
    G.data.SECTS = filterData(d.SECTS);
    G.data.MARTIAL_ARTS = filterData(d.MARTIAL_ARTS);
    G.data.LIFEPATH_EVENTS = filterData(d.LIFEPATH_EVENTS);
    G.data.LIFEPATH_CHOICES = filterData(d.LIFEPATH_CHOICES);
    G.data.EVENTS = filterData(d.EVENTS);
    G.data.COMPANIONS = filterData(d.COMPANIONS);
  },
};