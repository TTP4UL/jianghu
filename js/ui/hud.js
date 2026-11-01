const HUD = {
  // ★ 顏色對照表
  getTagStyle(tag) {
    const grade = tag.grade || 'E';
    switch (grade.toUpperCase()) {
      case 'EX': return 'bg-[#fffbeb] border-[#d97706] text-[#b45309] font-black shadow-sm';
      case 'S':  return 'bg-[#fef2f2] border-[#ef4444] text-[#b91c1c] font-black';
      case 'A':  return 'bg-[#faf5ff] border-[#a855f7] text-[#7e22ce] font-bold';
      case 'B':  return 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8] font-bold';
      case 'C':  return 'bg-[#ecfdf5] border-[#10b981] text-[#047857] font-bold';
      case 'D':  return 'bg-[#f5f5f4] border-[#78716c] text-[#44403c]';
      case 'F':  return 'bg-[#450a0a] border-[#991b1b] text-white font-black';
      case 'E':
      default:   return 'bg-[#f5f5f4] border-[#a8a29e] text-[#57534e]';
    }
  },

  render() {
    const p = G.player; if (!p) return;
    
    const idContainer = document.getElementById('hudIdentityTags'); 
    idContainer.innerHTML = '';
    const origin = G.data.ORIGINS[p.origin];
    if (origin) {
      const tag = document.createElement('span');
      tag.className = 'text-[11px] font-bold px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#f59e0b]';
      tag.textContent = origin.name; idContainer.appendChild(tag);
    }
    if (p.sect && G.data.SECTS[p.sect]) {
      const tag = document.createElement('span');
      tag.className = 'text-[11px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]';
      tag.textContent = G.data.SECTS[p.sect].name; idContainer.appendChild(tag);
    }

    document.getElementById('hudName').textContent = p.name;
    this.updateAgeDisplay();
    document.getElementById('hudAC').textContent = p.ac;
    this.updateGauges();

    // 六維屬性 (換成白底深色字，一目了然)
    const list = document.getElementById('hudStatList'); list.innerHTML = '';
    Object.keys(p.stats).forEach(k => {
      const displayVal = p.stats[k] - 10;
      const item = document.createElement('div');
      item.className = 'bg-[#ffffff] border border-[#d8ccb8] px-3 py-2 rounded-lg flex items-center justify-between shadow-xs';
      item.innerHTML = `<span class="text-[#594432] font-bold font-serif">${STATS_INFO[k].name}</span><span class="font-mono text-base font-black text-[#2c1f14]">${displayVal}</span>`;
      list.appendChild(item);
    });

    // 武學與特性標籤
    const container = document.getElementById('hudSkillsTags'); container.innerHTML = '';
    (p.martialArts || []).forEach(id => {
      const art = G.data.MARTIAL_ARTS[id]; if (!art) return;
      const gradeColor = this.getTagStyle({ grade: art.grade });
      const tag = document.createElement('span');
      tag.className = `px-2 py-0.5 rounded border text-[11px] ${gradeColor}`;
      tag.textContent = `[${art.grade}] ${art.name}`; container.appendChild(tag);
    });

    (p.tags || []).forEach(t => {
      const tag = G.data.TAGS[t];
      if (!tag) return;
      const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
      if (!isVisible) return;
      
      const colorClass = this.getTagStyle(tag);
      const span = document.createElement('span');
      span.className = `px-2 py-0.5 rounded border text-[11px] ${colorClass}`;
      span.textContent = `【${tag.name}】`;
      container.appendChild(span);
    });
  },

