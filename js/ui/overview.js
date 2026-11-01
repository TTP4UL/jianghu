const OverviewUI = {
  open() {
    if (!G.player) return;
    const modal = document.getElementById('overviewModal');
    const content = document.getElementById('overviewContent');
    const p = G.player;

    const tagsByCategory = {};
    p.tags.forEach(t => {
      const tag = G.data.TAGS[t];
      if (!tag || tag.visible === false) return;
      const cat = tag.category || 'other';
      if (!tagsByCategory[cat]) tagsByCategory[cat] = [];
      tagsByCategory[cat].push(tag.name);
    });

    // 1. 武學卡片 (白底細邊框、高清晰品階字體)
    const artsHTML = (p.martialArts || []).map(id => {
      const a = G.data.MARTIAL_ARTS[id];
      if (!a) return '';
      const gradeColor = {
        EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]',
        B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]', E: 'text-[#78716c]'
      }[a.grade] || 'text-[#57534e]';
      
      return `
        <div class="p-2.5 bg-white rounded-lg border border-[#d8ccb8] text-xs shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <span class="${gradeColor} font-black font-mono">[${a.grade}]</span>
              <span class="text-[#2c1f14] font-black ml-1 text-[13px]">${a.name}</span>
              <span class="text-[#8a7561] ml-1.5 font-serif">· ${a.type}</span>
            </div>
          </div>
          <div class="text-[#6d5541] mt-1 text-[11px] leading-relaxed">${a.desc || ''}</div>
        </div>`;
    }).join('');

    // 2. 同伴卡片 (素雅紙質框)
    const companionsHTML = (p.companions || []).map(cid => {
      const c = G.data.COMPANIONS[cid];
      if (!c) return '';
      const gradeColor = {
        EX: 'text-[#b45309]', S: 'text-[#b91c1c]', A: 'text-[#7e22ce]',
        B: 'text-[#1d4ed8]', C: 'text-[#047857]', D: 'text-[#57534e]'
      }[c.grade] || 'text-[#57534e]';
      
      const passiveStr = Object.entries(c.passiveStats || {}).map(([k, v]) => `${STATS_INFO[k]?.name || k}+${v}`).join(' · ');
      return `
        <div class="p-2.5 bg-white rounded-lg border border-[#d8ccb8] text-xs shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <span class="${gradeColor} font-black font-mono">[${c.grade}]</span>
              <span class="text-[#2c1f14] font-black ml-1 text-[13px]">${c.name}</span>
            </div>
          </div>
          <div class="text-[#6d5541] text-[11px] mt-1 leading-relaxed">${c.desc || ''}</div>
          ${passiveStr ? `<div class="text-[#15803d] text-[10px] mt-1 font-bold">被動加成：${passiveStr}</div>` : ''}
        </div>`;
    }).join('') || '<div class="text-xs text-[#8a7561] italic">獨自一人</div>';

    // 3. 填入面板 HTML
    content.innerHTML = `
      <div class="font-serif text-[#2c1f14]">
        <!-- 頂部名諱與門派 -->
        <div class="mb-3.5 pb-3 border-b border-[#d8ccb8] flex justify-between items-end">
          <div>
            <div class="text-2xl font-black text-[#2c1f14] tracking-wider">${p.name}</div>
            <div class="text-xs text-[#8a7561] mt-0.5">${G.currentAge}歲 · ${G.data.ORIGINS[p.origin]?.name || ''}${p.sect ? ' · ' + G.data.SECTS[p.sect]?.name : ''}</div>
          </div>
          <div class="bg-[#fef3c7] border border-[#f59e0b] px-3 py-1 rounded-md text-xs font-bold text-[#92400e] font-mono shadow-xs">
            ${p.gold} 兩白銀
          </div>
        </div>

        <!-- 六維屬性 (白底深字，清晰直觀) -->
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

        <!-- 武學清單 -->
        <div class="mb-4">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 修習武學 】（${(p.martialArts || []).length}）</div>
          <div class="space-y-1.5">
            ${artsHTML || '<div class="text-xs text-[#8a7561] italic">尚未習得任何武學</div>'}
          </div>
        </div>

        <!-- 特性標籤 (調用 HUD.getTagStyle 保持全域色彩統一) -->
        <div class="mb-4">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 命格特性 】</div>
          <div class="flex flex-wrap gap-1.5 text-[11px]">
            ${(p.tags || []).map(t => {
              const tag = G.data.TAGS[t];
              if (!tag) return '';
              const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
              if (!isVisible) return '';
              
              const colorClass = HUD.getTagStyle(tag);
              return `<span class="px-2 py-0.5 rounded border ${colorClass}">【${tag.name}】</span>`;
            }).join('') || '<span class="text-xs text-[#8a7561] italic">無</span>'}
          </div>
        </div>

        <!-- 結伴同行 -->
        <div class="mb-2">
          <div class="text-xs font-black tracking-widest text-[#594432] mb-1.5">【 結伴同行 】（${(p.companions || []).length}/2）</div>
          <div class="space-y-1.5">${companionsHTML}</div>
        </div>
      </div>`;
      
    modal.classList.remove('hidden');
  },

  close() {
    document.getElementById('overviewModal').classList.add('hidden');
  }
};