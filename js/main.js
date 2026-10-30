window.addEventListener('DOMContentLoaded', () => {
  // ★ 1. 瞬間載入本地數據（移除 await，唔使等雲端）
  DataLoader.init();
  
  // 2. 檢查是否本地環境，載入 DevTools
  const isLocal = window.location.hostname === '127.0.0.1' || 
                  window.location.hostname === 'localhost';
  if (isLocal) {
    DevTools.init();
  }

  // 3. 檢查存檔
  const saved = SaveSystem.load();
  if (saved) {
    document.getElementById('loadBtn').classList.remove('hidden');
  }
  
  // ★ 4. 即刻切換到創角系統（0 秒開啟）
  switchSystem('characterCreation');
});

// ★ 全域讀檔函數
function mainLoadGame() {
  const saved = SaveSystem.load();
  if (!saved) return alert('沒有找到存檔');
  
  G.player = saved.player;
  G.currentAge = saved.currentAge;
  G.usedEvents = saved.usedEvents || [];
  
  document.getElementById('screen-setup').classList.add('hidden');
  document.getElementById('screen-play').classList.remove('hidden');
  document.getElementById('restartBtn').classList.remove('hidden');
  document.getElementById('overviewBtn').classList.remove('hidden');
  document.getElementById('loadoutBtn').classList.remove('hidden');
  document.getElementById('ageBadge').classList.remove('hidden');
  document.getElementById('loadBtn').classList.add('hidden');

  HUD.render();
  
  // 如果是本地端，顯示開發者按鈕
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  if (isLocal) DevTools.show();

  if (saved.currentAge >= 18 && !saved.currentCombatEvent) {
    switchSystem('events', { startEvent: 'act1_inn' });
  } else if (saved.currentCombatEvent) {
    switchSystem('combat', { event: saved.currentCombatEvent });
  } else {
    switchSystem('lifepath');
  }
}