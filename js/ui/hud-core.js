const HUDCore = {
  getStatusBadgeHtml(type, countOrVal, extra) {
    if (type === 'poison') return `<span class="wuxia-status-badge status-poison shadow-xs"><span>☠️ 劇毒 ${countOrVal}層</span><span class="status-badge-count">${extra}回</span></span>`;
    if (type === 'bleed') return `<span class="wuxia-status-badge !bg-[#fef2f2] !text-[#b91c1c] !border-[#fca5a5] shadow-xs"><span>🩸 流血 ${countOrVal}%</span><span class="status-badge-count">${extra}回</span></span>`;
    if (type === 'seal') return `<span class="wuxia-status-badge !bg-[#7f1d1d] !text-[#fca5a5] !border-[#dc2626] shadow-xs"><span>🚫 封脈(全封)</span><span class="status-badge-count">${countOrVal}回</span></span>`;
    if (type === 'silence') return `<span class="wuxia-status-badge !bg-[#fefce8] !text-[#854d0e] !border-[#fde047] shadow-xs"><span>🔇 封招</span><span class="status-badge-count">${countOrVal}回</span></span>`;
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

      if (p.loadout.inner && p.loadout.inner[0]) {
        const art = G.data.MARTIAL_ARTS[p.loadout.inner[0]];
        if (art) {
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#f0fdf4] border-[#bbf7d0] text-[#166534] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `🧘 運轉【${art.name}】`;
          span.setAttribute('data-tooltip', 'art');
          span.setAttribute('data-id', art.id);
          loadoutContainer.appendChild(span);
        }
      }
      
      if (p.loadout.attack) {
        p.loadout.attack.forEach(id => {
          if (!id) return;
          const art = G.data.MARTIAL_ARTS[id];
          if (!art) return;
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#fef2f2] border-[#fecdd3] text-[#991b1b] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `⚔️ 裝備【${art.name}】`;
          span.setAttribute('data-tooltip', 'art');
          span.setAttribute('data-id', art.id);
          loadoutContainer.appendChild(span);
        });
      }

      if (p.loadout.utility && p.loadout.utility[0]) {
        const art = G.data.MARTIAL_ARTS[p.loadout.utility[0]];
        if (art) {
          const span = document.createElement('span');
          span.className = 'px-2 py-0.5 rounded border text-[11px] bg-[#faf5ff] border-[#d8b4fe] text-[#7e22ce] shadow-2xs cursor-help transition-transform hover:scale-105';
          span.innerHTML = `💨 身法【${art.name}】`;
          span.setAttribute('data-tooltip', 'art');
          span.setAttribute('data-id', art.id);
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
        span.setAttribute('data-tooltip', 'tag');
        span.setAttribute('data-id', t);
        container.appendChild(span);
      });
    }

    const repEl = document.getElementById('hudReputation');
    const repLabelEl = document.getElementById('hudReputationLabel');
    if (repEl) {
      const rep = p.reputation || 0;
      let label = '江湖名聲';
      let colorCls = 'text-[#2c1f14]';

      if (rep >= 50) { label = '俠名遠播'; colorCls = 'text-[#15803d]'; }
      else if (rep >= 15) { label = '小有名氣'; colorCls = 'text-[#16a34a]'; }
      else if (rep > -15) { label = '無名之輩'; colorCls = 'text-[#8a7561]'; }
      else if (rep > -50) { label = '惡名昭彰'; colorCls = 'text-[#dc2626]'; }
      else { label = '臭名遠播'; colorCls = 'text-[#b91c1c]'; }

      repEl.textContent = rep;
      repEl.className = `font-mono text-base font-black ${colorCls}`;

      if (repLabelEl) {
        repLabelEl.textContent = label;
        repLabelEl.className = `text-[10px] ${colorCls} block font-bold`;
      }
    }

    const contEl = document.getElementById('hudContribution');
    if (contEl) contEl.textContent = p.contribution || 0;

    const moralityBadge = document.getElementById('hudMoralityBadge');
    if (moralityBadge) {
      const rep = p.reputation || 0;
      const mor = p.morality || 0;
      
      const isRepHighPos = rep >= 15;
      const isRepHighNeg = rep <= -15;
      const isRepZero = !isRepHighPos && !isRepHighNeg;

      const isMorHighPos = mor >= 15;
      const isMorHighNeg = mor <= -15;
      const isMorZero = !isMorHighPos && !isMorHighNeg;

      let title = '正邪不染';
      let styleCls = 'text-[#594432] bg-[#f5ede0] border-[#cfc0a9]';

      if (isRepHighPos && isMorHighPos) { title = '名門大俠'; styleCls = 'text-[#15803d] bg-[#f0fdf4] border-[#86efac] shadow-[0_0_8px_rgba(22,163,74,0.25)]'; } 
      else if (isRepHighNeg && isMorHighNeg) { title = '魔道巨擘'; styleCls = 'text-[#991b1b] bg-[#fef2f2] border-[#f87171] shadow-[0_0_8px_rgba(185,28,28,0.25)]'; } 
      else if (isRepHighPos && isMorHighNeg) { title = '偽善君子'; styleCls = 'text-[#b45309] bg-[#fffbeb] border-[#fde68a] shadow-[0_0_8px_rgba(217,119,6,0.25)]'; } 
      else if (isRepHighNeg && isMorHighPos) { title = '孤膽俠客'; styleCls = 'text-[#1d4ed8] bg-[#eff6ff] border-[#bfdbfe] shadow-[0_0_8px_rgba(59,130,246,0.25)]'; } 
      else if (isRepZero && isMorHighPos) { title = '隱世高人'; styleCls = 'text-[#047857] bg-[#ecfdf5] border-[#a7f3d0]'; } 
      else if (isRepZero && isMorHighNeg) { title = '隱世邪修'; styleCls = 'text-[#7f1d1d] bg-[#fef2f2] border-[#fca5a5]'; } 
      else if (isRepHighPos && isMorZero) { title = '江湖名流'; styleCls = 'text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]'; } 
      else if (isRepHighNeg && isMorZero) { title = '過街老鼠'; styleCls = 'text-[#dc2626] bg-[#fef2f2] border-[#fca5a5]'; } 
      else { title = '無名小卒'; styleCls = 'text-[#78614c] bg-[#fbf9f4] border-[#d8ccb8]'; }

      moralityBadge.className = `seal-stamp text-xs py-1 px-3 rounded-sm font-serif font-black tracking-wider transition-all ${styleCls}`;
      moralityBadge.textContent = title;
      moralityBadge.setAttribute('data-tooltip', 'alignment');
      moralityBadge.dataset.title = title;
      moralityBadge.dataset.rep = rep;
      moralityBadge.dataset.mor = mor;
    }
  },

  updateGauges() {
    const p = G.player; if (!p) return;

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

      if (p.isPoisoned > 0) badgesHtml += this.getStatusBadgeHtml('poison', p.poisonStacks || 1, p.isPoisoned);
      if (p.isBleeding > 0) badgesHtml += this.getStatusBadgeHtml('bleed', Math.floor((p.bleedPct || 0.1) * 100), p.isBleeding);
      if (p.isSealed > 0) badgesHtml += this.getStatusBadgeHtml('seal', p.isSealed);
      if (p.isSilenced > 0) badgesHtml += this.getStatusBadgeHtml('silence', p.isSilenced);
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

  log(type, text, stanceOrSpeaker = '旁白') {
    const c = document.getElementById('narrativeLogs');
    if (!c) return;
    
    const safeText = text !== undefined && text !== null ? String(text) : '';

    const e = document.createElement('div');
    
    let formattedText = safeText
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
    
    const isCombat = (typeof G !== 'undefined' && G.currentSystem === 'combat');
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 gap-2.5 w-full font-serif'; 
    
    choices.forEach(ch => {
      const btn = document.createElement('button');
      
      if (ch.disabled) {
        const isEventLocked = !!ch.lockReason;
        btn.className = `relative p-3.5 rounded-lg border border-[#e5dcce] bg-[#f5f3ee] text-left flex flex-col justify-between opacity-60 cursor-not-allowed select-none ${isEventLocked ? 'grayscale' : ''}`;
        
        let rightBadge = '';
        if (isEventLocked) {
          rightBadge = `<span class="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#e8decb] text-[#78614c] border border-[#d8ccb8]"><i class="fa-solid fa-lock mr-1"></i>未解鎖</span>`;
        } else if (ch.checkText) {
          rightBadge = `<span class="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-[#e8decb] text-[#78614c] border border-[#d8ccb8]">${ch.checkText}</span>`;
        }

        btn.innerHTML = `
          <div class="flex items-center justify-between w-full mb-1">
            <span class="font-black text-sm tracking-wide text-[#8a7561]">${ch.label}</span>
            ${rightBadge}
          </div>
          <span class="text-xs text-[#a89a88]">${ch.desc || ''}</span>
          ${isEventLocked ? `<div class="text-[11px] text-[#b91c1c] mt-1.5 font-bold bg-[#fef2f2] px-2 py-0.5 rounded inline-block w-max border border-[#fca5a5]">${ch.lockReason}</div>` : ''}
        `;
        
        btn.onclick = () => {
          if (ch.action) ch.action(); 
          else HUD.log('combat', '條件不足，無法使用！', 'neutral');
        };
        grid.appendChild(btn);
        return;
      }

      if (isCombat) {
        const isAttack = ch.primary;
        const cardBgClass = isAttack 
          ? 'bg-gradient-to-r from-[#fff9f8] via-white to-white border border-[#e2a8a4] hover:border-[#a82d25]' 
          : 'bg-white border border-[#d8ccb8] hover:border-[#a82d25]';

        btn.className = `relative p-3 rounded-lg text-left flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group ${cardBgClass}`;

        let rightBadgeHtml = '';
        if (ch.checkText) {
          if (ch.checkText.includes('閃避') || ch.checkText.includes('DC')) {
            rightBadgeHtml = `<span class="text-[11px] px-2.5 py-0.5 rounded font-mono font-bold bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] shadow-2xs">🎲 ${ch.checkText}</span>`;
          } else if (ch.checkText.includes('真氣')) {
            rightBadgeHtml = `<span class="text-[11px] px-2.5 py-0.5 rounded font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] shadow-2xs">${ch.checkText}</span>`;
          } else {
            rightBadgeHtml = `<span class="text-[11px] px-2.5 py-0.5 rounded font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] shadow-2xs">${ch.checkText}</span>`;
          }
        }

        btn.innerHTML = `
          <div class="absolute top-2 bottom-2 left-1.5 w-1 ${isAttack ? 'bg-[#a82d25]' : 'bg-[#78614c]'} rounded-full opacity-80 group-hover:bg-[#a82d25] transition-colors"></div>
          <div class="pl-2.5 w-full">
            <div class="flex items-center justify-between w-full mb-0.5">
              <span class="font-black text-sm sm:text-base tracking-wide text-[#2c1f14] group-hover:text-[#a82d25] transition-colors">${ch.label}</span>
              ${rightBadgeHtml}
            </div>
            ${ch.desc ? `<p class="text-xs text-[#78614c] font-medium leading-relaxed">${ch.desc}</p>` : ''}
          </div>
        `;
        btn.onclick = () => {
          container.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.add('opacity-40', 'cursor-not-allowed'); });
          ch.action();
        };
        grid.appendChild(btn);
        return;
      }

      const hasCheck = !!ch.checkText;
      const cardBgClass = hasCheck 
        ? 'bg-gradient-to-r from-[#fdf6e9] via-[#fcf9f2] to-white border-2 border-[#d4a373] shadow-xs' 
        : 'bg-white border border-[#d8ccb8] shadow-2xs';

      btn.className = `relative p-3.5 rounded-lg text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${cardBgClass} hover:border-[#a82d25] hover:shadow-md hover:-translate-y-0.5 group`;
      
      let checkPrefixHtml = '';
      if (hasCheck) {
        checkPrefixHtml = `<span class="seal-stamp text-[11px] px-2 py-0.5 rounded-sm bg-[#92400e] text-[#fef3c7] border border-[#78350f] font-mono font-bold tracking-wider mr-2 shadow-2xs">🎲 ${ch.checkText}</span>`;
      }

      btn.innerHTML = `
        <div class="absolute top-2 bottom-2 left-1.5 w-1 ${hasCheck ? 'bg-[#b45309]' : 'bg-[#cfc0a9]'} rounded-full opacity-70 group-hover:bg-[#a82d25] transition-colors"></div>
        <div class="pl-2.5 w-full">
          <div class="flex items-center justify-between w-full mb-1">
            <div class="flex items-center flex-wrap gap-1">
              ${checkPrefixHtml}
              <span class="font-black text-sm sm:text-base tracking-wide text-[#2c1f14] group-hover:text-[#a82d25] transition-colors">${ch.label}</span>
            </div>
            <span class="text-xs text-[#b3a490] group-hover:text-[#a82d25] group-hover:translate-x-1 transition-all"><i class="fa-solid fa-chevron-right"></i></span>
          </div>
          ${ch.desc ? `<p class="text-xs text-[#594432] font-medium leading-relaxed mt-0.5">${ch.desc}</p>` : ''}
        </div>
      `;
      
      btn.onclick = () => {
        container.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.add('opacity-40', 'cursor-not-allowed'); });
        ch.action();
      };
      
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

  // 備註：原本 hud.js 的 showEncounterModal / closeEncounterModal 已經在 events.js 手寫，這裡可直接刪除，減少冗餘。
};

// ★ 合併所有 HUD 模塊
const HUD = Object.assign(
  {},
  HUDTooltip,
  HUDEffects,
  HUDCore
);