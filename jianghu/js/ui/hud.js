const HUD = {
  // ★ 顏色對照表
  getTagStyle(tag) {
    const grade = tag.grade || 'E';
    switch (grade.toUpperCase()) {
      case 'EX': return 'bg-wuxiaGold/20 border-wuxiaGold text-wuxiaGold-light shadow-[0_0_10px_rgba(217,119,6,0.8)]';
      case 'S':  return 'bg-red-900/40 border-red-500 text-red-300';
      case 'A':  return 'bg-purple-900/40 border-purple-500 text-purple-300';
      case 'B':  return 'bg-blue-900/40 border-blue-500 text-blue-300';
      case 'C':  return 'bg-emerald-900/40 border-emerald-500 text-emerald-300';
      case 'D':  return 'bg-gray-700/40 border-gray-500 text-gray-300';
      case 'F':  return 'bg-red-950 border-red-800 text-red-500 font-black';
      case 'E':
      default:   return 'bg-gray-800 border-gray-600 text-gray-400';
    }
  },

  render() {
    const p = G.player; if (!p) return;
    
    // ... 前面身份標籤保持不變 ...
    const idContainer = document.getElementById('hudIdentityTags'); 
    idContainer.innerHTML = '';
    const origin = G.data.ORIGINS[p.origin];
    if (origin) {
      const tag = document.createElement('span');
      tag.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-wuxiaGold/20 text-wuxiaGold border border-wuxiaGold/30';
      tag.textContent = origin.name; idContainer.appendChild(tag);
    }
    if (p.sect && G.data.SECTS[p.sect]) {
      const tag = document.createElement('span');
      tag.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-cinnabar/20 text-cinnabar border border-cinnabar/30';
      tag.textContent = G.data.SECTS[p.sect].name; idContainer.appendChild(tag);
    }

    document.getElementById('hudName').textContent = p.name;
    document.getElementById('hudAgeStage').textContent = `${G.currentAge}歲 · ${G.currentAge < 18 ? '成長期' : '歷練期'}`;
    document.getElementById('ageBadge').textContent = `${G.currentAge}歲`;
    document.getElementById('hudAC').textContent = p.ac;
    this.updateGauges();

    // 六維屬性
    const list = document.getElementById('hudStatList'); list.innerHTML = '';
    Object.keys(p.stats).forEach(k => {
      const displayVal = p.stats[k] - 10;
      const item = document.createElement('div');
      item.className = 'bg-ink-900/90 border border-ink-border px-2.5 py-1.5 rounded flex items-center justify-between';
      item.innerHTML = `<span class="text-gray-400 font-bold">${STATS_INFO[k].name}</span><span class="font-mono text-base text-white">${displayVal}</span>`;
      list.appendChild(item);
    });

    // 武學與特性
    const container = document.getElementById('hudSkillsTags'); container.innerHTML = '';
    (p.martialArts || []).forEach(id => {
      const art = G.data.MARTIAL_ARTS[id]; if (!art) return;
      const gradeColor = { EX:'bg-red-900/50 border-red-500 text-red-300', S:'bg-purple-900/50 border-purple-500 text-purple-300', A:'bg-amber-900/50 border-amber-500 text-amber-300', B:'bg-blue-900/50 border-blue-500 text-blue-300', C:'bg-emerald-900/50 border-emerald-500 text-emerald-300', D:'bg-gray-800 border-gray-600 text-gray-300', E:'bg-ink-700 border-ink-border text-gray-400' }[art.grade] || 'bg-ink-700 border-ink-border text-gray-400';
      const tag = document.createElement('span');
      tag.className = `px-2 py-0.5 rounded border ${gradeColor} font-bold`;
      tag.textContent = `[${art.grade}] ${art.name}`; container.appendChild(tag);
    });

    // ★ Tag 顯示與過濾
    (p.tags || []).forEach(t => {
      const tag = G.data.TAGS[t];
      if (!tag) return;

      // ★ 終極安全過濾：兼容 false, "false", "FALSE", 0 等等
      const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
      if (!isVisible) return;
      
      const colorClass = this.getTagStyle(tag); // 呼叫顏色表
      const span = document.createElement('span');
      span.className = `px-2 py-0.5 rounded border ${colorClass} font-bold`;
      span.textContent = `【${tag.name}】`;
      container.appendChild(span);
    });
  },


  updateGauges() {
    const p = G.player;
    if (!p) return;
    document.getElementById('hudHpCur').textContent = Math.max(0, p.hp);
    document.getElementById('hudHpMax').textContent = p.maxHp;
    document.getElementById('barHp').style.width = `${Math.min(100, Math.max(0, (p.hp / p.maxHp) * 100))}%`;
    document.getElementById('hudPosCur').textContent = Math.max(0, p.pos);
    document.getElementById('hudPosMax').textContent = p.maxPos;
    document.getElementById('barPos').style.width = `${Math.min(100, Math.max(0, (p.pos / p.maxPos) * 100))}%`;
    document.getElementById('hudQiCur').textContent = Math.max(0, p.qi);
    document.getElementById('hudQiMax').textContent = p.maxQi;
    document.getElementById('barQi').style.width = `${Math.min(100, Math.max(0, (p.qi / p.maxQi) * 100))}%`;
  },

  // ★ 新增：傷害飄字
  floatDamage(targetEl, text, type = 'normal') {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = `damage-float text-dmg-${type}`;
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top + 10}px`;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  },

  // ★ 新增：畫面震動
  shakeScreen() {
    const mainPanel = document.getElementById('screen-play');
    if (!mainPanel) return;
    mainPanel.classList.add('shake-active');
    setTimeout(() => mainPanel.classList.remove('shake-active'), 400);
  },

  // ★ 修改：加入日誌關鍵字上色
  log(type, text, speaker) {
    const c = document.getElementById('narrativeLogs');
    if (!c) return;
    const e = document.createElement('div');
    e.className = 'p-3 rounded-xl border text-xs sm:text-sm ';
    
    // 關鍵字上色邏輯
    let formattedText = text
      .replace(/暴擊/g, '<span class="text-wuxiaGold font-black">暴擊</span>')
      .replace(/閃避/g, '<span class="text-gray-400 font-bold">閃避</span>')
      .replace(/回復/g, '<span class="text-jade-light font-bold">回復</span>')
      .replace(/受到/g, '<span class="text-red-400 font-bold">受到</span>');

    if (type === 'narrative') {
      e.className += 'bg-ink-900/90 border-ink-border text-parchment-200';
      e.innerHTML = `<i class="fa-solid fa-feather text-cinnabar mr-1.5"></i> <b>${speaker || '旁白'}:</b> ${formattedText}`;
    } else if (type === 'dialogue') {
      e.className += 'bg-ink-800 border-ink-border text-gray-200';
      e.innerHTML = `<span class="text-wuxiaGold font-bold">「${speaker}」</span>：${formattedText}`;
    } else if (type === 'combat') {
      e.className += 'bg-red-950/20 border-cinnabar/30 text-red-200';
      e.innerHTML = `<i class="fa-solid fa-khanda text-wuxiaGold mr-1.5"></i> <b>【結算】</b> ${formattedText}`;
    } else if (type === 'dice') {
      e.className += 'bg-ink-700 border-wuxiaGold/40 text-wuxiaGold-light font-mono';
      e.innerHTML = `<i class="fa-solid fa-dice-d20 text-wuxiaGold mr-1.5"></i> ${formattedText}`;
    } else if (type === 'lifepath') {
      e.className += 'bg-jade/10 border-jade/40 text-jade-light';
      e.innerHTML = `<i class="fa-solid fa-seedling text-jade mr-1.5"></i> <b>【成長】</b> ${formattedText}`;
    }
    c.appendChild(e);
    
    // ★ 修改：使用 setTimeout 確保文字渲染完再滾動
    setTimeout(() => {
      c.scrollTo({
        top: c.scrollHeight,
        behavior: 'smooth' // 加咗 smooth 會有滑落去嘅動畫
      });
    }, 50);
  },

  // ★ 修改：加入防連點機制
  renderChoices(choices) {
    const c = document.getElementById('interactionPanel');
    c.innerHTML = '';
    if (!choices || !choices.length) return;
    
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5';
    
    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = `p-3 rounded-xl border text-left font-bold text-xs sm:text-sm flex flex-col justify-between transition-all ${
        ch.primary
          ? 'bg-cinnabar hover:bg-cinnabar-light text-white border-cinnabar/60 shadow-lg'
          : 'bg-ink-900 hover:bg-ink-700 text-parchment-200 border-ink-border'
      }`;
      btn.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <span>${ch.label}</span>
          ${ch.checkText ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-wuxiaGold font-mono">${ch.checkText}</span>` : ''}
        </div>
        <span class="text-[11px] font-normal text-gray-400 mt-1">${ch.desc || ''}</span>`;
      
      btn.onclick = () => {
        // ★ 防連點：撳落去即刻鎖定所有按鈕
        const allBtns = c.querySelectorAll('button');
        allBtns.forEach(b => {
          b.disabled = true;
          b.classList.add('opacity-50', 'cursor-not-allowed');
        });
        ch.action();
      };
      grid.appendChild(btn);
    });
    c.appendChild(grid);
  },

  clearChoices() { document.getElementById('interactionPanel').innerHTML = ''; },

  setScene(badge, title) {
    if (badge) document.getElementById('sceneBadge').textContent = badge;
    if (title) document.getElementById('sceneTitle').textContent = title;
  }
};