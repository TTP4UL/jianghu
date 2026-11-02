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
    
    // 1. 身份與門派標籤
    const idContainer = document.getElementById('hudIdentityTags'); 
    idContainer.innerHTML = '';
    const origin = G.data.ORIGINS[p.origin];
    if (origin) {
      const tag = document.createElement('span');
      tag.className = 'text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] shadow-2xs';
      tag.textContent = origin.name; 
      idContainer.appendChild(tag);
    }
    if (p.sect && G.data.SECTS[p.sect]) {
      const tag = document.createElement('span');
      tag.className = 'text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] shadow-2xs';
      tag.textContent = G.data.SECTS[p.sect].name; 
      idContainer.appendChild(tag);
    }

    document.getElementById('hudName').textContent = p.name;
    this.updateAgeDisplay();
    document.getElementById('hudAC').textContent = p.ac;
    this.updateGauges();

    // 2. 六維屬性 (精簡緊湊，白底黑字)
    const list = document.getElementById('hudStatList'); 
    list.innerHTML = '';
    Object.keys(p.stats).forEach(k => {
      const displayVal = p.stats[k] - 10;
      const item = document.createElement('div');
      item.className = 'bg-[#ffffff] border border-[#d8ccb8] px-2.5 py-1.5 rounded-lg flex items-center justify-between shadow-2xs';
      item.innerHTML = `
        <span class="text-[#594432] font-bold font-serif text-[11px]">${STATS_INFO[k].name}</span>
        <span class="font-mono text-sm font-black text-[#2c1f14]">${displayVal}</span>
      `;
      list.appendChild(item);
    });

    // 3. 江湖聲望與門派印信卡片
    let statusPanel = document.getElementById('hudStatusPanel');
    if (!statusPanel) {
      statusPanel = document.createElement('div');
      statusPanel.id = 'hudStatusPanel';
      statusPanel.className = 'mt-2.5 pt-2 border-t border-[#e8decd]';
      list.parentElement.appendChild(statusPanel);
    }

    const morality = p.morality || 0;
    const rep = p.reputation || 0;
    const contrib = p.contribution || 0;

    let mText = '中立俠客', mColor = 'text-[#78716c]', mBorder = 'border-[#d6d3d1]', mBg = 'bg-[#f5f5f4]';
    if (morality >= 20) { mText = '名門正道', mColor = 'text-[#047857]', mBorder = 'border-[#a7f3d0]', mBg = 'bg-[#ecfdf5]'; }
    if (morality <= -20) { mText = '綠林邪道', mColor = 'text-[#b91c1c]', mBorder = 'border-[#fecdd3]', mBg = 'bg-[#fef2f2]'; }

    statusPanel.innerHTML = `
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] font-black text-[#594432] tracking-wider font-serif">【 江湖威望 】</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded border ${mBorder} ${mBg} ${mColor} font-bold font-serif shadow-2xs">
          ${mText} (${morality > 0 ? '+' : ''}${morality})
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs font-serif">
        <div class="bg-white border border-[#d8ccb8] px-2.5 py-1 rounded-lg flex items-center justify-between shadow-2xs">
          <span class="text-[10px] text-[#8a7561]">聲望</span>
          <span class="font-mono text-sm font-black text-[#b45309]">${rep}</span>
        </div>
        <div class="bg-white border border-[#d8ccb8] px-2.5 py-1 rounded-lg flex items-center justify-between shadow-2xs">
          <span class="text-[10px] text-[#8a7561]">門派貢獻</span>
          <span class="font-mono text-sm font-black text-[#1d4ed8]">${contrib}</span>
        </div>
      </div>
    `;

    // 4. 武學與特性標籤
    const container = document.getElementById('hudSkillsTags'); 
    container.innerHTML = '';
    (p.tags || []).forEach(t => {
      const tag = G.data.TAGS[t];
      if (!tag) return;
      const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
      if (!isVisible) return;
      
      const colorClass = this.getTagStyle(tag);
      const span = document.createElement('span');
      span.className = `px-1.5 py-0.2 rounded border text-[10px] ${colorClass}`;
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
        brokenTag.className = 'text-[9px] font-black text-white bg-[#b91c1c] px-1 py-0.2 rounded font-mono ml-1.5 animate-pulse';
        brokenTag.textContent = '破綻·重創1.5倍';
        document.getElementById('hudPosCur').parentElement.appendChild(brokenTag);
      }
    } else {
      posContainer.classList.remove('posture-broken-box');
      if (brokenTag) brokenTag.remove();
    }

    document.getElementById('hudQiCur').textContent = Math.max(0, p.qi);
    document.getElementById('hudQiMax').textContent = p.maxQi;
    document.getElementById('barQi').style.width = `${Math.min(100, Math.max(0, (p.qi / p.maxQi) * 100))}%`;

    const idContainer = document.getElementById('hudIdentityTags');
    if (idContainer) {
      const oldStatus = idContainer.querySelectorAll('.player-status-tag');
      oldStatus.forEach(el => el.remove());

      if (p.isPoisoned > 0) {
        const tag = document.createElement('span');
        tag.className = 'player-status-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#f3e8ff] text-[#7e22ce] border border-[#d8b4fe] animate-pulse';
        tag.textContent = `【中毒:${p.isPoisoned}回合】`;
        idContainer.appendChild(tag);
      }
      
      if (p.isStunned) {
        const tag = document.createElement('span');
        tag.className = 'player-status-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#fef08a] text-[#854d0e] border border-[#fde047] animate-pulse';
        tag.textContent = `【眩暈】`;
        idContainer.appendChild(tag);
      }

      if (p.buffs) {
        if (p.buffs.shield && p.buffs.shield.turns > 0) {
          const tag = document.createElement('span');
          tag.className = 'player-status-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]';
          tag.textContent = `【減傷:${p.buffs.shield.val}】(${p.buffs.shield.turns}回合)`;
          idContainer.appendChild(tag);
        }
        if (p.buffs.shieldPct && p.buffs.shieldPct.turns > 0) {
          const tag = document.createElement('span');
          tag.className = 'player-status-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]';
          tag.textContent = `【減傷:${p.buffs.shieldPct.val * 100}%】(${p.buffs.shieldPct.turns}回合)`;
          idContainer.appendChild(tag);
        }
        if (p.buffs.reflect && p.buffs.reflect.turns > 0) {
          const tag = document.createElement('span');
          tag.className = 'player-status-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5]';
          tag.textContent = `【反傷:${p.buffs.reflect.val * 100}%】(${p.buffs.reflect.turns}回合)`;
          idContainer.appendChild(tag);
        }
      }
    }
  },

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

  shakeScreen() {
    const mainPanel = document.getElementById('screen-play');
    if (!mainPanel) return;
    mainPanel.classList.add('shake-active');
    setTimeout(() => mainPanel.classList.remove('shake-active'), 400);
  },

  triggerBreakEffect(isPlayer) {
    this.shakeScreen();
    const screen = document.getElementById('screen-play');
    if (screen) {
      const flashCls = isPlayer ? 'flash-break-player' : 'flash-break-enemy';
      screen.classList.add(flashCls);
      setTimeout(() => screen.classList.remove(flashCls), 600);
    }

    const barEl = isPlayer ? document.getElementById('barPos') : document.getElementById('enemyPosBar');
    if (barEl) {
      barEl.classList.add('bar-shatter');
      setTimeout(() => barEl.classList.remove('bar-shatter'), 400);
    }

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
    
    let formattedText = text
      .replace(/【暴擊】/g, '<span class="text-[#b45309] font-black">【暴擊】</span>')
      .replace(/【閃避】/g, '<span class="text-[#78716c] font-black">【閃避】</span>')
      .replace(/【破防】/g, '<span class="font-black underline decoration-2">【破防】</span>');

    if (type === 'combat') {
      let stance = stanceOrSpeaker;
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
        e.className = 'py-1.5 px-2.5 text-xs border border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46] rounded-lg font-bold shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚔️ ${formattedText}</span><span class="text-[9px] text-[#047857] px-1.5 py-0.2 rounded bg-[#d1fae5] font-mono shrink-0 ml-2">優勢</span>`;
      } else if (stance === 'enemy') {
        e.className = 'py-1.5 px-2.5 text-xs border border-[#fecdd3] bg-[#fff1f2] text-[#9f1239] rounded-lg font-bold shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚠️ ${formattedText}</span><span class="text-[9px] text-[#be123c] px-1.5 py-0.2 rounded bg-[#ffe4e6] font-mono shrink-0 ml-2">受創</span>`;
      } else {
        e.className = 'py-1.5 px-2.5 text-xs border border-[#e5dcce] bg-[#fdfcf9] text-[#44382c] rounded-lg shadow-2xs';
        e.innerHTML = `<span>🎲 ${formattedText}</span>`;
      }

    } else if (type === 'narrative') {
      let actualSpeaker = stanceOrSpeaker;
      if (!actualSpeaker || String(actualSpeaker).toLowerCase() === 'neutral' || actualSpeaker === 'undefined') {
        actualSpeaker = '旁白';
      }
      e.className = 'p-2.5 bg-[#ffffff]/90 border border-[#e5dcce] rounded-lg text-[#2c1f14] shadow-2xs leading-relaxed';
      e.innerHTML = `<span class="seal-stamp text-[10px] py-0 mr-2">${actualSpeaker}</span> ${formattedText}`;
    } else if (type === 'dialogue') {
      e.className = 'p-2.5 bg-[#fdfaf3] border-l-4 border-[#a82d25] border-y border-r border-[#e5dcce] rounded-r-lg text-[#2c1f14] shadow-2xs leading-relaxed';
      e.innerHTML = `<span class="text-[#a82d25] font-black">「${stanceOrSpeaker || '神秘人'}」</span>：${formattedText}`;
    } else if (type === 'dice') {
      e.className = 'p-2 bg-[#fefce8] border border-[#fef08a] rounded-lg text-xs font-mono text-[#854d0e] tracking-wider';
      e.innerHTML = `🎲 <b>[檢定]</b> ${formattedText}`;
    } else if (type === 'lifepath') {
      e.className = 'p-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] rounded-lg text-xs font-serif';
      e.innerHTML = `✦ <b>【歲月】</b> ${formattedText}`;
    }

    c.appendChild(e);
    setTimeout(() => {
      c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }, 40);
  },

  // ★ 戰鬥/劇情選項：改用 2 欄緊湊排版，釋放 50% 以上縱向空間
  renderChoices(choices) {
    const container = document.getElementById('interactionPanel');
    if (!container) return;

    container.innerHTML = '';
    if (!choices || !choices.length) return;
    
    const grid = document.createElement('div');
    // 多個選項時啟用 2 欄排列，單個選項全寬
    const colClass = choices.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';
    grid.className = `grid ${colClass} gap-2 w-full`; 
    
    choices.forEach(ch => {
      const btn = document.createElement('button');
      
      if (ch.disabled) {
        btn.className = `p-2.5 rounded-lg border text-left flex flex-col justify-between opacity-60 cursor-not-allowed bg-[#f5f5f4] border-[#e5dcce] transition`;
        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-0.5">
            <span class="font-bold text-xs tracking-wide text-[#a8a29e] truncate">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#e5e5e5] text-[#a8a29e] shrink-0 ml-1">${ch.checkText}</span>` : ''}
          </div>
          <span class="text-[11px] font-normal text-[#a8a29e] line-clamp-1">${ch.desc || ''}</span>`;
          
        btn.onclick = () => {
          HUD.log('combat', '真氣不足，無法施展絕學！', 'neutral');
        };
      } else {
        btn.className = `p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
          ch.primary
            ? 'wuxia-primary-btn text-white border-[#851e18] shadow-sm hover:brightness-105 active:scale-[0.99]'
            : 'wuxia-choice-card text-[#2c1f14] border-[#dcd1c2] shadow-2xs hover:border-[#a82d25] hover:bg-[#fffcf7] active:scale-[0.99]'
        }`;
        
        const badgeClass = ch.primary 
          ? 'bg-black/25 text-[#fef3c7]'
          : 'bg-[#f5ede0] text-[#a82d25]';

        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-0.5">
            <span class="font-bold text-xs sm:text-sm tracking-wide truncate">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${badgeClass} shrink-0 ml-1">${ch.checkText}</span>` : ''}
          </div>
          <span class="text-[11px] font-normal line-clamp-1 ${ch.primary ? 'text-white/85' : 'text-[#78614c]'}">${ch.desc || ''}</span>`;
        
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

  SEASONS: ['春', '夏', '秋', '冬'],

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
      btn.className = 'wuxia-choice-card w-full py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer group';
      
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

  closeEncounterModal() {
    const modal = document.getElementById('encounterModal');
    if (modal) modal.classList.add('hidden');
  }
};