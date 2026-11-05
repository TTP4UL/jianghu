const GAME_VERSION = 'v1.0.0'; 

window.addEventListener('DOMContentLoaded', () => {
  // ★ 將版本號顯示喺畫面
  const vEl = document.getElementById('gameVersion');
  if (vEl) vEl.textContent = GAME_VERSION;

  DataLoader.init();
  
  // ★ 新增：初始化全局 Tooltip 事件委託
  if (typeof HUD !== 'undefined' && HUD.initTooltipEvents) {
    HUD.initTooltipEvents();
  }
  
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

  if (SaveSystem.hasSave()) {
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

function mainLoadGame() {
  const saved = SaveSystem.load();
  if (!saved) return alert('沒有找到存檔');
  
  G.player = saved.player;
  G.currentAge = saved.currentAge;
  G.currentSeason = saved.currentSeason || 0;
  G.usedEvents = saved.usedEvents || [];
  G.pendingPoints = saved.pendingPoints || 0;
  G.tempAllocStats = saved.tempAllocStats || null;
  
  // 舊存檔兼容：如果冇 martialArts 但 loadout 有，同步返
  if (G.player.martialArts && G.player.martialArts.length === 0 && G.player.loadout) {
    const fromLoadout = [];
    ['attack', 'inner', 'utility'].forEach(slot => {
      (G.player.loadout[slot] || []).forEach(id => {
        if (id && !fromLoadout.includes(id)) fromLoadout.push(id);
      });
    });
    G.player.martialArts = fromLoadout;
  }
  
  document.getElementById('screen-setup').classList.add('hidden');
  document.getElementById('screen-play').classList.remove('hidden');
  document.getElementById('restartBtn').classList.remove('hidden');
  document.getElementById('overviewBtn').classList.remove('hidden');
  document.getElementById('loadoutBtn').classList.remove('hidden');
  document.getElementById('ageBadge').classList.remove('hidden');
  document.getElementById('loadBtn').classList.add('hidden');
  
  HUD.render();
  
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  if (isLocal && typeof DevTools !== 'undefined') DevTools.show();
  
  // ★ 核心修正：恢復系統狀態（唔用 switchSystem('lifepath')，因為佢會重置年齡）
  if (saved.currentCombatEvent) {
    // 戰鬥中存檔 → 重啟戰鬥（敵人滿血，因為 G.enemy 冇被存）
    switchSystem('combat', { event: saved.currentCombatEvent });
  } else if (G.currentAge < 18) {
    // 13-17 歲 → 直接 runYear()，唔經 enter()（避免重置）
    G.currentSystem = 'lifepath';
    LifepathSystem.runYear();
  } else {
    // 18 歲後 → 直接 exploration
    switchSystem('exploration');
  }
}