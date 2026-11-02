const DevTools = {
  init() {
    if (document.getElementById('devBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'devBtn';
    btn.className = 'fixed bottom-4 right-4 z-50 bg-[#a82d25] hover:bg-[#851e18] text-white p-3 rounded-full shadow-lg transition hidden border-2 border-[#fef3c7]/60';
    btn.innerHTML = '<i class="fa-solid fa-wrench"></i>';
    btn.onclick = () => this.toggle();
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'devPanel';
    // ★ 將 UI 換成與遊戲一致的宣紙淺色風
    panel.className = 'fixed bottom-16 right-4 z-50 w-80 wuxia-panel-box rounded-xl p-4 shadow-2xl hidden flex-col space-y-3 text-xs font-serif border border-[#a89680]';
    
    panel.innerHTML = `
      <div class="flex justify-between items-center border-b border-[#d8ccb8] pb-2">
        <span class="font-black text-[#a82d25]"><i class="fa-solid fa-code mr-1"></i>開發者後台</span>
        <button onclick="DevTools.toggle()" class="text-[#78614c] hover:text-[#a82d25]"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <!-- 數值調整 -->
      <div class="grid grid-cols-2 gap-2">
        <button onclick="DevTools.addGold()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">💰 +1000 兩</button>
        <button onclick="DevTools.heal()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">💖 滿血滿氣</button>
        <button onclick="DevTools.maxStats()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">🌟 屬性全滿</button>
        <button onclick="DevTools.setAge(18)" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">⏩ 升到 18 歲</button>
      </div>

      <!-- ★ 新增：強制骰子模式 -->
      <div class="space-y-1 pt-1 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">D20 檢定模式</label>
        <div class="flex gap-1 mt-1">
          <button onclick="DevTools.setDiceMode('random')" id="diceMode-random" class="flex-1 py-1.5 border border-[#cfc0a9] rounded bg-[#a82d25] text-white font-bold transition">正常</button>
          <button onclick="DevTools.setDiceMode('crit')" id="diceMode-crit" class="flex-1 py-1.5 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">大成功 (20)</button>
          <button onclick="DevTools.setDiceMode('fail')" id="diceMode-fail" class="flex-1 py-1.5 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">大失敗 (1)</button>
        </div>
      </div>

      <!-- 獲得武學 -->
      <div class="space-y-1 pt-1 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">獲得武學 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devArtInput" placeholder="例如: s_dugu" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.addArt()" class="bg-[#a82d25] hover:bg-[#851e18] px-3 rounded text-white font-bold transition">學</button>
        </div>
      </div>

      <!-- 獲得同伴 -->
      <div class="space-y-1">
        <label class="text-[#594432] font-bold">獲得同伴 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devCompInput" placeholder="例如: comp_dongxie" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.addCompanion()" class="bg-[#1e6b4d] hover:bg-[#155038] px-3 rounded text-white font-bold transition">招</button>
        </div>
      </div>

      <!-- 跳轉事件 -->
      <div class="space-y-1">
        <label class="text-[#594432] font-bold">跳轉事件 (輸入 Event ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devEventInput" placeholder="例如: act3_boss" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.jumpEvent()" class="bg-[#b45309] hover:bg-[#92400e] text-white px-3 rounded font-bold transition">跳</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  },

  show() { 
    const b = document.getElementById('devBtn');
    if (b) b.classList.remove('hidden'); 
    this.updateDiceUI(); // 同步按鈕狀態
  },
  
  hide() { 
    const b = document.getElementById('devBtn');
    const p = document.getElementById('devPanel');
    if (b) b.classList.add('hidden'); 
    if (p) p.classList.add('hidden'); 
  },
  
  toggle() { 
    const p = document.getElementById('devPanel');
    if (p) p.classList.toggle('hidden'); 
  },

  enable() {
    this.init();
    this.show();
    console.log('%c[系統] 開發者模式已強制開啟！', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  },

  requirePlayer() {
    if (!G.player) { alert('請先創建角色！'); return false; }
    return true;
  },
  
  // ★ 新增：切換骰子模式
  setDiceMode(mode) {
    G.forceDiceMode = mode;
    this.updateDiceUI();
    const modeNames = { random: '正常隨機', crit: '強制大成功 (20)', fail: '強制大失敗 (1)' };
    console.log(`[Dev] 骰子模式切換為: ${modeNames[mode]}`);
  },

  // ★ 新增：更新骰子 UI 狀態
  updateDiceUI() {
    const modes = ['random', 'crit', 'fail'];
    modes.forEach(m => {
      const btn = document.getElementById(`diceMode-${m}`);
      if (!btn) return;
      if (G.forceDiceMode === m) {
        btn.className = 'flex-1 py-1.5 border border-[#cfc0a9] rounded bg-[#a82d25] text-white font-bold transition';
      } else {
        btn.className = 'flex-1 py-1.5 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition';
      }
    });
  },

  addGold() {
    if (this.requirePlayer()) { G.player.gold += 1000; HUD.render(); SaveSystem.save(); }
  },
  
  heal() {
    if (this.requirePlayer()) { 
      G.player.hp = G.player.maxHp; 
      G.player.pos = G.player.maxPos; 
      G.player.qi = G.player.maxQi; 
      HUD.updateGauges(); SaveSystem.save(); 
    }
  },
  
  maxStats() {
    if (this.requirePlayer()) { 
      const oldConMod = Math.floor((G.player.stats.con - 10) / 2);
      const oldIntMod = Math.floor((G.player.stats.int - 10) / 2);
      
      Object.keys(G.player.stats).forEach(k => G.player.stats[k] = 20);
      
      const newConMod = Math.floor((20 - 10) / 2);
      const newDexMod = Math.floor((20 - 10) / 2);
      const newIntMod = Math.floor((20 - 10) / 2);

      G.player.ac = 10 + newDexMod;

      // 更新血量
      const baseHp = G.player.maxHp - (oldConMod * 3);
      G.player.maxHp = baseHp + (newConMod * 3);
      G.player.hp = G.player.maxHp;

      // ★ 新增：更新架勢
      const basePos = G.player.maxPos - (Math.max(0, oldIntMod) * 2);
      G.player.maxPos = basePos + (Math.max(0, newIntMod) * 2);
      G.player.pos = G.player.maxPos;
      
      HUD.render(); 
      SaveSystem.save(); 
    }
  },
  
  setAge(age) {
    if (this.requirePlayer()) {
      G.currentAge = age;
      HUD.render();
      SaveSystem.save();
      alert(`年齡已設定為 ${age} 歲。請手動刷新或跳轉事件。`);
    }
  },

  addArt() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devArtInput').value.trim();
    if (!G.data.MARTIAL_ARTS[id]) return alert('無此武學 ID，請確認 Google Sheet 或 fallback.js');
    if (!G.player.martialArts.includes(id)) {
      G.player.martialArts.push(id);
      HUD.log('dice', `【Dev】獲得武學：${G.data.MARTIAL_ARTS[id].name}`);
      HUD.render(); SaveSystem.save();
    }
  },

  addCompanion() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devCompInput').value.trim();
    if (!G.data.COMPANIONS[id]) return alert('無此同伴 ID');
    if (G.player.companions.length >= 2) return alert('同伴已滿！');
    if (!G.player.companions.includes(id)) {
      G.player.companions.push(id);
      HUD.log('dice', `【Dev】招募同伴：${G.data.COMPANIONS[id].name}`);
      HUD.render(); SaveSystem.save();
    }
  },

  jumpEvent() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devEventInput').value.trim();
    if (!G.data.EVENTS[id]) return alert('無此事件 ID');
    
    document.getElementById('screen-setup').classList.add('hidden');
    document.getElementById('screen-play').classList.remove('hidden');
    switchSystem('events', { startEvent: id });
  }
};