// 在 HUD 物件內替換 updateGauges 方法：
  updateGauges() {
    const p = G.player;
    if (!p) return;

    // 1. 氣血更新
    document.getElementById('hudHpCur').textContent = Math.max(0, p.hp);
    document.getElementById('hudHpMax').textContent = p.maxHp;
    document.getElementById('barHp').style.width = `${Math.min(100, Math.max(0, (p.hp / p.maxHp) * 100))}%`;

    // 2. 架勢更新 & 破防警示
    const curPos = Math.max(0, p.pos);
    document.getElementById('hudPosCur').textContent = curPos;
    document.getElementById('hudPosMax').textContent = p.maxPos;
    const barPosEl = document.getElementById('barPos');
    const posContainer = barPosEl.parentElement;
    barPosEl.style.width = `${Math.min(100, Math.max(0, (curPos / p.maxPos) * 100))}%`;

    let brokenTag = document.getElementById('hudPosBrokenTag');
    if (curPos === 0) {
      posContainer.classList.add('posture-broken-box');
      if (!brokenTag) {
        brokenTag = document.createElement('span');
        brokenTag.id = 'hudPosBrokenTag';
        brokenTag.className = 'text-[9px] font-black text-white bg-[#b91c1c] px-1.5 py-0.2 rounded font-mono ml-1.5 animate-pulse';
        brokenTag.textContent = '破綻·重創1.5倍';
        document.getElementById('hudPosCur').parentElement.appendChild(brokenTag);
      }
    } else {
      posContainer.classList.remove('posture-broken-box');
      if (brokenTag) brokenTag.remove();
    }

    // 3. 真氣更新
    document.getElementById('hudQiCur').textContent = Math.max(0, p.qi);
    document.getElementById('hudQiMax').textContent = p.maxQi;
    document.getElementById('barQi').style.width = `${Math.min(100, Math.max(0, (p.qi / p.maxQi) * 100))}%`;

    // ★ 新增：玩家負面狀態標籤顯示
    const idContainer = document.getElementById('hudIdentityTags');
    if (idContainer) {
      // 先清空舊嘅狀態（保留起源/門派標籤）
      const oldStatus = idContainer.querySelectorAll('.player-status-tag');
      oldStatus.forEach(el => el.remove());

      // 顯示中毒
      if (p.isPoisoned > 0) {
        const tag = document.createElement('span');
        tag.className = 'player-status-tag text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f3e8ff] text-[#7e22ce] border border-[#d8b4fe] animate-pulse';
        tag.textContent = `【中毒:${p.isPoisoned}回合】`;
        idContainer.appendChild(tag);
      }
      
      // 顯示眩暈
      if (p.isStunned) {
        const tag = document.createElement('span');
        tag.className = 'player-status-tag text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fef08a] text-[#854d0e] border border-[#fde047] animate-pulse';
        tag.textContent = `【眩暈】`;
        idContainer.appendChild(tag);
      }
    }
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

  // ★ 新增：專屬破防視覺特效（分我方破防 / 敵方破防）
  triggerBreakEffect(isPlayer) {
    this.shakeScreen();
    const screen = document.getElementById('screen-play');
    if (screen) {
      const flashCls = isPlayer ? 'flash-break-player' : 'flash-break-enemy';
      screen.classList.add(flashCls);
      setTimeout(() => screen.classList.remove(flashCls), 600);
    }

    // 觸發對應架勢條震動
    const barEl = isPlayer ? document.getElementById('barPos') : document.getElementById('enemyPosBar');
    if (barEl) {
      barEl.classList.add('bar-shatter');
      setTimeout(() => barEl.classList.remove('bar-shatter'), 400);
    }

    // 浮出破防大字
    const popup = document.createElement('div');
    popup.className = isPlayer ? 'break-popup-player' : 'break-popup-enemy';
    popup.textContent = isPlayer ? '架 勢 崩 潰 !' : '破 綻 大 露 !';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
  },

  log(type, text, stanceOrSpeaker = '旁白') {
    const c = document.getElementById('narrativeLogs');
    if (!c) return;
    const e = document.createElement('div');
    
    // 關鍵字基礎高亮
    let formattedText = text
      .replace(/【暴擊】/g, '<span class="text-[#b45309] font-black">【暴擊】</span>')
      .replace(/【閃避】/g, '<span class="text-[#78716c] font-black">【閃避】</span>')
      .replace(/【破防】/g, '<span class="font-black underline decoration-2">【破防】</span>');

    if (type === 'combat') {
      // 判斷立場：'player'（我方有利 -> 翠綠），'enemy'（敵方有利 -> 硃砂紅），'neutral'（中立/判定 -> 灰褐）
      let stance = stanceOrSpeaker;
      
      // 自動智能 fallback：如果沒帶 stance，自動透過文本語義識別
      if (stance !== 'player' && stance !== 'enemy') {
        if (/命中！|擊敗|你成功|穿透傷害|敵方的護體架勢被打崩|同伴.*出手/.test(text)) {
          stance = 'player';
        } else if (/擊中你|暴擊！|你的護體架勢被打崩|你受到|敵方.*抵擋|化解|閃避了你的/.test(text)) {
          stance = 'enemy';
        } else {
          stance = 'neutral';
        }
      }

      if (stance === 'player') {
        // ★ 我方有利：翡翠綠底綠字（清晰、銳利）
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46] rounded-lg font-bold my-1 shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚔️ ${formattedText}</span><span class="text-[10px] text-[#047857] px-1.5 py-0.2 rounded bg-[#d1fae5] font-mono">優勢</span>`;
      } else if (stance === 'enemy') {
        // ★ 敵方有利／我方受創：硃砂紅底深紅字
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#fecdd3] bg-[#fff1f2] text-[#9f1239] rounded-lg font-bold my-1 shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚠️ ${formattedText}</span><span class="text-[10px] text-[#be123c] px-1.5 py-0.2 rounded bg-[#ffe4e6] font-mono">受創</span>`;
      } else {
        // ★ 中立交鋒/骰點檢定：素雅紙墨灰
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#e5dcce] bg-[#fdfcf9] text-[#44382c] rounded-lg my-1 shadow-2xs';
        e.innerHTML = `<span>🎲 ${formattedText}</span>`;
      }

    } else if (type === 'narrative') {
      // ★ 終極防禦：如果 speaker 係 neutral、空值、或者 undefined，一律轉做「旁白」
      let actualSpeaker = stanceOrSpeaker;
      if (!actualSpeaker || String(actualSpeaker).toLowerCase() === 'neutral' || actualSpeaker === 'undefined') {
        actualSpeaker = '旁白';
      }

      e.className = 'p-3 bg-[#ffffff]/90 border border-[#e5dcce] rounded-lg text-[#2c1f14] shadow-2xs';
      e.innerHTML = `<span class="seal-stamp text-[10px] py-0 mr-2">${actualSpeaker}</span> ${formattedText}`;
    } else if (type === 'dialogue') {
      e.className = 'p-3 bg-[#fdfaf3] border-l-4 border-[#a82d25] border-y border-r border-[#e5dcce] rounded-r-lg text-[#2c1f14] shadow-2xs';
      e.innerHTML = `<span class="text-[#a82d25] font-black">「${stanceOrSpeaker || '神秘人'}」</span>：${formattedText}`;
    } else if (type === 'dice') {
      e.className = 'p-2 bg-[#fefce8] border border-[#fef08a] rounded-lg text-xs font-mono text-[#854d0e] tracking-wider';
      e.innerHTML = `🎲 <b>[檢定]</b> ${formattedText}`;
    } else if (type === 'lifepath') {
      e.className = 'p-2.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] rounded-lg text-xs font-serif';
      e.innerHTML = `✦ <b>【歲月】</b> ${formattedText}`;
    }

    c.appendChild(e);
    setTimeout(() => {
      c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }, 50);
  },

  // 4. 重構選項按鈕 (還原參考圖3的大白底卡片 + 硃砂檢定標籤)
  renderChoices(choices) {
    const container = document.getElementById('interactionPanel');
    if (!container) return;

    container.innerHTML = '';
    if (!choices || !choices.length) return;
    
    // 建立垂直排列容器
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 gap-2.5 w-full'; 
    
    choices.forEach(ch => {
      const btn = document.createElement('button');
      
      // ★ 核心修正：如果按鈕被標記為不可用 (disabled)
      if (ch.disabled) {
        btn.className = `p-3.5 rounded-xl border text-left flex flex-col justify-between opacity-70 cursor-not-allowed bg-[#f5f5f4] border-[#e5dcce]`;
        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-1">
            <span class="font-bold text-sm tracking-wide text-[#a8a29e]">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-[#e5e5e5] text-[#a8a29e]">${ch.checkText}</span>` : ''}
          </div>
          <span class="text-xs font-normal text-[#a8a29e]">${ch.desc || ''}</span>`;
          
        // 撳落去只出提示，唔會鎖死其他掣
        btn.onclick = () => {
          HUD.log('combat', '真氣不足，無法施展絕學！', 'neutral');
        };
      } else {
        // 正常可用按鈕
        btn.className = `p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
          ch.primary
            ? 'wuxia-primary-btn text-white border-[#851e18] shadow-md'
            : 'wuxia-choice-card text-[#2c1f14] border-[#dcd1c2] shadow-sm'
        }`;
        
        const badgeClass = ch.primary 
          ? 'bg-black/20 text-[#fef3c7]'
          : 'bg-[#f5ede0] text-[#a82d25]';

        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-1">
            <span class="font-bold text-sm tracking-wide">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[11px] px-2 py-0.5 rounded font-mono font-bold ${badgeClass}">${ch.checkText}</span>` : ''}
          </div>
          <span class="text-xs font-normal ${ch.primary ? 'text-white/90' : 'text-[#78614c]'}">${ch.desc || ''}</span>`;
        
        // 正常防連點機制
        btn.onclick = () => {
          const allBtns = container.querySelectorAll('button');
          allBtns.forEach(b => {
            b.disabled = true;
            b.classList.add('opacity-50', 'cursor-not-allowed');
          });
          ch.action();
        };
      }
      
      grid.appendChild(btn);
    });
    
    container.appendChild(grid);
  },

  clearChoices() { document.getElementById('interactionPanel').innerHTML = ''; },

  setScene(badge, title) {
    if (badge) document.getElementById('sceneBadge').textContent = badge;
    if (title) document.getElementById('sceneTitle').textContent = title;
  },

  // 四季名稱對照表
  SEASONS: ['春', '夏', '秋', '冬'],

  // 更新頂部與側欄年齡、季度
  updateAgeDisplay() {
    const seasonIdx = (G.currentSeason !== undefined) ? G.currentSeason : 0;
    const seasonName = this.SEASONS[seasonIdx] || '春';
    const stageStr = G.currentAge < 18 ? '成長期' : '歷練期';
    const fullText = `${G.currentAge}歲 · ${seasonName} · ${stageStr}`;
    
    const hudAge = document.getElementById('hudAgeStage');
    if (hudAge) hudAge.textContent = fullText;

    const ageBadge = document.getElementById('ageBadge');
    if (ageBadge) ageBadge.textContent = `${G.currentAge}歲 · ${seasonName}`;
  },

  // 彈出奇遇專屬視窗
  showEncounterModal({ badge, title, subtitle, text, choices }) {
    const modal = document.getElementById('encounterModal');
    if (!modal) return;

    document.getElementById('encounterBadge').textContent = badge || '江湖奇遇';
    document.getElementById('encounterTitle').textContent = title || '未知機緣';
    document.getElementById('encounterSubtitle').textContent = subtitle || `${G.currentAge}歲 · ${this.SEASONS[G.currentSeason || 0]}季`;
    
    const textContainer = document.getElementById('encounterText');
    textContainer.innerHTML = `<p class="indent-7">${text}</p>`;

    const optContainer = document.getElementById('encounterOptions');
    optContainer.innerHTML = '';

    (choices || []).forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'wuxia-choice-card w-full py-3.5 px-4 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer group';
      
      let innerHTML = `<span class="text-sm sm:text-base font-black text-[#2c1f14] tracking-wider group-hover:text-[#a82d25] transition-colors">${ch.label}</span>`;
      if (ch.checkText) {
        if (ch.desc) innerHTML += `<span class="text-[11px] text-[#78716c] mt-0.5 tracking-wider">${ch.desc}</span>`;
        innerHTML += `<span class="mt-1 text-[11px] font-bold text-[#b91c1c] bg-[#fef2f2] border border-[#fca5a5] px-2 py-0.5 rounded tracking-widest font-mono">[${ch.checkText}]</span>`;
      } else if (ch.desc) {
        innerHTML += `<span class="text-[11px] text-[#78716c] mt-0.5 tracking-wider">${ch.desc}</span>`;
      }
      btn.innerHTML = innerHTML;

      btn.onclick = () => {
        optContainer.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          b.classList.add('opacity-40', 'cursor-not-allowed');
        });
        ch.action();
      };

      optContainer.appendChild(btn);
    });

    modal.classList.remove('hidden');
  },

  // 關閉奇遇視窗
  closeEncounterModal() {
    const modal = document.getElementById('encounterModal');
    if (modal) modal.classList.add('hidden');
  }
};

