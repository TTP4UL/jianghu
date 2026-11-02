const LoadoutUI = {
  open() {
    if (!G.player) return;
    document.getElementById('loadoutModal').classList.remove('hidden');
    this.render();
  },

  // ★ 優化：縮小標籤尺寸，並確保解析所有效果
  getArtStats(art) {
    if (!art) return '';
    let stats = [];
    
    // 1. 招式武學的屬性
    if (art.slot === 'attack') {
      const cost = art.qiCost || 2;
      stats.push(`<span class="bg-[#f5ede0] text-[#78614c] px-1 py-0.5 rounded text-[10px] border border-[#d8ccb8]">氣:${cost}</span>`);
      
      if (art.fixedDamage) {
        stats.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-1 py-0.5 rounded text-[10px] border border-[#fca5a5]">傷:${art.fixedDamage}(固)</span>`);
      } else if (art.basePower) {
        const diceCount = Math.max(1, Math.floor(art.basePower / 10));
        const diceType = art.diceType || 8;
        stats.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-1 py-0.5 rounded text-[10px] border border-[#fca5a5]">傷:${diceCount}d${diceType}</span>`);
      }
      
      if (art.hits && Number(art.hits) > 1) {
        stats.push(`<span class="bg-[#fff7ed] text-[#c2410c] px-1 py-0.5 rounded text-[10px] border border-[#fdba74]">${art.hits}連</span>`);
      }
      
      if (art.specialEffect) {
        String(art.specialEffect).split('|').forEach(e => {
          const eff = e.trim();
          if (eff.includes('pierce')) stats.push(`<span class="bg-[#faf5ff] text-[#7e22ce] px-1 py-0.5 rounded text-[10px] border border-[#d8b4fe]">破防</span>`);
          if (eff.includes('stun')) stats.push(`<span class="bg-[#fefce8] text-[#854d0e] px-1 py-0.5 rounded text-[10px] border border-[#fde047]">眩暈</span>`);
          if (eff.includes('poison')) {
            const match = eff.match(/poison:(\d+):(\d+)/);
            if (match) stats.push(`<span class="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded text-[10px] border border-[#a7f3d0]">毒(${match[1]}回合)</span>`);
            else stats.push(`<span class="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded text-[10px] border border-[#a7f3d0]">中毒</span>`);
          }
          if (eff.includes('heal')) stats.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-1 py-0.5 rounded text-[10px] border border-[#fca5a5]">吸血</span>`);
        });
      }
    }

    // 2. 內功的屬性
    if (art.slot === 'inner' && art.innerEffect) {
      String(art.innerEffect).split('|').forEach(e => {
        const [key, val] = e.split(':');
        const k = key.trim().toLowerCase(); // 確保大小寫兼容
        const v = val ? val.trim() : '';
        
        if (k === 'regen' || k === 'hp_regen') stats.push(`<span class="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded text-[10px] border border-[#a7f3d0]">回血${v}</span>`);
        if (k === 'qi_regen') stats.push(`<span class="bg-[#eff6ff] text-[#1d4ed8] px-1 py-0.5 rounded text-[10px] border border-[#bfdbfe]">回氣${v}</span>`);
        if (k === 'pos_regen') stats.push(`<span class="bg-[#fffbeb] text-[#b45309] px-1 py-0.5 rounded text-[10px] border border-[#fde68a]">回架${v}</span>`);
        if (k === 'maxhp') stats.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-1 py-0.5 rounded text-[10px] border border-[#fca5a5]">血上限${v}</span>`);
        if (k === 'maxqi') stats.push(`<span class="bg-[#eff6ff] text-[#1d4ed8] px-1 py-0.5 rounded text-[10px] border border-[#bfdbfe]">氣上限${v}</span>`);
        if (k === 'maxpos') stats.push(`<span class="bg-[#fffbeb] text-[#b45309] px-1 py-0.5 rounded text-[10px] border border-[#fde68a]">架上限${v}</span>`);
      });
    }

    // ★ 使用 flex-wrap 確保標籤一定會換行，不會被隱藏
    return stats.length ? `<div class="flex flex-wrap gap-1 mt-1.5 leading-none">${stats.join('')}</div>` : '';
  },

render() {
    const content = document.getElementById('loadoutContent');
    const p = G.player;
    if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

    const slotsConfig = [
      { key: 'attack', name: '招式武學', limit: 2, icon: 'fa-khanda', color: 'text-[#a82d25]', desc: '出招殺傷敵手' },
      { key: 'inner', name: '內功心法', limit: 1, icon: 'fa-yin-yang', color: 'text-[#7e22ce]', desc: '調勻真氣與護體' },
      { key: 'utility', name: '身法絕技', limit: 1, icon: 'fa-wind', color: 'text-[#047857]', desc: '閃轉騰挪化危局' }
    ];

    // 1. 頂部：三大槽位（卡片寬度充裕）
    let slotsHTML = '<div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">';
    slotsConfig.forEach(cfg => {
      const equipped = p.loadout[cfg.key] || [];
      
      let cardInner = '';
      for (let i = 0; i < cfg.limit; i++) {
        const id = equipped[i];
        const art = id ? G.data.MARTIAL_ARTS[id] : null;
        if (art) {
          const gradeColor = {
            EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]',
            B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]', E: 'text-[#78716c]'
          }[art.grade] || 'text-[#57534e]';

          cardInner += `
            <div class="p-3 bg-white border border-[#d8ccb8] rounded-xl flex flex-col justify-between shadow-2xs mb-2">
              <div>
                <div class="flex items-center justify-between gap-1 mb-1">
                  <div class="flex items-center gap-1 min-w-0">
                    <span class="${gradeColor} font-black font-mono text-xs shrink-0">[${art.grade}]</span>
                    <span class="font-black text-[#2c1f14] text-sm truncate">${art.name}</span>
                  </div>
                  <button onclick="LoadoutUI.unequip('${cfg.key}', ${i})" class="text-[10px] px-2 py-0.5 rounded bg-[#fff1f2] border border-[#fecdd3] text-[#b91c1c] font-bold hover:bg-[#ffe4e6] cursor-pointer shrink-0">卸下</button>
                </div>
                <p class="text-[11px] text-[#78614c] line-clamp-2 leading-tight">${art.desc || ''}</p>
                ${this.getArtStats(art)}
              </div>
            </div>`;
        } else {
          cardInner += `
            <div class="p-3 border-2 border-dashed border-[#d8ccb8] bg-[#fbf9f4] rounded-xl text-center text-xs text-[#8a7561] font-bold flex items-center justify-center min-h-[72px] mb-2">
              【 空置槽位 】
            </div>`;
        }
      }

      slotsHTML += `
        <div class="bg-[#f8f5ee] border border-[#d8ccb8] rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1.5 mb-1 pb-1 border-b border-[#e8decd]">
              <i class="fa-solid ${cfg.icon} ${cfg.color} text-xs"></i>
              <h4 class="font-black text-sm text-[#2c1f14]">${cfg.name}</h4>
            </div>
            <p class="text-[10px] text-[#8a7561] mb-2">${cfg.desc}</p>
            <div>${cardInner}</div>
          </div>
        </div>`;
    });
    slotsHTML += '</div>';

    // 2. 底部：備用功法庫
    let poolHTML = `
      <div class="bg-white border border-[#d8ccb8] rounded-xl p-4 shadow-2xs">
        <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-[#e8decd]">
          <h4 class="font-black text-xs text-[#594432] tracking-wider">【 藏經匣 · 備用功法庫 】</h4>
          <span class="text-[11px] text-[#8a7561]">點擊即裝配至對應槽位</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
    `;

    let hasAny = false;
    slotsConfig.forEach(cfg => {
      const equipped = p.loadout[cfg.key] || [];
      const available = (p.martialArts || []).filter(id => {
        const a = G.data.MARTIAL_ARTS[id];
        return a && a.slot === cfg.key && !equipped.includes(id);
      });

      available.forEach(id => {
        hasAny = true;
        const art = G.data.MARTIAL_ARTS[id];
        const statsHTML = this.getArtStats(art);
        poolHTML += `
          <div class="p-2.5 bg-[#fcfaf5] border border-[#e5dcce] rounded-lg flex items-center justify-between text-xs shadow-2xs hover:border-[#a82d25] transition">
            <div class="flex-1 pr-2">
              <div class="flex items-center gap-1.5">
                <span class="font-black text-[#2c1f14] text-sm">${art.name}</span>
                <span class="text-[10px] text-[#8a7561]">(${cfg.name.slice(0, 2)})</span>
              </div>
              <div class="text-[10px] text-[#78614c] line-clamp-1 mt-0.5">${art.desc || ''}</div>
              ${statsHTML}
            </div>
            <button onclick="LoadoutUI.equip('${cfg.key}', '${id}')" class="text-[11px] px-3 py-1 rounded-lg bg-[#f5ede0] border border-[#cfc0a9] text-[#2c1f14] font-bold hover:bg-[#a82d25] hover:text-white transition cursor-pointer shrink-0">
              裝備
            </button>
          </div>`;
      });
    });

    if (!hasAny) {
      poolHTML += `<div class="col-span-2 text-center py-5 text-xs text-[#8a7561] italic font-serif">目前背包無其他多餘武學</div>`;
    }
    poolHTML += `</div></div>`;

    content.innerHTML = `<div class="w-full">${slotsHTML}${poolHTML}</div>`;
  },

  equip(slotKey, artId) {
    const loadout = G.player.loadout[slotKey];
    const emptyIdx = loadout.indexOf(null);
    if (emptyIdx === -1) return alert('該槽位已滿！');
    
    loadout[emptyIdx] = artId;
    const art = G.data.MARTIAL_ARTS[artId];
    
    if (slotKey === 'inner' && art) {
      if (art.grantTags) {
        String(art.grantTags).split('|').map(s => s.trim()).forEach(t => {
          if (t && !G.player.tags.includes(t)) G.player.tags.push(t);
        });
      }
      if (art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const k = key.trim().toLowerCase();
          const num = Number(val);
          if (k === 'maxhp') { G.player.maxHp += num; if (G.player.hp > G.player.maxHp) G.player.hp = G.player.maxHp; }
          if (k === 'maxpos') { G.player.maxPos += num; if (G.player.pos > G.player.maxPos) G.player.pos = G.player.maxPos; }
          if (k === 'maxqi') { G.player.maxQi += num; if (G.player.qi > G.player.maxQi) G.player.qi = G.player.maxQi; }
        });
      }
      HUD.log('dice', `【內功運轉】領悟特性【${art.name}】`);
    }
    
    this.render();
    HUD.render();
    SaveSystem.save();
  },

  unequip(slotKey, idx) {
    const artId = G.player.loadout[slotKey][idx];
    if (!artId) return;
    
    const art = G.data.MARTIAL_ARTS[artId];
    G.player.loadout[slotKey][idx] = null;

    if (slotKey === 'inner' && art) {
      if (art.grantTags) {
        String(art.grantTags).split('|').map(s => s.trim()).forEach(t => {
          const tagIdx = G.player.tags.indexOf(t);
          if (tagIdx !== -1) G.player.tags.splice(tagIdx, 1);
        });
      }
      if (art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const k = key.trim().toLowerCase();
          const num = Number(val);
          if (k === 'maxhp') { G.player.maxHp = Math.max(1, G.player.maxHp - num); if (G.player.hp > G.player.maxHp) G.player.hp = G.player.maxHp; }
          if (k === 'maxpos') { G.player.maxPos = Math.max(1, G.player.maxPos - num); if (G.player.pos > G.player.maxPos) G.player.pos = G.player.maxPos; }
          if (k === 'maxqi') { G.player.maxQi = Math.max(1, G.player.maxQi - num); if (G.player.qi > G.player.maxQi) G.player.qi = G.player.maxQi; }
        });
      }
      HUD.log('dice', `【內功散去】失去特性【${art.name}】`);
    }

    this.render();
    HUD.render();
    SaveSystem.save();
  },

  close() {
    document.getElementById('loadoutModal').classList.add('hidden');
  }
};