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
    panel.className = 'fixed bottom-16 right-4 z-50 w-80 max-h-[85vh] overflow-y-auto custom-scrollbar wuxia-panel-box rounded-xl p-4 shadow-2xl hidden flex-col space-y-3 text-xs font-serif border border-[#a89680]';
    
    panel.innerHTML = `
      <div class="flex justify-between items-center border-b border-[#d8ccb8] pb-2">
        <span class="font-black text-[#a82d25]"><i class="fa-solid fa-code mr-1"></i>開發者後台</span>
        <button onclick="DevTools.toggle()" class="text-[#78614c] hover:text-[#a82d25]"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <!-- 基礎數值 -->
      <div class="grid grid-cols-2 gap-2">
        <button onclick="DevTools.addGold()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">💰 +1000 兩</button>
        <button onclick="DevTools.heal()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">💖 滿血滿氣</button>
        <button onclick="DevTools.maxStats()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">🌟 屬性全滿</button>
        <button onclick="DevTools.addReputation()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-2 rounded transition">🏆 威望+貢獻+50</button>
      </div>

      <!-- ★ 新增：名聲與正邪控制 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">名聲與正邪 (測試矩陣稱號)</label>
        <div class="flex gap-1 mt-1">
          <input type="number" id="devRepInput" placeholder="名聲 (-100~100)" class="flex-1 w-0 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <input type="number" id="devMorInput" placeholder="正邪 (-100~100)" class="flex-1 w-0 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.setAlignment()" class="bg-[#1e6b4d] hover:bg-[#155038] px-3 rounded text-white font-bold transition">設</button>
        </div>
        <div class="grid grid-cols-2 gap-1 mt-1.5">
          <button onclick="DevTools.quickAlign(50, 50)" class="bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] py-1 rounded font-bold hover:bg-[#d1fae5] transition">名門大俠</button>
          <button onclick="DevTools.quickAlign(-50, -50)" class="bg-[#fef2f2] border border-[#fca5a5] text-[#b91c1c] py-1 rounded font-bold hover:bg-[#fee2e2] transition">魔道巨擘</button>
          <button onclick="DevTools.quickAlign(50, -50)" class="bg-[#fffbeb] border border-[#fde68a] text-[#b45309] py-1 rounded font-bold hover:bg-[#fef3c7] transition">偽善君子</button>
          <button onclick="DevTools.quickAlign(-50, 50)" class="bg-[#eff6ff] border border-[#bfdbfe] text-[#1d4ed8] py-1 rounded font-bold hover:bg-[#dbeafe] transition">孤膽俠客</button>
          <button onclick="DevTools.quickAlign(0, 50)" class="bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] py-1 rounded font-bold hover:bg-[#f1f5f9] transition">隱世高人</button>
          <button onclick="DevTools.quickAlign(0, -50)" class="bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] py-1 rounded font-bold hover:bg-[#f1f5f9] transition">隱世邪修</button>
        </div>
      </div>

      <!-- 強制骰子模式 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">D20 檢定模式</label>
        <div class="flex flex-wrap gap-1 mt-1">
          <button onclick="DevTools.setDiceMode('random')" id="diceMode-random" class="flex-1 py-1 border border-[#cfc0a9] rounded bg-[#a82d25] text-white font-bold transition">正常</button>
          <button onclick="DevTools.setDiceMode('crit')" id="diceMode-crit" class="flex-1 py-1 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">20</button>
          <button onclick="DevTools.setDiceMode('nineteen')" id="diceMode-nineteen" class="flex-1 py-1 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">19</button>
          <button onclick="DevTools.setDiceMode('two')" id="diceMode-two" class="flex-1 py-1 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">2</button>
          <button onclick="DevTools.setDiceMode('fail')" id="diceMode-fail" class="flex-1 py-1 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition">1</button>
        </div>
      </div>

      <!-- 獲得 / 移除 Tag -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">Tag 控制 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devTagInput" placeholder="例如: sword_master" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.addTag()" class="bg-[#1e6b4d] hover:bg-[#155038] px-3 rounded text-white font-bold transition">加</button>
          <button onclick="DevTools.removeTag()" class="bg-[#b91c1c] hover:bg-[#991b1b] px-3 rounded text-white font-bold transition">減</button>
        </div>
      </div>

      <!-- 獲得武學 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">獲得武學 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devArtInput" placeholder="例如: s_dugu" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.addArt()" class="bg-[#a82d25] hover:bg-[#851e18] px-3 rounded text-white font-bold transition">學</button>
        </div>
      </div>

      <!-- 獲得同伴 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">獲得同伴 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devCompInput" placeholder="例如: comp_dongxie" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.addCompanion()" class="bg-[#1e6b4d] hover:bg-[#155038] px-3 rounded text-white font-bold transition">招</button>
        </div>
      </div>

      <!-- 跳轉事件 / 年齡 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <label class="text-[#594432] font-bold">跳轉事件 / 年齡控制</label>
        <div class="flex gap-1 mb-1">
          <input type="text" id="devEventInput" placeholder="Event ID 例如: act3_boss" class="flex-1 bg-white border border-[#cfc0a9] rounded p-1.5 text-[#2c1f14] focus:outline-none focus:border-[#a82d25]">
          <button onclick="DevTools.jumpEvent()" class="bg-[#b45309] hover:bg-[#92400e] text-white px-3 rounded font-bold transition">跳</button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="DevTools.setAge(18)" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-1.5 rounded transition">⏩ 升到 18 歲</button>
          <button onclick="DevTools.nextSeason()" class="bg-[#f5ede0] hover:bg-[#e8decb] border border-[#cfc0a9] text-[#2c1f14] p-1.5 rounded transition">⏭️ 下一季</button>
        </div>
      </div>

      <!-- 強制重載 -->
      <div class="space-y-1 pt-2 border-t border-[#d8ccb8]">
        <button onclick="DataLoader.init()" class="w-full bg-[#0369a1] hover:bg-[#075985] text-white font-bold p-2 rounded transition">
          <i class="fa-solid fa-rotate mr-1"></i> 強制重載雲端數據
        </button>
        <button onclick="localStorage.clear(); location.reload();" class="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold p-2 rounded transition mt-1">
          <i class="fa-solid fa-trash mr-1"></i> 清空存檔並重開
        </button>
      </div>
    `;
    document.body.appendChild(panel);
  },

  show() { 
    const b = document.getElementById('devBtn');
    if (b) b.classList.remove('hidden'); 
    this.updateDiceUI();
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

  // === 名聲與正邪控制 ===
  setAlignment() {
    if (!this.requirePlayer()) return;
    const rep = Number(document.getElementById('devRepInput').value);
    const mor = Number(document.getElementById('devMorInput').value);
    
    if (isNaN(rep) || isNaN(mor)) return alert('請輸入數字！');
    
    G.player.reputation = Math.max(-100, Math.min(100, rep));
    G.player.morality = Math.max(-100, Math.min(100, mor));
    
    HUD.render();
    SaveSystem.save();
    HUD.log('dice', `【Dev】設定名聲: ${G.player.reputation}，正邪: ${G.player.morality}`);
  },

  quickAlign(rep, mor) {
    if (!this.requirePlayer()) return;
    G.player.reputation = rep;
    G.player.morality = mor;
    HUD.render();
    SaveSystem.save();
    HUD.log('dice', `【Dev】快速設定稱號測試：名聲 ${rep} / 正邪 ${mor}`);
  },

  // === 骰子控制 ===
  setDiceMode(mode) {
    G.forceDiceMode = mode;
    this.updateDiceUI();
    console.log(`[Dev] 骰子模式切換為: ${mode}`);
  },

  updateDiceUI() {
    const modes = ['random', 'crit', 'nineteen', 'two', 'fail'];
    modes.forEach(m => {
      const btn = document.getElementById(`diceMode-${m}`);
      if (!btn) return;
      if (G.forceDiceMode === m) {
        btn.className = 'flex-1 py-1 border border-[#cfc0a9] rounded bg-[#a82d25] text-white font-bold transition';
      } else {
        btn.className = 'flex-1 py-1 border border-[#cfc0a9] rounded bg-[#f5ede0] text-[#2c1f14] hover:bg-[#e8decb] transition';
      }
    });
  },

  // === 資源控制 ===
  addGold() { if (this.requirePlayer()) { G.player.gold += 1000; HUD.render(); SaveSystem.save(); } },
  heal() { if (this.requirePlayer()) { G.player.hp = G.player.maxHp; G.player.pos = G.player.maxPos; G.player.qi = G.player.maxQi; HUD.updateGauges(); SaveSystem.save(); } },
  maxStats() { 
    if (this.requirePlayer()) { 
      Object.keys(G.player.stats).forEach(k => G.player.stats[k] = 25);
      G.player.maxHp += 50; G.player.hp = G.player.maxHp;
      HUD.render(); SaveSystem.save(); 
    } 
  },
  addReputation() { if (this.requirePlayer()) { G.player.reputation = (G.player.reputation||0) + 50; G.player.contribution = (G.player.contribution||0) + 50; HUD.render(); SaveSystem.save(); } },

  // === Tag 控制 ===
  addTag() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devTagInput').value.trim();
    if (!G.data.TAGS[id]) return alert('無此 Tag ID');
    if (!G.player.tags.includes(id)) {
      G.player.tags.push(id);
      HUD.log('dice', `【Dev】獲得 Tag：${G.data.TAGS[id].name}`);
      HUD.render(); SaveSystem.save();
    }
  },
  removeTag() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devTagInput').value.trim();
    const idx = G.player.tags.indexOf(id);
    if (idx !== -1) {
      const name = G.data.TAGS[id]?.name || id;
      G.player.tags.splice(idx, 1);
      HUD.log('dice', `【Dev】移除 Tag：${name}`);
      HUD.render(); SaveSystem.save();
    }
  },

  // === 武學與同伴 ===
  addArt() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devArtInput').value.trim();
    if (!G.data.MARTIAL_ARTS[id]) return alert('無此武學 ID');
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

  // === 流程控制 ===
  jumpEvent() {
    if (!this.requirePlayer()) return;
    const id = document.getElementById('devEventInput').value.trim();
    if (!G.data.EVENTS[id]) return alert('無此事件 ID');
    document.getElementById('screen-setup').classList.add('hidden');
    document.getElementById('screen-play').classList.remove('hidden');
    switchSystem('events', { startEvent: id });
  },
  setAge(age) {
    if (this.requirePlayer()) {
      G.currentAge = age;
      HUD.render();
      SaveSystem.save();
      alert(`年齡已設定為 ${age} 歲。請手動刷新或跳轉事件。`);
    }
  },
  nextSeason() {
    if (this.requirePlayer() && typeof ExplorationSystem !== 'undefined') {
      ExplorationSystem.nextSeason();
    }
  }
};