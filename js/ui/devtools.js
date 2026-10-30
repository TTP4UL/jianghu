const DevTools = {
  init() {
    if (document.getElementById('devBtn')) return; // 防止重複建立

    const btn = document.createElement('button');
    btn.id = 'devBtn';
    btn.className = 'fixed bottom-4 right-4 z-50 bg-red-800 hover:bg-red-700 text-white p-3 rounded-full shadow-2xl transition hidden';
    btn.innerHTML = '<i class="fa-solid fa-wrench"></i>';
    btn.onclick = () => this.toggle();
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'devPanel';
    panel.className = 'fixed bottom-16 right-4 z-50 w-80 bg-ink-800 border-2 border-red-800 rounded-xl p-4 shadow-2xl hidden flex-col space-y-3 text-xs';
    panel.innerHTML = `
      <div class="flex justify-between items-center border-b border-ink-border pb-2">
        <span class="font-bold text-red-400"><i class="fa-solid fa-code mr-1"></i>開發者後台</span>
        <button onclick="DevTools.toggle()" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <button onclick="DevTools.addGold()" class="bg-ink-900 hover:bg-ink-700 border border-ink-border p-2 rounded">💰 +1000 兩</button>
        <button onclick="DevTools.heal()" class="bg-ink-900 hover:bg-ink-700 border border-ink-border p-2 rounded">💖 滿血滿氣</button>
        <button onclick="DevTools.maxStats()" class="bg-ink-900 hover:bg-ink-700 border border-ink-border p-2 rounded">🌟 屬性全滿</button>
        <button onclick="DevTools.setAge(18)" class="bg-ink-900 hover:bg-ink-700 border border-ink-border p-2 rounded">⏩ 升到 18 歲</button>
      </div>

      <div class="space-y-1">
        <label class="text-gray-400">獲得武學 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devArtInput" placeholder="例如: s_dugu" class="flex-1 bg-ink-900 border border-ink-border rounded p-1.5 text-white">
          <button onclick="DevTools.addArt()" class="bg-cinnabar hover:bg-cinnabar-light px-3 rounded text-white">學</button>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-gray-400">獲得同伴 (輸入 ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devCompInput" placeholder="例如: comp_dongxie" class="flex-1 bg-ink-900 border border-ink-border rounded p-1.5 text-white">
          <button onclick="DevTools.addCompanion()" class="bg-jade hover:bg-jade-dark px-3 rounded text-white">招募</button>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-gray-400">跳轉事件 (輸入 Event ID)</label>
        <div class="flex gap-1">
          <input type="text" id="devEventInput" placeholder="例如: act3_boss" class="flex-1 bg-ink-900 border border-ink-border rounded p-1.5 text-white">
          <button onclick="DevTools.jumpEvent()" class="bg-wuxiaGold hover:bg-wuxiaGold-dark text-black px-3 rounded font-bold">跳</button>
        </div>
      </div>

      <div class="border-t border-ink-border pt-2 text-[10px] text-gray-500">
        快捷鍵：撳一下右下角 🔧 圖示開關
      </div>
    `;
    document.body.appendChild(panel);
  },

  show() { 
    const b = document.getElementById('devBtn');
    if (b) b.classList.remove('hidden'); 
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
      Object.keys(G.player.stats).forEach(k => G.player.stats[k] = 20);
      G.player.maxHp += 50; G.player.hp = G.player.maxHp;
      HUD.render(); SaveSystem.save(); 
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