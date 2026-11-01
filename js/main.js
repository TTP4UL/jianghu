const GAME_VERSION = 'v1.0.0'; 

window.addEventListener('DOMContentLoaded', () => {
  // ★ 將版本號顯示喺畫面
  const vEl = document.getElementById('gameVersion');
  if (vEl) vEl.textContent = GAME_VERSION;

  DataLoader.init();
  
  // 判斷是否本地端 (localhost)
  const isLocal = window.location.hostname === '127.0.0.1' || 
                  window.location.hostname === 'localhost';
                  
  // ★ 初始化並顯示開發者工具
  if (typeof DevTools !== 'undefined') {
    DevTools.init();
    if (isLocal) {
      DevTools.show(); // ★ 呢句係關鍵！本地端自動顯示
    }
  }

  const saved = SaveSystem.load();
  if (saved) {
    document.getElementById('loadBtn').classList.remove('hidden');
  }
  
  switchSystem('characterCreation');

  // ★ 秘密功能：喺網頁任何地方快速撳鍵盤「d e v」，就會強制彈出開發者工具 (防君子不防小人)
  let keys = '';
  window.addEventListener('keydown', (e) => {
    keys += e.key.toLowerCase();
    if (keys.includes('dev')) {
      if (typeof DevTools !== 'undefined') DevTools.enable();
      keys = '';
    }
    if (keys.length > 3) keys = keys.slice(-3);
  });
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
  if (isLocal && typeof DevTools !== 'undefined') DevTools.show();

  if (saved.currentAge >= 18 && !saved.currentCombatEvent) {
    switchSystem('events', { startEvent: 'act1_inn' });
  } else if (saved.currentCombatEvent) {
    switchSystem('combat', { event: saved.currentCombatEvent });
  } else {
    switchSystem('lifepath');
  }
}