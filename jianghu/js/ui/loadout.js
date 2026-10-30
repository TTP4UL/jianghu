const LoadoutUI = {
  open() {
    if (G.currentSystem === 'combat') {
      alert('戰鬥中無法切換功法！');
      return;
    }
    const modal = document.getElementById('loadoutModal');
    modal.classList.remove('hidden');
    this.render();
  },

  close() {
    document.getElementById('loadoutModal').classList.add('hidden');
  },

  render() {
    const p = G.player;
    const content = document.getElementById('loadoutContent');
    
    // 確保玩家有 loadout 結構
    if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

    const slots = [
      { key: 'attack', label: '攻擊武學 (最多 2 個)', count: 2 },
      { key: 'inner', label: '內功心法 (最多 1 個)', count: 1 },
      { key: 'utility', label: '特殊技藝 (最多 1 個)', count: 1 }
    ];

    content.innerHTML = slots.map(slot => {
      const equipped = p.loadout[slot.key] || [];
      // 已裝備區域
      const equippedHTML = Array.from({ length: slot.count }).map((_, i) => {
        const id = equipped[i];
        const art = id ? G.data.MARTIAL_ARTS[id] : null;
        return art
          ? `<div class="bg-cinnabar/20 border border-cinnabar/50 rounded p-2 text-xs cursor-pointer hover:bg-cinnabar/30 transition" onclick="LoadoutUI.unequip('${slot.key}', ${i})">
               <div class="flex justify-between items-center">
                 <span><span class="text-wuxiaGold font-bold">[${art.grade}]</span> <span class="text-parchment-100 font-bold">${art.name}</span></span>
                 <i class="fa-solid fa-xmark text-red-400"></i>
               </div>
               <div class="text-gray-400 text-[10px] mt-1">${art.desc}</div>
             </div>`
          : `<div class="bg-ink-900/50 border border-dashed border-ink-border rounded p-2 text-xs text-gray-500 text-center flex items-center justify-center h-full min-h-[60px]">
               空槽位
             </div>`;
      }).join('');

      // 可裝備區域
      const available = (p.martialArts || [])
        .filter(id => {
          const a = G.data.MARTIAL_ARTS[id];
          return a && a.slot === slot.key && !equipped.includes(id);
        })
        .map(id => {
          const a = G.data.MARTIAL_ARTS[id];
          return `<button onclick="LoadoutUI.equip('${slot.key}', '${id}')"
                    class="w-full text-left bg-ink-900 hover:bg-ink-700 border border-ink-border rounded p-2 text-xs transition">
            <div class="flex justify-between items-center">
              <span><span class="text-wuxiaGold font-bold">[${a.grade}]</span> <span class="text-parchment-200 font-bold">${a.name}</span></span>
              <i class="fa-solid fa-plus text-jade"></i>
            </div>
            <div class="text-gray-400 text-[10px] mt-1">${a.desc}</div>
          </button>`;
        }).join('');

      return `<div>
        <div class="text-xs font-bold text-parchment-200 mb-2 border-b border-ink-border pb-1">${slot.label}</div>
        <div class="space-y-2 mb-4">${equippedHTML}</div>
        <div class="text-[10px] text-gray-500 mb-1">可裝備：</div>
        <div class="space-y-1 max-h-40 overflow-y-auto pr-1">${available || '<div class="text-[10px] text-gray-600">無可用功法</div>'}</div>
      </div>`;
    }).join('');
  },

  equip(slotKey, artId) {
    const loadout = G.player.loadout[slotKey];
    const emptyIdx = loadout.indexOf(null);
    if (emptyIdx !== -1) {
      loadout[emptyIdx] = artId;
    } else {
      alert('該槽位已滿，請先卸下其他功法！');
    }
    this.render();
  },

  unequip(slotKey, idx) {
    G.player.loadout[slotKey][idx] = null;
    this.render();
  }
};