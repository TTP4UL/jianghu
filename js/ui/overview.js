const OverviewUI = {
  open() {
    if (!G.player) return;
    const modal = document.getElementById('overviewModal');
    const content = document.getElementById('overviewContent');
    const p = G.player;

    // 1. 處理功法 HTML 與 Hover 事件
    const artsHTML = (p.martialArts || []).map(id => {
      const a = G.data.MARTIAL_ARTS[id];
      if (!a) return '';
      const gradeColor = { EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]', B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]', E: 'text-[#78716c]' }[a.grade] || 'text-[#57534e]';
      
      // 判斷是否已裝備
      const isEquipped = 
        (p.loadout?.attack || []).includes(id) || 
        (p.loadout?.inner || []).includes(id) || 
        (p.loadout?.utility || []).includes(id);
      
      const bgClass = isEquipped ? 'bg-[#ecfdf5] border-[#a7f3d0] shadow-xs' : 'bg-[#fdfaf3] border-[#e5dcce] shadow-xs';
      
      return `
        <div class="px-2 py-1 rounded border ${bgClass} text-xs flex items-center cursor-help transition-transform hover:scale-105" 
             onmouseenter="HUD.showArtTooltip(event, G.data.MARTIAL_ARTS['${id}'])" 
             onmousemove="HUD.showArtTooltip(event, G.data.MARTIAL_ARTS['${id}'])" 
             onmouseleave="HUD.hideTagTooltip()"
             onclick="event.stopPropagation(); HUD.showArtTooltip(event, G.data.MARTIAL_ARTS['${id}']); const hide = () => { HUD.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10);">
          <span class="${gradeColor} font-bold mr-1 font-mono">[${a.grade}]</span>
          <span class="text-[#2c1f14] font-bold">${a.name}</span>
          ${isEquipped ? '<i class="fa-solid fa-check text-[#047857] ml-1.5 text-[10px]"></i>' : ''}
        </div>`;
    }).join('');

    // 2. 處理特性 Tag HTML 與 Hover 事件
    const tagsHTML = (p.tags || []).map(t => {
      const tag = G.data.TAGS[t];
      if (!tag) return '';
      const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
      if (!isVisible) return '';
      
      const colorClass = HUD.getTagStyle(tag);
      return `<span class="px-2 py-0.5 rounded border ${colorClass} cursor-help transition-transform hover:scale-105"
                    onmouseenter="HUD.showTagTooltip(event, G.data.TAGS['${t}'])"
                    onmousemove="HUD.showTagTooltip(event, G.data.TAGS['${t}'])"
                    onmouseleave="HUD.hideTagTooltip()"
                    onclick="event.stopPropagation(); HUD.showTagTooltip(event, G.data.TAGS['${t}']); const hide = () => { HUD.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10);">
              【${tag.name}】
            </span>`;
    }).join('') || '<span class="text-xs text-[#8a7561] italic">無</span>';

    // 3. 同伴卡片
    const companionsHTML = (p.companions || []).map(cid => {
      const c = G.data.COMPANIONS[cid];
      if (!c) return '';
      const gradeColor = { EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]', B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]' }[c.grade] || 'text-[#57534e]';
      const passiveStr = Object.entries(c.passiveStats || {}).map(([k, v]) => `${STATS_INFO[k]?.name || k}+${v}`).join(' · ');
      return `
        <div class="p-2.5 bg-white rounded-lg border border-[#d8ccb8] text-xs shadow-xs relative">
          <div class="flex items-center justify-between">
            <div>
              <span class="${gradeColor} font-black font-mono">[${c.grade}]</span>
              <span class="text-[#2c1f14] font-black ml-1 text-[13px]">${c.name}</span>
            </div>
            <!-- ★ 新增：送別按鈕 -->
            <button onclick="OverviewUI.dismissCompanion('${cid}')" class="text-[10px] text-[#b91c1c] border border-[#fca5a5] bg-[#fef2f2] px-2 py-0.5 rounded hover:bg-[#fee2e2] transition">送別</button>
          </div>
          <div class="text-[#6d5541] text-[11px] mt-1 leading-relaxed pr-8">${c.desc || ''}</div>
          ${passiveStr ? `<div class="text-[#15803d] text-[10px] mt-1 font-bold">被動加成：${passiveStr}</div>` : ''}
        </div>`;
    }).join('') || '<div class="text-xs text-[#8a7561] italic">獨自一人</div>';

    

    // 4. 計算當前狀態
    const finalAC = typeof CombatSystem !== 'undefined' ? CombatSystem.getEffectiveAC(p) : p.ac;

    // 5. 填入面板 HTML
    content.innerHTML = `
      <div class="font-serif text-[#2c1f14]">
        <!-- 標題列：名字、金錢、閃避數字 -->
        <div class="mb-3.5 pb-3 border-b border-[#d8ccb8] flex justify-between items-end">
          <div>
            <div class="text-2xl font-black text-[#2c1f14] tracking-wider">${p.name}</div>
            <div class="text-xs text-[#8a7561] mt-0.5">${G.currentAge}歲 · ${G.data.ORIGINS[p.origin]?.name || ''}${p.sect ? ' · ' + G.data.SECTS[p.sect]?.name : ''}</div>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="bg-[#fef3c7] border border-[#f59e0b] px-3 py-1.5 rounded-lg text-xs font-bold text-[#92400e] font-mono shadow-xs">
              ${p.gold} 兩
            </div>
            <!-- ★ 修改：閃避改為乾淨的數字小方塊 -->
            <div class="text-center bg-[#f3ecdf] border border-[#d8ccb8] px-3 py-1.5 rounded-lg shadow-inner">
              <span class="text-[9px] text-[#78614c] font-black block tracking-wider">閃避</span>
              <span class="text-base font-mono font-black text-[#a82d25] leading-none">${finalAC}</span>
            </div>
          </div>
        </div>

        <!-- ★ 修改：狀態條改為 3 欄，移除 AC 進度條 -->
        <div class="mb-4 bg-[#fbf9f4] p-3 rounded-xl border border-[#d8ccb8]">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-[#594432]">氣血</span><span class="text-[#b91c1c] font-mono">${Math.max(0, p.hp)} / ${p.maxHp}</span></div>
              <div class="w-full bg-[#e8decb] rounded-full h-2 overflow-hidden border border-[#d8cca8]"><div class="bg-gradient-to-r from-red-700 to-red-500 h-full" style="width:${Math.min(100, Math.max(0, (p.hp / p.maxHp) * 100))}%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-[#594432]">架勢</span><span class="text-[#b45309] font-mono">${Math.max(0, p.pos)} / ${p.maxPos}</span></div>
              <div class="w-full bg-[#e8decb] rounded-full h-2 overflow-hidden border border-[#d8cca8]"><div class="bg-gradient-to-r from-amber-600 to-amber-400 h-full" style="width:${Math.min(100, Math.max(0, (p.pos / p.maxPos) * 100))}%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] font-bold mb-1"><span class="text-[#594432]">內力</span><span class="text-[#047857] font-mono">${Math.max(0, p.qi)} / ${p.maxQi}</span></div>
              <div class="w-full bg-[#e8decb] rounded-full h-2 overflow-hidden border border-[#d8cca8]"><div class="bg-gradient-to-r from-emerald-700 to-emerald-500 h-full" style="width:${Math.min(100, Math.max(0, (p.qi / p.maxQi) * 100))}%"></div></div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 六維根基 】</div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            ${Object.keys(p.stats).map(k => {
              const displayVal = p.stats[k] - 10;
              return `
                <div class="bg-white border border-[#d8ccb8] px-2.5 py-1.5 rounded-lg flex justify-between items-center shadow-xs">
                  <span class="text-[#6d5541] font-bold">${STATS_INFO[k].name}</span>
                  <span class="text-[#2c1f14] font-mono text-base font-black">${displayVal}</span>
                </div>`;
            }).join('')}
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 修習武學 】（${(p.martialArts || []).length}）</div>
          <div class="flex flex-wrap gap-1.5">
            ${artsHTML || '<div class="text-xs text-[#8a7561] italic">尚未習得任何武學</div>'}
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 命格特性 】</div>
          <div class="flex flex-wrap gap-1.5 text-[11px]">
            ${tagsHTML}
          </div>
        </div>

        <div class="mb-2">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 結伴同行 】（${(p.companions || []).length}/2）</div>
          <div class="space-y-1.5">${companionsHTML}</div>
        </div>
      </div>`;
      
    modal.classList.remove('hidden');
  },
    dismissCompanion(compId) {
      if (!confirm(`確定要與 ${G.data.COMPANIONS[compId]?.name} 分道揚鑣嗎？`)) return;
      
      const idx = G.player.companions.indexOf(compId);
      if (idx !== -1) G.player.companions.splice(idx, 1);
      
      // 清理羈絆 Tag
      const shortId = compId.replace('comp_', '');
      const tagsToRemove = (G.player.tags || []).filter(t => t.startsWith('bond_') && t.includes(shortId));
      tagsToRemove.forEach(t => TagUtils.remove(t));
      
      HUD.log('lifepath', `你與 ${G.data.COMPANIONS[compId]?.name} 分道揚鑣。`);
      this.open(); // 刷新概覽 UI
      HUD.render();
      SaveSystem.save();
    },
  close() {
    document.getElementById('overviewModal').classList.add('hidden');
  }
};