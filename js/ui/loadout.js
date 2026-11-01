const LoadoutUI = {
  open() {
    if (!G.player) return;
    const modal = document.getElementById('loadoutModal');
    const content = document.getElementById('loadoutContent');
    const p = G.player;
    if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

    const slotsConfig = [
      { key: 'attack', name: '招式武學', limit: 2, desc: '對敵出招，消耗真氣造成殺傷' },
      { key: 'inner', name: '內功心法', limit: 1, desc: '運氣調息，提供被動護體與回氣' },
      { key: 'utility', name: '身法絕技', limit: 1, desc: '閃轉騰挪，化解危局' }
    ];

    content.innerHTML = slotsConfig.map(cfg => {
      const equipped = p.loadout[cfg.key] || [];
      
      // 1. 已裝備槽位 (紙墨風虛線框)
      const slotsHTML = Array.from({ length: cfg.limit }).map((_, i) => {
        const id = equipped[i];
        const art = id ? G.data.MARTIAL_ARTS[id] : null;
        if (art) {
          const gradeColor = {
            EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]',
            B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]', E: 'text-[#78716c]'
          }[art.grade] || 'text-[#57534e]';

          return `
            <div class="p-3 bg-white border border-[#d8ccb8] rounded-xl flex items-center justify-between shadow-xs mb-2">
              <div>
                <span class="${gradeColor} font-black font-mono">[${art.grade}]</span>
                <span class="font-black text-[#2c1f14] ml-1">${art.name}</span>
                <div class="text-[11px] text-[#78614c] mt-0.5">${art.desc || ''}</div>
              </div>
              <button onclick="LoadoutUI.unequip('${cfg.key}', ${i})" class="text-xs px-2.5 py-1 rounded-lg bg-[#fff1f2] border border-[#fecdd3] text-[#b91c1c] font-bold hover:bg-[#ffe4e6] cursor-pointer">
                卸下
              </button>
            </div>`;
        }
        return `
          <div class="p-4 border-2 border-dashed border-[#d8ccb8] bg-[#fbf9f4] rounded-xl text-center text-xs text-[#8a7561] font-bold mb-2">
            【 空置槽位 】
          </div>`;
      }).join('');

      // 2. 背包中可裝備功法
      const available = (p.martialArts || []).filter(id => {
        const a = G.data.MARTIAL_ARTS[id];
        return a && a.slot === cfg.key && !equipped.includes(id);
      });

      const poolHTML = available.length ? available.map(id => {
        const art = G.data.MARTIAL_ARTS[id];
        return `
          <div class="p-2.5 bg-white border border-[#e5dcce] rounded-lg flex items-center justify-between text-xs mb-1.5 shadow-xs">
            <span class="font-bold text-[#2c1f14]">${art.name}</span>
            <button onclick="LoadoutUI.equip('${cfg.key}', '${id}')" class="text-xs px-2.5 py-0.5 rounded bg-[#f5ede0] border border-[#cfc0a9] text-[#2c1f14] font-bold hover:bg-[#e8decb] cursor-pointer">
              裝備
            </button>
          </div>`;
      }).join('') : '<div class="text-xs text-[#8a7561] italic py-1">暫無可用功法</div>';

      return `
        <div class="p-4 bg-[#f8f5ee] border border-[#d8ccb8] rounded-xl">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-black text-sm text-[#2c1f14]">${cfg.name}（最多 ${cfg.limit} 個）</h4>
          </div>
          <p class="text-[11px] text-[#78614c] mb-3">${cfg.desc}</p>
          <div class="mb-3">${slotsHTML}</div>
          <div class="pt-2.5 border-t border-[#e5dcce]">
            <span class="text-[11px] font-black text-[#594432] block mb-1.5">【 可裝備 】</span>
            <div>${poolHTML}</div>
          </div>
        </div>`;
    }).join('');

    modal.classList.remove('hidden');
  },

  equip(slotKey, artId) {
    const p = G.player;
    const list = p.loadout[slotKey];
    const emptyIndex = list.indexOf(null);
    if (emptyIndex !== -1) {
      list[emptyIndex] = artId;
    } else {
      list[0] = artId; // 頂替第一個
    }
    this.open();
    SaveSystem.save();
  },

  unequip(slotKey, index) {
    G.player.loadout[slotKey][index] = null;
    this.open();
    SaveSystem.save();
  },

  close() {
    document.getElementById('loadoutModal').classList.add('hidden');
  }
};