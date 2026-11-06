const HUDTooltip = {
  _tooltipTimer: null,

  _positionTooltip(e, tt) {
    if (this._tooltipTimer) {
      clearTimeout(this._tooltipTimer);
      this._tooltipTimer = null;
    }

    tt.classList.remove('hidden');
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    if (x + 260 > window.innerWidth) x = e.clientX - 270;
    if (y + 150 > window.innerHeight) y = e.clientY - 160;
    x = Math.max(10, x);
    y = Math.max(10, y);
    
    tt.style.left = `${x}px`;
    tt.style.top = `${y}px`;
    setTimeout(() => tt.classList.remove('opacity-0'), 10);
  },

  hideTagTooltip() {
    const tt = document.getElementById('tagTooltip');
    if (!tt) return;
    tt.classList.add('opacity-0');
    
    if (this._tooltipTimer) clearTimeout(this._tooltipTimer);
    this._tooltipTimer = setTimeout(() => {
      tt.classList.add('hidden');
      this._tooltipTimer = null;
    }, 200);
  },

  initTooltipEvents() {
    if (this._tooltipInit) return;
    this._tooltipInit = true;

    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-tooltip]');
      if (!el) return;
      
      const fromEl = e.relatedTarget ? e.relatedTarget.closest('[data-tooltip]') : null;
      if (el === fromEl) return;

      const type = el.getAttribute('data-tooltip');
      
      if (type === 'tag') {
        const id = el.getAttribute('data-id');
        if (G.data.TAGS[id]) this.showTagTooltip(e, G.data.TAGS[id]);
      } 
      else if (type === 'art') {
        const id = el.getAttribute('data-id');
        if (G.data.MARTIAL_ARTS[id]) this.showArtTooltip(e, G.data.MARTIAL_ARTS[id]);
      }
      else if (type === 'alignment') {
        const tt = document.getElementById('tagTooltip');
        if (!tt) return;
        document.getElementById('ttTagGrade').textContent = '綜合';
        document.getElementById('ttTagGrade').className = `text-[10px] px-1.5 py-0.5 rounded border font-black bg-[#f5ede0] text-[#594432] border-[#d8ccb8]`;
        document.getElementById('ttTagName').textContent = el.dataset.title;
        document.getElementById('ttTagDesc').innerHTML = `
          江湖對你的看法與你的本心。<br>
          <span class="text-[#047857] font-bold">名聲：</span> ${el.dataset.rep > 0 ? '+' : ''}${el.dataset.rep}<br>
          <span class="text-[#a82d25] font-bold">正邪：</span> ${el.dataset.mor > 0 ? '+' : ''}${el.dataset.mor}
        `;
        document.getElementById('ttTagBonus').classList.add('hidden');
        this._positionTooltip(e, tt);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('[data-tooltip]');
      if (!el) return;
      const toEl = e.relatedTarget ? e.relatedTarget.closest('[data-tooltip]') : null;
      if (el === toEl) return;
      this.hideTagTooltip();
    });

    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-tooltip]');
      if (!el) return;
      if (el.getAttribute('data-tooltip') === 'alignment') return;
      
      const type = el.getAttribute('data-tooltip');
      const id = el.getAttribute('data-id');
      if (type === 'tag' && G.data.TAGS[id]) this.showTagTooltip(e, G.data.TAGS[id]);
      if (type === 'art' && G.data.MARTIAL_ARTS[id]) this.showArtTooltip(e, G.data.MARTIAL_ARTS[id]);
      
      const hide = () => { this.hideTagTooltip(); document.removeEventListener('click', hide); };
      setTimeout(() => document.addEventListener('click', hide), 10);
    });
  },

  showTagTooltip(e, tag) {
    const tt = document.getElementById('tagTooltip');
    if (!tt) return;

    document.getElementById('ttTagGrade').textContent = `[${tag.grade || 'E'}]`;
    document.getElementById('ttTagGrade').className = `text-[10px] px-1.5 py-0.5 rounded border font-black ${this.getTagStyle(tag)}`;
    document.getElementById('ttTagName').textContent = tag.name;
    document.getElementById('ttTagDesc').textContent = tag.desc || '暫無詳細描述。';

    const bonusText = String(tag.bonus || '0').trim();
    const passiveText = String(tag.passiveStats || '').trim();
    const bonusEl = document.getElementById('ttTagBonus');
    let effectStr = '';

    if (!isNaN(bonusText) && Number(bonusText) !== 0) {
      effectStr = `所有檢定 ${Number(bonusText) > 0 ? '+' : ''}${bonusText}`;
    } else if (bonusText.includes(':')) {
      effectStr = bonusText.split('|').map(part => {
        // ★ 核心修正：特別處理 double_attack
        if (part.includes('double_attack')) return '左右互搏（額外攻擊）';
        
        const [attr, val] = part.split(':');
        const num = Number(val);
        if (num === 0 || isNaN(num)) return ''; // 加 isNaN 防呆
        const attrName = { str: '臂力', dex: '身法', con: '根骨', int: '悟性', wis: '心法', cha: '魅力' }[attr] || attr;
        return `${attrName}檢定 ${num > 0 ? '+' : ''}${num}`;
      }).filter(Boolean).join('，');
    }

    // 2. 解析上限加成 (passiveStats)
    let passiveStr = '';
    if (passiveText) {
      passiveStr = passiveText.split('|').map(part => {
        // ★ 核心修正：特別處理 double_attack
        if (part.includes('double_attack')) return '左右互搏';
        
        const [attr, val] = part.split(':');
        const num = Number(val);
        if (num === 0 || isNaN(num)) return ''; // 加 isNaN 防呆
        const attrName = { maxHp: '氣血上限', maxPos: '架勢上限', maxQi: '真氣上限' }[attr] || attr;
        return `${attrName} ${num > 0 ? '+' : ''}${num}`;
      }).filter(Boolean).join('，');
    }

    let finalEffect = [];
    if (effectStr) finalEffect.push(effectStr);
    if (passiveStr) finalEffect.push(passiveStr);

    if (finalEffect.length > 0) {
      bonusEl.classList.remove('hidden');
      const isGlobal = String(tag.global).toLowerCase() === 'true';
      const scopeTag = effectStr 
        ? (isGlobal 
            ? `<span class="text-[9px] bg-[#fef08a] text-[#854d0e] px-1 rounded ml-1 border border-[#fde047]">全局檢定</span>`
            : `<span class="text-[9px] bg-[#e0f2fe] text-[#0369a1] px-1 rounded ml-1 border border-[#bae6fd]">特定檢定</span>`)
        : '';
      
      bonusEl.innerHTML = `效果：${finalEffect.join('，')} ${scopeTag}`;
    } else {
      bonusEl.classList.add('hidden');
    }

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
    
    if (art.slot === 'attack' || art.slot === 'utility') {
      if (art.qiCost) effectParts.push(`消耗 ${art.qiCost} 真氣`);
      
       if (art.slot === 'attack') {
        if (art.fixedDamage) {
          effectParts.push(`固定傷害 ${art.fixedDamage}`);
        } else if (art.diceCount) {
          effectParts.push(`威力 ${art.diceCount}d${art.diceType || 8}`);
        }
        
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

          if (e.includes('self_ac:')) {
            const m = e.match(/self_ac:(-?\d+):(\d+)/);
            if (m) effectParts.push(`自身閃避 ${m[1] > 0 ? '+' : ''}${m[1]} (${m[2]}回合)`);
          }
          if (e.includes('enemy_ac:')) {
            const m = e.match(/enemy_ac:(-?\d+):(\d+)/);
            if (m) effectParts.push(`敵方閃避 ${m[1] > 0 ? '+' : ''}${m[1]} (${m[2]}回合)`);
          }
          
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
    else if (art.slot === 'inner') {
      const statusMap = { poison: '中毒', stun: '眩暈', ac_down: '閃避壓制', bleed: '流血', seal: '封脈', silence: '封招' };

      if (art.innerEffect) {
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
          if (k === 'immune') {
            const statusName = statusMap[String(val).toLowerCase()] || val;
            effectParts.push(`免疫${statusName}`);
          }
        });
      }

      if (art.immune) {
        String(art.immune).split('|').forEach(s => {
          const v = s.trim().toLowerCase();
          if (!v) return;
          const statusName = statusMap[v] || v;
          if (!effectParts.includes(`免疫${statusName}`)) {
            effectParts.push(`免疫${statusName}`);
          }
        });
      }
    }

    const bonusEl = document.getElementById('ttTagBonus');
    bonusEl.classList.remove('hidden'); // 👈 強制移除隱藏狀態
    bonusEl.innerHTML = `<span class="text-[#047857]">效果：</span>${effectParts.join('，') || '無特殊效果'}`;
    this._positionTooltip(e, tt);
  }
};