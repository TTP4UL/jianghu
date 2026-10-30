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

    const artsHTML = (p.martialArts || []).map(id => {
      const a = G.data.MARTIAL_ARTS[id];
      if (!a) return '';
      const gradeColor = {
        EX:'text-red-400', S:'text-purple-400', A:'text-amber-400',
        B:'text-blue-400', C:'text-emerald-400', D:'text-gray-400', E:'text-gray-500'
      }[a.grade] || 'text-gray-400';
      return `<div class="p-2 bg-ink-900 rounded border border-ink-border text-xs">
        <span class="${gradeColor} font-bold">[${a.grade}]</span>
        <span class="text-parchment-200 font-bold ml-1">${a.name}</span>
        <span class="text-gray-500 ml-1">· ${a.type}</span>
        <div class="text-gray-400 mt-0.5">${a.desc}</div>
      </div>`;
    }).join('');

    const companionsHTML = (p.companions || []).map(cid => {
      const c = G.data.COMPANIONS[cid];
      if (!c) return '';
      const gradeColor = { EX:'text-red-400', S:'text-purple-400', A:'text-amber-400', B:'text-blue-400', C:'text-emerald-400', D:'text-gray-400' }[c.grade] || 'text-gray-400';
      const passiveStr = Object.entries(c.passiveStats || {}).map(([k, v]) => `${STATS_INFO[k]?.name || k}+${v}`).join(' · ');
      return `<div class="p-2 bg-ink-900 rounded border border-ink-border text-xs">
        <div><span class="${gradeColor} font-bold">[${c.grade}]</span>
        <span class="text-parchment-100 font-bold ml-1">${c.name}</span></div>
        <div class="text-gray-400 text-[10px] mt-0.5">${c.desc || ''}</div>
        ${passiveStr ? `<div class="text-jade-light text-[10px] mt-1">被動加成：${passiveStr}</div>` : ''}
      </div>`;
    }).join('') || '<div class="text-xs text-gray-500">獨自一人</div>';

    content.innerHTML = `
      <div class="mb-3 pb-3 border-b border-ink-border">
        <div class="text-lg font-black text-parchment-100">${p.name}</div>
        <div class="text-xs text-gray-400">${G.currentAge}歲 · ${G.data.ORIGINS[p.origin]?.name || ''}${p.sect ? ' · ' + G.data.SECTS[p.sect]?.name : ''}</div>
      </div>
      <div class="mb-3">
        <div class="text-[10px] uppercase font-bold text-wuxiaGold mb-1">屬性</div>
        <div class="grid grid-cols-3 gap-1.5 text-xs">
          ${Object.keys(p.stats).map(k => {
            const displayVal = p.stats[k] - 10; // ★ 顯示 0 起步的數值
            // 移除 mod 計算
            return `<div class="bg-ink-900 px-2 py-1 rounded flex justify-between items-center">
              <span class="text-gray-400">${STATS_INFO[k].name}</span>
              <span class="text-white font-mono text-sm font-bold">${displayVal}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="mb-3">
        <div class="text-[10px] uppercase font-bold text-wuxiaGold mb-1">武學（${(p.martialArts || []).length}）</div>
        <div class="space-y-1">${artsHTML || '<div class="text-xs text-gray-500">尚未習得任何武學</div>'}</div>
      </div>
      <div class="mb-3">
        <div class="text-[10px] uppercase font-bold text-wuxiaGold mb-1">特性</div>
        <div class="flex flex-wrap gap-1 text-[11px]">
          ${(p.tags || []).map(t => {
            const tag = G.data.TAGS[t];
            if (!tag) return '';

            // ★ 終極安全過濾
            const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
            if (!isVisible) return '';
            
            const colorClass = HUD.getTagStyle(tag);
            return `<span class="px-2 py-0.5 rounded border ${colorClass}">${tag.name}</span>`;
          }).join('') || '<span class="text-gray-500">無</span>'}
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      <div class="mb-3">
        <div class="text-[10px] uppercase font-bold text-wuxiaGold mb-1">同伴（${(p.companions || []).length}/2）</div>
        <div class="space-y-1">${companionsHTML}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-ink-900 p-2 rounded"><span class="text-gray-400">金錢</span> <b class="text-wuxiaGold">${p.gold} 兩</b></div>
      </div>`;
    modal.classList.remove('hidden');
  },

  close() { document.getElementById('overviewModal').classList.add('hidden'); }
};