const LoadoutUI = {
  currentTab: 'attack',

  open() {
    if (!G.player) return;
    document.getElementById('loadoutModal').classList.remove('hidden');
    this.render();
  },

  getGradeVisual(grade) {
    const g = (grade || 'E').toUpperCase();
    const map = {
      EX: { title: '神品', cardCls: 'bg-gradient-to-br from-[#fffdf5] via-[#fefbf0] to-white border-[#d97706]/70 shadow-[0_2px_10px_rgba(217,119,6,0.15)]', accentBar: 'bg-[#d97706]', stamp: 'bg-[#b45309] text-[#fef3c7] border-[#92400e]', nameCls: 'text-[#92400e]' },
      S:  { title: '絕品', cardCls: 'bg-gradient-to-br from-[#fffafa] via-[#fff5f5] to-white border-[#ef4444]/60 shadow-[0_2px_10px_rgba(239,68,68,0.12)]', accentBar: 'bg-[#ef4444]', stamp: 'bg-[#b91c1c] text-[#fee2e2] border-[#991b1b]', nameCls: 'text-[#991b1b]' },
      A:  { title: '妙品', cardCls: 'bg-gradient-to-br from-[#faf7fd] via-[#f5f0fb] to-white border-[#a855f7]/50 shadow-[0_2px_8px_rgba(168,85,247,0.1)]', accentBar: 'bg-[#a855f7]', stamp: 'bg-[#7e22ce] text-[#f3e8ff] border-[#6b21a8]', nameCls: 'text-[#6b21a8]' },
      B:  { title: '良品', cardCls: 'bg-gradient-to-br from-[#f8fafc] via-[#f0f7ff] to-white border-[#3b82f6]/50 shadow-[0_2px_8px_rgba(59,130,246,0.1)]', accentBar: 'bg-[#3b82f6]', stamp: 'bg-[#1d4ed8] text-[#dbeafe] border-[#1e40af]', nameCls: 'text-[#1e40af]' },
      C:  { title: '上品', cardCls: 'bg-gradient-to-br from-[#f9fbf9] via-[#f0fdf4] to-white border-[#10b981]/50 shadow-[0_2px_8px_rgba(16,185,129,0.08)]', accentBar: 'bg-[#10b981]', stamp: 'bg-[#047857] text-[#d1fae5] border-[#065f46]', nameCls: 'text-[#065f46]' },
      D:  { title: '中品', cardCls: 'bg-gradient-to-br from-[#fcf8f2] via-[#faf4eb] to-white border-[#c28e5c]/60 shadow-xs', accentBar: 'bg-[#b07844]', stamp: 'bg-[#8c531b] text-[#fdf6ec] border-[#704012]', nameCls: 'text-[#704012]' },
      E:  { title: '凡品', cardCls: 'bg-[#f8f9fa] border-[#cbd5e1] shadow-2xs', accentBar: 'bg-[#64748b]', stamp: 'bg-[#475569] text-[#f8fafc] border-[#334155]', nameCls: 'text-[#334155]' }
    };
    return map[g] || map.E;
  },
  
  getArtStats(art) {
    if (!art) return '';
    let badges = [];
    
    if (art.slot === 'attack') {
      const cost = art.qiCost || 2;
      badges.push(`<span class="bg-[#f5ede0] text-[#78614c] px-2 py-0.5 rounded text-[11px] border border-[#d8ccb8] font-mono font-bold">真氣 ${cost}</span>`);
      
      if (art.fixedDamage) {
        badges.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded text-[11px] border border-[#fca5a5] font-mono font-bold">傷害 ${art.fixedDamage}</span>`);
      } else if (art.basePower) {
        const diceCount = Math.max(1, Math.floor(art.basePower / 10));
        const diceType = art.diceType || 8;
        badges.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded text-[11px] border border-[#fca5a5] font-mono font-bold">威力 ${diceCount}d${diceType}</span>`);
      }
      
      if (art.hits && Number(art.hits) > 1) {
        badges.push(`<span class="bg-[#fff7ed] text-[#c2410c] px-2 py-0.5 rounded text-[11px] border border-[#fdba74] font-bold">${art.hits}連擊</span>`);
      }
      
      if (art.specialEffect) {
        String(art.specialEffect).split('|').forEach(e => {
          const eff = e.trim();
          if (eff.includes('pierce')) badges.push(`<span class="bg-[#faf5ff] text-[#7e22ce] px-2 py-0.5 rounded text-[11px] border border-[#d8b4fe] font-bold">破防穿透</span>`);
          if (eff.includes('stun')) badges.push(`<span class="bg-[#fefce8] text-[#854d0e] px-2 py-0.5 rounded text-[11px] border border-[#fde047] font-bold">點穴眩暈</span>`);
          if (eff.includes('poison')) {
            const match = eff.match(/poison:(\d+):(\d+)/);
            if (match) badges.push(`<span class="bg-[#ecfdf5] text-[#047857] px-2 py-0.5 rounded text-[11px] border border-[#a7f3d0] font-bold">劇毒 (${match[1]}回合)</span>`);
            else badges.push(`<span class="bg-[#ecfdf5] text-[#047857] px-2 py-0.5 rounded text-[11px] border border-[#a7f3d0] font-bold">劇毒附著</span>`);
          }
          if (eff.includes('heal')) badges.push(`<span class="bg-[#fff1f2] text-[#be123c] px-2 py-0.5 rounded text-[11px] border border-[#fecdd3] font-bold">吸血化氣</span>`);
        });
      }
    }

    if (art.slot === 'inner' && art.innerEffect) {
      String(art.innerEffect).split('|').forEach(e => {
        const [key, val] = e.split(':');
        const k = key.trim().toLowerCase();
        let num = Number(val ? val.trim() : 0);
        const sign = num >= 0 ? `+${num}` : `${num}`;
        
        if (k === 'regen' || k === 'hp_regen') badges.push(`<span class="bg-[#ecfdf5] text-[#047857] px-2 py-0.5 rounded text-[11px] border border-[#a7f3d0] font-bold">回血 ${sign}</span>`);
        if (k === 'qi_regen') badges.push(`<span class="bg-[#eff6ff] text-[#1d4ed8] px-2 py-0.5 rounded text-[11px] border border-[#bfdbfe] font-bold">回氣 ${sign}</span>`);
        if (k === 'pos_regen') badges.push(`<span class="bg-[#fffbeb] text-[#b45309] px-2 py-0.5 rounded text-[11px] border border-[#fde68a] font-bold">回架 ${sign}</span>`);
        if (k === 'maxhp') badges.push(`<span class="bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded text-[11px] border border-[#fca5a5] font-bold">血上限 ${sign}</span>`);
        if (k === 'maxqi') badges.push(`<span class="bg-[#eff6ff] text-[#1d4ed8] px-2 py-0.5 rounded text-[11px] border border-[#bfdbfe] font-bold">氣上限 ${sign}</span>`);
        if (k === 'maxpos') badges.push(`<span class="bg-[#fffbeb] text-[#b45309] px-2 py-0.5 rounded text-[11px] border border-[#fde68a] font-bold">架上限 ${sign}</span>`);
      });
    }

    return badges.length ? `<div class="flex flex-wrap gap-1.5 mt-2">${badges.join('')}</div>` : '';
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  render() {
    const content = document.getElementById('loadoutContent');
    const p = G.player;
    if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

    const tabs = [
      { key: 'attack', name: '招式武學', limit: 2, icon: 'fa-khanda', desc: '對敵出招殺敵，最多裝備 2 種招式' },
      { key: 'inner', name: '內功心法', limit: 1, icon: 'fa-shield-halved', desc: '運氣調息護體，最多運轉 1 部心法' },
      { key: 'utility', name: '身法絕技', limit: 1, icon: 'fa-wind', desc: '閃轉騰挪化解危局，最多裝備 1 套身法' }
    ];

    const currentConfig = tabs.find(t => t.key === this.currentTab) || tabs[0];
    const equipped = p.loadout[currentConfig.key] || [];

    const tabsHTML = `
      <div class="flex border-b border-[#d8ccb8] mb-5 gap-2 flex-shrink-0">
        ${tabs.map(t => {
          const isActive = t.key === this.currentTab;
          return `
            <button onclick="LoadoutUI.switchTab('${t.key}')" 
              class="px-5 py-2.5 font-bold text-sm tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive ? 'border-[#a82d25] text-[#a82d25] bg-[#fff5f5]/70 rounded-t-lg' : 'border-transparent text-[#78614c] hover:text-[#2c1f14] hover:bg-black/5 rounded-t-lg'
              }">
              <i class="fa-solid ${t.icon}"></i><span>${t.name}</span>
            </button>`;
        }).join('')}
      </div>
    `;

    const slotCardHeight = currentConfig.limit === 2 ? 'min-h-[140px]' : 'min-h-[155px]';

    const slotsHTML = Array.from({ length: currentConfig.limit }).map((_, i) => {
      const id = equipped[i];
      const art = id ? G.data.MARTIAL_ARTS[id] : null;

      if (art) {
        const vis = this.getGradeVisual(art.grade);
        const statsHTML = this.getArtStats(art);
        return `
          <div class="p-3.5 rounded-xl border-2 ${vis.cardCls} relative flex flex-col justify-between ${slotCardHeight} transition hover:scale-[1.01]">
            <div class="absolute top-0 left-0 bottom-0 w-1.5 ${vis.accentBar} rounded-l-xl"></div>
            <div class="pl-2">
              <div class="flex items-center justify-between pb-1.5 border-b border-black/5">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-black px-2 py-0.5 rounded shadow-xs font-serif ${vis.stamp}">${vis.title} · ${art.grade}</span>
                  <span class="font-black text-base tracking-wide ${vis.nameCls}">${art.name}</span>
                </div>
                <button onclick="LoadoutUI.unequip('${currentConfig.key}', ${i})" class="text-xs px-3 py-1 rounded-lg bg-white border border-[#fecdd3] text-[#b91c1c] font-black hover:bg-[#fff1f2] cursor-pointer shadow-2xs transition">卸下</button>
              </div>
              <p class="text-xs text-[#594432] leading-relaxed line-clamp-2 mt-2 font-medium">${art.desc || '暫無功法詳情'}</p>
            </div>
            <div class="pl-2 pt-1">${statsHTML}</div>
          </div>`;
      }
      return `
        <div class="p-5 border-2 border-dashed border-[#d8ccb8] bg-[#fbf9f4]/80 rounded-xl text-center flex flex-col items-center justify-center ${slotCardHeight}">
          <span class="text-xs font-bold text-[#8a7561] tracking-widest">【 空 置 槽 位 】</span>
          <span class="text-[11px] text-[#b3a490] mt-1 font-normal">從右側功法庫選取裝備</span>
        </div>`;
    }).join('');

    const available = (p.martialArts || []).filter(id => {
      const a = G.data.MARTIAL_ARTS[id];
      return a && a.slot === currentConfig.key && !equipped.includes(id);
    });

    const poolHTML = available.length ? available.map(id => {
      const art = G.data.MARTIAL_ARTS[id];
      const vis = this.getGradeVisual(art.grade);
      const statsHTML = this.getArtStats(art);
      return `
        <div class="p-3.5 rounded-xl border-2 ${vis.cardCls} relative flex items-center justify-between shadow-xs hover:border-[#a82d25] transition flex-shrink-0">
          <div class="absolute top-0 left-0 bottom-0 w-1.5 ${vis.accentBar} rounded-l-xl"></div>
          <div class="flex-1 pl-2 pr-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs ${vis.stamp}">${vis.title} · ${art.grade}</span>
              <span class="font-black text-sm tracking-wide ${vis.nameCls}">${art.name}</span>
            </div>
            <div class="text-xs text-[#594432] line-clamp-1 mb-1 font-medium">${art.desc || ''}</div>
            ${statsHTML}
          </div>
          <button onclick="LoadoutUI.equip('${currentConfig.key}', '${id}')" class="text-xs px-4 py-2 rounded-xl wuxia-primary-btn font-bold cursor-pointer shrink-0 shadow-sm transition hover:scale-105">裝備</button>
        </div>`;
    }).join('') : `
      <div class="h-full flex flex-col items-center justify-center text-[#8a7561] italic bg-[#fbf9f4] rounded-xl border border-dashed border-[#e5dcce] p-6 text-xs">
        暫無此類型的待修習功法
      </div>`;

    content.innerHTML = `
      ${tabsHTML}
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[360px]">
        <div class="md:col-span-6 flex flex-col">
          <div class="flex items-center justify-between mb-2.5 flex-shrink-0">
            <span class="text-xs font-black text-[#594432] tracking-wider">【 當前運轉槽位 】</span>
            <span class="text-[11px] text-[#8a7561]">${currentConfig.desc}</span>
          </div>
          <div class="flex flex-col gap-3 h-[320px] justify-start">${slotsHTML}</div>
        </div>
        <div class="md:col-span-6 flex flex-col">
          <div class="flex items-center justify-between mb-2.5 flex-shrink-0">
            <span class="text-xs font-black text-[#594432] tracking-wider">【 可修習功法庫 】</span>
            <span class="text-[11px] text-[#8a7561]">點擊即時裝備</span>
          </div>
          <div class="h-[320px] overflow-y-auto pr-1.5 custom-scrollbar flex flex-col gap-2.5">${poolHTML}</div>
        </div>
      </div>
    `;
  },

  equip(slotKey, artId) {
    const loadout = G.player.loadout[slotKey];
    const emptyIdx = loadout.indexOf(null);
    if (emptyIdx === -1) return alert('該槽位已滿！請先卸下現有功法。');
    
    loadout[emptyIdx] = artId;
    const art = G.data.MARTIAL_ARTS[artId];
    
    // ★ 核心修復：將 grantTags 的判斷移出 inner 限制，讓所有類型的功法都能獲得 Tag
    if (art) {
      if (art.grantTags) {
        String(art.grantTags).split('|').map(s => s.trim()).forEach(t => {
          if (t && !G.player.tags.includes(t)) G.player.tags.push(t);
        });
      }
      
      // 只有內功才處理上限加成
      if (slotKey === 'inner' && art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const k = key.trim().toLowerCase();
          const num = Number(val);
          if (k === 'maxhp') { G.player.maxHp += num; if (G.player.hp > G.player.maxHp) G.player.hp = G.player.maxHp; }
          if (k === 'maxpos') { G.player.maxPos += num; if (G.player.pos > G.player.maxPos) G.player.pos = G.player.maxPos; }
          if (k === 'maxqi') { G.player.maxQi += num; if (G.player.qi > G.player.maxQi) G.player.qi = G.player.maxQi; }
        });
      }
      HUD.log('dice', `【裝備】${art.name}`);
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

    // ★ 核心修復：將 grantTags 的判斷移出 inner 限制，讓所有類型的功法卸下時都能移除 Tag
    if (art) {
      if (art.grantTags) {
        String(art.grantTags).split('|').map(s => s.trim()).forEach(t => {
          const tagIdx = G.player.tags.indexOf(t);
          if (tagIdx !== -1) G.player.tags.splice(tagIdx, 1);
        });
      }
      
      // 只有內功才處理上限扣除
      if (slotKey === 'inner' && art.innerEffect) {
        String(art.innerEffect).split('|').forEach(eff => {
          const [key, val] = eff.split(':');
          const k = key.trim().toLowerCase();
          const num = Number(val);
          if (k === 'maxhp') { G.player.maxHp = Math.max(1, G.player.maxHp - num); if (G.player.hp > G.player.maxHp) G.player.hp = G.player.maxHp; }
          if (k === 'maxpos') { G.player.maxPos = Math.max(1, G.player.maxPos - num); if (G.player.pos > G.player.maxPos) G.player.pos = G.player.maxPos; }
          if (k === 'maxqi') { G.player.maxQi = Math.max(1, G.player.maxQi - num); if (G.player.qi > G.player.maxQi) G.player.qi = G.player.maxQi; }
        });
      }
      HUD.log('dice', `【卸下】${art.name}`);
    }

    this.render();
    HUD.render();
    SaveSystem.save();
  },

  close() {
    document.getElementById('loadoutModal').classList.add('hidden');
  }
};