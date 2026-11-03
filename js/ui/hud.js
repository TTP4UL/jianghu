const HUD = {
  getTagStyle(tag) {
    const grade = (tag.grade || 'E').toUpperCase();
    switch (grade) {
      case 'EX': return 'bg-[#fffbeb] border-[#d97706] text-[#b45309] font-black shadow-xs';
      case 'S':  return 'bg-[#fef2f2] border-[#ef4444] text-[#b91c1c] font-black';
      case 'A':  return 'bg-[#faf5ff] border-[#a855f7] text-[#7e22ce] font-bold';
      case 'B':  return 'bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8] font-bold';
      case 'C':  return 'bg-[#ecfdf5] border-[#10b981] text-[#047857] font-bold';
      case 'D':  return 'bg-[#fbf4ea] border-[#c28e5c] text-[#8c531b] font-bold';
      case 'E':  return 'bg-[#f1f3f5] border-[#94a3b8] text-[#475569]';
      case 'F':  return 'bg-[#450a0a] border-[#991b1b] text-white font-black';
      default:   return 'bg-[#f5f5f4] border-[#a8a29e] text-[#57534e]';
    }
  },

  getStatusBadgeHtml(type, countOrVal, extra) {
    if (type === 'poison') return `<span class="wuxia-status-badge status-poison shadow-xs"><span>☠️ 劇毒</span><span class="status-badge-count">${countOrVal}回</span></span>`;
    if (type === 'stun') return `<span class="wuxia-status-badge status-stun shadow-xs"><span>⚡ 點穴眩暈</span></span>`;
    if (type === 'shield') return `<span class="wuxia-status-badge status-shield shadow-xs"><span>🛡️ 減傷 ${countOrVal}</span><span class="status-badge-count">${extra}回</span></span>`;
    if (type === 'shieldPct') return `<span class="wuxia-status-badge status-shield shadow-xs"><span>🛡️ 護體 ${countOrVal}%</span><span class="status-badge-count">${extra}回</span></span>`;
    if (type === 'reflect') return `<span class="wuxia-status-badge status-stun shadow-xs !bg-[#7f1d1d] !text-[#fca5a5] !border-[#dc2626]"><span>🩸 反傷 ${countOrVal}%</span><span class="status-badge-count">${extra}回</span></span>`;
    if (type === 'acMod') {
      const sign = countOrVal > 0 ? '+' : '';
      const color = countOrVal > 0 ? 'status-shield' : 'status-stun';
      return `<span class="wuxia-status-badge ${color} shadow-xs"><span>🌀 閃避 ${sign}${countOrVal}</span><span class="status-badge-count">${extra}回</span></span>`;
    }
    return '';
  },

  _positionTooltip(e, tt) {
    tt.classList.remove('hidden');
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    if (x + 260 > window.innerWidth) x = e.clientX - 270;
    if (y + 150 > window.innerHeight) y = e.clientY - 160;
    tt.style.left = `${x}px`;
    tt.style.top = `${y}px`;
    setTimeout(() => tt.classList.remove('opacity-0'), 10);
  },

  hideTagTooltip() {
    const tt = document.getElementById('tagTooltip');
    if (!tt) return;
    tt.classList.add('opacity-0');
    setTimeout(() => tt.classList.add('hidden'), 200);
  },

  showTagTooltip(e, tag) {
    const tt = document.getElementById('tagTooltip');
    if (!tt) return;
    document.getElementById('ttTagGrade').textContent = `[${tag.grade || 'E'}]`;
    document.getElementById('ttTagGrade').className = `text-[10px] px-1.5 py-0.5 rounded border font-black ${this.getTagStyle(tag)}`;
    document.getElementById('ttTagName').textContent = tag.name;
    document.getElementById('ttTagDesc').textContent = tag.desc || '暫無詳細描述。';

    const bonusText = String(tag.bonus || '0');
    let effectStr = '無特殊加成';
    if (!isNaN(bonusText) && Number(bonusText) !== 0) {
      effectStr = `所有檢定 ${Number(bonusText) > 0 ? '+' : ''}${bonusText}`;
    } else if (bonusText.includes(':')) {
      effectStr = bonusText.split('|').map(part => {
        const [attr, val] = part.split(':');
        const num = Number(val);
        const attrName = { str: '臂力', dex: '身法', con: '根骨', int: '悟性', wis: '心法', cha: '魅力' }[attr] || attr;
        return `${attrName}檢定 ${num > 0 ? '+' : ''}${num}`;
      }).join('，');
    }
    document.getElementById('ttTagBonus').textContent = `效果：${effectStr}`;
    this._positionTooltip(e, tt);
  },

  showArtTooltip(e, art) {
    const tt = document.getElementById('tagTooltip');
    if (!tt) return;

    document.getElementById('ttTagGrade').textContent = `[${art.grade || 'E'}]`;
    document.getElementById('ttTagGrade').className = `text-[10px] px-1.5 py-0.5 rounded border font-black ${this.getTagStyle(art)}`;
    document.getElementById('ttTagName').textContent = art.name;
    document.getElementById('ttTagDesc').innerHTML = art.desc || '暫無詳細描述。';

    let effectParts = [];
    
    // 如果是攻擊或身法，處理 specialEffect
    if (art.slot === 'attack' || art.slot === 'utility') {
      if (art.qiCost) effectParts.push(`消耗 ${art.qiCost} 真氣`);
      
      if (art.slot === 'attack') {
        if (art.fixedDamage) effectParts.push(`固定傷害 ${art.fixedDamage}`);
        else if (art.basePower) effectParts.push(`威力 ${Math.max(1, Math.floor(art.basePower / 10))}d${art.diceType || 8}`);
        
        if (art.hits && Number(art.hits) > 1) effectParts.push(`${art.hits} 連擊`);
      }

      if (art.specialEffect) {
        String(art.specialEffect).split('|').forEach(eff => {
          const e = eff.trim();
          
          if (e.includes('pierce')) effectParts.push('無視架勢');
          if (e.includes('stun')) effectParts.push('附帶眩暈');
          if (e.includes('heal')) effectParts.push('攻擊吸血');
          
          if (e.includes('poison:')) {
            const m = e.match(/poison:(\d+):(\d+)/);
            if (m) effectParts.push(`劇毒 (每回合扣${m[2]}血, ${m[1]}回合)`);
            else effectParts.push('附帶劇毒');
          }

          // 解析閃避加減
          if (e.includes('self_ac:')) {
            const m = e.match(/self_ac:(-?\d+):(\d+)/);
            if (m) effectParts.push(`自身閃避 ${m[1] > 0 ? '+' : ''}${m[1]} (${m[2]}回合)`);
          }
          if (e.includes('enemy_ac:')) {
            const m = e.match(/enemy_ac:(-?\d+):(\d+)/);
            if (m) effectParts.push(`敵方閃避 ${m[1] > 0 ? '+' : ''}${m[1]} (${m[2]}回合)`);
          }
          
          // 解析減傷與反傷
          if (e.includes('shield:')) {
            const m = e.match(/shield:(\d+):(\d+)/);
            if (m) effectParts.push(`固定減傷 ${m[1]} (${m[2]}回合)`);
          }
          if (e.includes('shield_pct:')) {
            const m = e.match(/shield_pct:([\d.]+):(\d+)/);
            if (m) effectParts.push(`百分比減傷 ${parseFloat(m[1]) * 100}% (${m[2]}回合)`);
          }
          if (e.includes('reflect:')) {
            const m = e.match(/reflect:([\d.]+):(\d+)/);
            if (m) effectParts.push(`反彈傷害 ${parseFloat(m[1]) * 100}% (${m[2]}回合)`);
          }
        });
      }
    } 
    // 如果是內功，處理 innerEffect
    else if (art.slot === 'inner' && art.innerEffect) {
      String(art.innerEffect).split('|').forEach(eff => {
        const [key, val] = eff.split(':');
        const k = key.trim().toLowerCase();
        const num = Number(val);
        const sign = num > 0 ? `+${num}` : `${num}`;
        if (k === 'regen' || k === 'hp_regen') effectParts.push(`每回合回血 ${sign}`);
        if (k === 'qi_regen') effectParts.push(`每回合回氣 ${sign}`);
        if (k === 'pos_regen') effectParts.push(`每回合回架勢 ${sign}`);
        if (k === 'maxhp') effectParts.push(`氣血上限 ${sign}`);
        if (k === 'maxqi') effectParts.push(`真氣上限 ${sign}`);
        if (k === 'maxpos') effectParts.push(`架勢上限 ${sign}`);
      });
    }

    document.getElementById('ttTagBonus').innerHTML = `<span class="text-[#047857]">效果：</span>${effectParts.join('，') || '無特殊效果'}`;
    this._positionTooltip(e, tt);
  },

  render() {
    const p = G.player; if (!p) return;
    
    const idContainer = document.getElementById('hudIdentityTags'); 
    if (idContainer) {
      idContainer.innerHTML = '';
      const origin = G.data.ORIGINS[p.origin];
      if (origin) {
        const tag = document.createElement('span');
        tag.className = 'text-[11px] font-bold px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] shadow-2xs';
        tag.textContent = origin.name; idContainer.appendChild(tag);
      }
      if (p.sect && G.data.SECTS[p.sect]) {
        const tag = document.createElement('span');
        tag.className = 'text-[11px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#ef4444] shadow-2xs';
        tag.textContent = G.data.SECTS[p.sect].name; idContainer.appendChild(tag);
      }
    }

    document.getElementById('hudName').textContent = p.name;
    this.updateAgeDisplay();
    
    // ★ 核心修改：顯示真實 AC 與 Buff 加值
    let baseAC = p.ac;
    let finalAC = typeof CombatSystem !== 'undefined' ? CombatSystem.getEffectiveAC(p) : p.ac;
    let diff = finalAC - baseAC;
    
    let acHtml = `<span>${finalAC}</span>`;
    if (diff > 0) acHtml += `<span class="text-[10px] text-[#047857] ml-0.5">(+${diff})</span>`;
    if (diff < 0) acHtml += `<span class="text-[10px] text-[#b91c1c] ml-0.5">(${diff})</span>`;
    document.getElementById('hudAC').innerHTML = acHtml;
    
    this.updateGauges();

    const list = document.getElementById('hudStatList'); 
    if (list) {
      list.innerHTML = '';
      Object.keys(p.stats).forEach(k => {
        const displayVal = p.stats[k] - 10;
        const item = document.createElement('div');
        item.className = 'bg-white border border-[#d8ccb8] px-3 py-2 rounded-lg flex items-center justify-between shadow-2xs hover:border-[#a82d25]/40 transition';
        item.innerHTML = `<span class="text-[#594432] font-black text-xs tracking-wider">${STATS_INFO[k].name}</span><span class="font-mono text-base font-black text-[#2c1f14]">${displayVal}</span>`;
        list.appendChild(item);
      });
    }

    const loadoutContainer = document.getElementById('hudLoadoutTags');
    if (loadoutContainer) {
      loadoutContainer.innerHTML = '';
      if (!p.loadout) p.loadout = { attack: [null, null], inner: [null], utility: [null] };

      // 內功
      if (p.loadout.inner && p.loadout.inner[0]) {
        const art = G.data.MARTIAL_ARTS[p.loadout.inner[0]];
        if (art) {
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#f0fdf4] border-[#bbf7d0] text-[#166534] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `🧘 運轉【${art.name}】`;
          span.onmouseenter = (e) => this.showArtTooltip(e, art);
          span.onmousemove = (e) => this.showArtTooltip(e, art);
          span.onmouseleave = () => this.hideTagTooltip();
          span.onclick = (e) => { e.stopPropagation(); this.showArtTooltip(e, art); const hide = () => { this.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10); };
          loadoutContainer.appendChild(span);
        }
      }
      
      // 招式
      if (p.loadout.attack) {
        p.loadout.attack.forEach(id => {
          if (!id) return;
          const art = G.data.MARTIAL_ARTS[id];
          if (!art) return;
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#fef2f2] border-[#fecdd3] text-[#991b1b] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `⚔️ 裝備【${art.name}】`;
          span.onmouseenter = (e) => this.showArtTooltip(e, art);
          span.onmousemove = (e) => this.showArtTooltip(e, art);
          span.onmouseleave = () => this.hideTagTooltip();
          span.onclick = (e) => { e.stopPropagation(); this.showArtTooltip(e, art); const hide = () => { this.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10); };
          loadoutContainer.appendChild(span);
        });
      }

      // ★ 新增：身法 (紫色標籤)
      if (p.loadout.utility && p.loadout.utility[0]) {
        const art = G.data.MARTIAL_ARTS[p.loadout.utility[0]];
        if (art) {
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#faf5ff] border-[#d8b4fe] text-[#7e22ce] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `💨 身法【${art.name}】`;
          span.onmouseenter = (e) => this.showArtTooltip(e, art);
          span.onmousemove = (e) => this.showArtTooltip(e, art);
          span.onmouseleave = () => this.hideTagTooltip();
          span.onclick = (e) => { e.stopPropagation(); this.showArtTooltip(e, art); const hide = () => { this.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10); };
          loadoutContainer.appendChild(span);
        }
      }
    }

    const container = document.getElementById('hudSkillsTags'); 
    if (container) {
      container.innerHTML = '';
      (p.tags || []).forEach(t => {
        const tag = G.data.TAGS[t];
        if (!tag) return;
        const isVisible = tag.visible !== false && String(tag.visible).toLowerCase() !== 'false' && tag.visible !== 0;
        if (!isVisible) return;
        
        const colorClass = this.getTagStyle(tag);
        const span = document.createElement('span');
        span.className = `px-2 py-0.5 rounded border text-[11px] ${colorClass} shadow-2xs cursor-help transition-transform hover:scale-105`;
        span.textContent = `【${tag.name}】`;
        
        span.onmouseenter = (e) => this.showTagTooltip(e, tag);
        span.onmousemove = (e) => this.showTagTooltip(e, tag);
        span.onmouseleave = () => this.hideTagTooltip();
        span.onclick = (e) => { e.stopPropagation(); this.showTagTooltip(e, tag); const hide = () => { this.hideTagTooltip(); document.removeEventListener('click', hide); }; setTimeout(() => document.addEventListener('click', hide), 10); };
        
        container.appendChild(span);
      });
    }

    const repEl = document.getElementById('hudReputation');
    if (repEl) repEl.textContent = p.reputation || 0;
    const contEl = document.getElementById('hudContribution');
    if (contEl) contEl.textContent = p.contribution || 0;

    const moralityBadge = document.getElementById('hudMoralityBadge');
    if (moralityBadge) {
      const m = p.morality || 0;
      let title = ''; let styleCls = '';
      if (m >= 50) { title = `名門大俠 · 正道 (${m})`; styleCls = 'text-[#15803d] bg-[#f0fdf4] border-[#86efac] shadow-[0_0_8px_rgba(22,163,74,0.25)]'; }
      else if (m >= 15) { title = `俠骨仁心 · 善 (${m})`; styleCls = 'text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]'; }
      else if (m <= -50) { title = `魔道巨擘 · 極惡 (${m})`; styleCls = 'text-[#991b1b] bg-[#fef2f2] border-[#f87171] shadow-[0_0_8px_rgba(185,28,28,0.25)]'; }
      else if (m <= -15) { title = `行事狠辣 · 邪 (${m})`; styleCls = 'text-[#b91c1c] bg-[#fef2f2] border-[#fca5a5]'; }
      else { title = `正邪不染 · 中立 (0)`; styleCls = 'text-[#594432] bg-[#f5ede0] border-[#cfc0a9]'; }
      moralityBadge.className = `seal-stamp text-xs py-1 px-3 rounded-sm font-serif font-black tracking-wider transition-all ${styleCls}`;
      moralityBadge.textContent = title;
    }
  },

  updateGauges() {
    const p = G.player; if (!p) return;

    // ★ 新增：實時更新玩家 AC 與加減值
    let baseAC = p.ac;
    let finalAC = typeof CombatSystem !== 'undefined' ? CombatSystem.getEffectiveAC(p) : p.ac;
    let diff = finalAC - baseAC;
    
    let acHtml = `<span>${finalAC}</span>`;
    if (diff > 0) acHtml += `<span class="text-[11px] text-[#047857] ml-0.5">(+${diff})</span>`;
    if (diff < 0) acHtml += `<span class="text-[11px] text-[#b91c1c] ml-0.5">(${diff})</span>`;
    document.getElementById('hudAC').innerHTML = acHtml;

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
        brokenTag.className = 'text-[9px] font-black text-white bg-[#b91c1c] px-1.5 py-0.2 rounded font-mono ml-1.5 animate-pulse';
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

      const wrapper = document.createElement('div');
      wrapper.className = 'player-status-tag flex items-center gap-1.5 flex-wrap';
      let badgesHtml = '';

      if (p.isPoisoned > 0) badgesHtml += this.getStatusBadgeHtml('poison', p.isPoisoned);
      if (p.isStunned) badgesHtml += this.getStatusBadgeHtml('stun');

      if (p.buffs) {
        if (p.buffs.shield && p.buffs.shield.turns > 0) badgesHtml += this.getStatusBadgeHtml('shield', p.buffs.shield.val, p.buffs.shield.turns);
        if (p.buffs.shieldPct && p.buffs.shieldPct.turns > 0) badgesHtml += this.getStatusBadgeHtml('shieldPct', p.buffs.shieldPct.val * 100, p.buffs.shieldPct.turns);
        if (p.buffs.reflect && p.buffs.reflect.turns > 0) badgesHtml += this.getStatusBadgeHtml('reflect', p.buffs.reflect.val * 100, p.buffs.reflect.turns);
      }

      if (badgesHtml) {
        wrapper.innerHTML = badgesHtml;
        idContainer.appendChild(wrapper);
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
        if (/命中！|擊敗|你成功|穿透傷害|敵方的護體架勢被打崩|同伴.*出手/.test(text)) stance = 'player';
        else if (/擊中你|暴擊！|你的護體架勢被打崩|你受到|敵方.*抵擋|化解|閃避了你的/.test(text)) stance = 'enemy';
        else stance = 'neutral';
      }

      if (stance === 'player') {
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46] rounded-lg font-bold my-1 shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚔️ ${formattedText}</span><span class="text-[10px] text-[#047857] px-1.5 py-0.2 rounded bg-[#d1fae5] font-mono">優勢</span>`;
      } else if (stance === 'enemy') {
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#fecdd3] bg-[#fff1f2] text-[#9f1239] rounded-lg font-bold my-1 shadow-2xs flex items-center justify-between';
        e.innerHTML = `<span>⚠️ ${formattedText}</span><span class="text-[10px] text-[#be123c] px-1.5 py-0.2 rounded bg-[#ffe4e6] font-mono">受創</span>`;
      } else {
        e.className = 'py-2 px-3 text-xs sm:text-[13px] border border-[#e5dcce] bg-[#fdfcf9] text-[#44382c] rounded-lg my-1 shadow-2xs';
        e.innerHTML = `<span>🎲 ${formattedText}</span>`;
      }
    } else if (type === 'narrative') {
      let actualSpeaker = stanceOrSpeaker;
      if (!actualSpeaker || String(actualSpeaker).toLowerCase() === 'neutral' || actualSpeaker === 'undefined') actualSpeaker = '旁白';
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
    setTimeout(() => c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' }), 50);
  },

  renderChoices(choices) {
    const container = document.getElementById('interactionPanel');
    if (!container) return;
    container.innerHTML = '';
    if (!choices || !choices.length) return;
    
    // ★ 核心修改：改成兩欄網格 (手機端單欄，電腦端兩欄)
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2 w-full'; 
    
    choices.forEach(ch => {
      const btn = document.createElement('button');
      
      if (ch.disabled) {
        btn.className = `px-3 py-2 rounded-lg border text-left flex flex-col justify-center opacity-70 cursor-not-allowed bg-[#f5f5f4] border-[#e5dcce] h-full`;
        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-0.5">
            <span class="font-bold text-[13px] tracking-wide text-[#a8a29e]">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#e5e5e5] text-[#a8a29e]">${ch.checkText}</span>` : ''}
          </div>`;
        btn.onclick = () => HUD.log('combat', '真氣不足，無法施展！', 'neutral');
      } else {
        btn.className = `px-3 py-2 rounded-lg border text-left flex flex-col justify-center transition-all ${
          ch.primary 
            ? 'wuxia-primary-btn text-white border-[#851e18] shadow-sm' 
            : 'wuxia-choice-card text-[#2c1f14] border-[#dcd1c2] shadow-xs hover:border-[#a82d25]'
        } h-full`;
        
        const badgeClass = ch.primary 
          ? 'bg-black/20 text-[#fef3c7]'
          : 'bg-[#f5ede0] text-[#a82d25]';

        btn.innerHTML = `
          <div class="flex items-center justify-between w-full">
            <span class="font-bold text-[13px] tracking-wide truncate pr-1">${ch.label}</span>
            ${ch.checkText ? `<span class="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${badgeClass} whitespace-nowrap shrink-0">${ch.checkText}</span>` : ''}
          </div>`;
        
        btn.onclick = () => {
          container.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.add('opacity-50', 'cursor-not-allowed'); });
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
    document.getElementById('encounterText').innerHTML = `<p class="indent-7">${text}</p>`;
    
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
        optContainer.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.add('opacity-40', 'cursor-not-allowed'); });
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