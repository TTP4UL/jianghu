const CharacterCreationSystem = {
  state: { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} },

  enter() {
    this.state = { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} };
    this.selectGender('male');
    this.renderStatBoard();
    this.goToStep(1);
    
    // 清空舊嘅 UI 狀態
    const originPicker = document.getElementById('originPicker');
    if (originPicker) originPicker.innerHTML = '';
    const sectPicker = document.getElementById('sectPicker');
    if (sectPicker) sectPicker.classList.add('hidden');
  },

  goToStep(n) {
    const s = this.state;
    if (n === 2 && !document.getElementById('inputName').value.trim()) return alert('請輸入名諱');
    if (n === 3 && !s.origin) return alert('請選擇起源');
    if (n === 3 && s.origin === 'entered_sect' && !s.sect) return alert('請選擇已入門派！');

    [1, 2, 3].forEach(i => document.getElementById(`step-${i}`).classList.toggle('hidden', i !== n));
    [1, 2, 3].forEach(i => {
      const dot = document.getElementById(`dot-${i}`);
      dot.className = 'step-dot' + (i < n ? ' done' : i === n ? ' active' : '');
    });
    s.step = n;
    
    if (n === 2) {
      const picker = document.getElementById('originPicker');
      if (!G.data.ORIGINS || Object.keys(G.data.ORIGINS).length === 0) {
        picker.innerHTML = '<div class="col-span-2 text-center text-gray-400 py-6"><i class="fa-solid fa-spinner fa-spin mr-2"></i>江湖卷宗下載中，請稍候...</div>';
      } else {
        this.renderOrigins();
      }
    }

    if (n === 3) this.applyOrigin();
  },

  selectGender(g) {
    this.state.gender = g;
    document.getElementById('gender-male').className = this._genderCls(g === 'male');
    document.getElementById('gender-female').className = this._genderCls(g === 'female');
    this.renderOrigins();
    this.updateSectPicker();
  },

  _genderCls(active) {
    return 'py-2.5 rounded-xl border-2 text-sm font-bold transition ' +
      (active ? 'border-cinnabar bg-ink-900 text-parchment-100' : 'border-ink-border bg-ink-900/60 text-gray-400');
  },

  rollName() {
    const s = NAME_POOL.surname[Math.floor(Math.random() * NAME_POOL.surname.length)];
    const g = NAME_POOL.given[Math.floor(Math.random() * NAME_POOL.given.length)];
    document.getElementById('inputName').value = s + g;
  },

  renderOrigins() {
    const picker = document.getElementById('originPicker');
    if (!picker) return;
    picker.innerHTML = '';
    
    if (!G.data.ORIGINS || Object.keys(G.data.ORIGINS).length === 0) return;

    Object.values(G.data.ORIGINS).forEach(o => {
      const selected = this.state.origin === o.id;
      const div = document.createElement('div');
      div.className = `p-3.5 rounded-xl border-2 cursor-pointer transition ${
        selected ? 'border-cinnabar bg-ink-900' : 'border-ink-border bg-ink-900/60 hover:bg-ink-900'}`;
      div.onclick = () => this.selectOrigin(o.id);
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-black text-sm text-parchment-100">${o.name}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-wuxiaGold/20 text-wuxiaGold border border-wuxiaGold/30 font-bold">${o.gold} 兩</span>
        </div>
        <p class="text-[11px] text-gray-400 mb-2">${o.desc}</p>
        <div class="text-[10px] text-gray-500">屬性總和：${Object.values(o.baseStats || {}).reduce((a, b) => a + b, 0)}</div>`;
      picker.appendChild(div);
    });
  },

  selectOrigin(id) {
    const o = G.data.ORIGINS[id];
    if (!o) return;

    this.state.origin = id;
    this.state.sect = null;
    this.state.stats = { ...o.baseStats };
    this.state.freePoints = 10;

    this.updateSectPicker();
    this.renderOrigins();
    this.renderStatBoard();
  },

  // ★ 必須要有呢個方法，供 data.js 下載完呼叫
  refreshUI() {
    if (this.state.step === 2) {
      this.renderOrigins();
    }
    this.updateSectPicker();
  },

  updateSectPicker() {
    const sectPicker = document.getElementById('sectPicker');
    const grid = document.getElementById('sectGrid');
    
    if (!sectPicker || !grid) return;

    if (!this.state.origin) {
      sectPicker.classList.add('hidden');
      sectPicker.style.display = 'none';
      return;
    }

    const o = G.data.ORIGINS[this.state.origin];
    if (!o) return;

    const specialStr = String(o.special || '').toLowerCase().trim();

    // ★ 終極防禦：只要係 entered_sect，或者有 show 字眼，就強制顯示！
    if (specialStr.includes('show') || this.state.origin === 'entered_sect') {
      sectPicker.classList.remove('hidden');
      sectPicker.style.display = 'block';
      this.renderSects();
    } else {
      sectPicker.classList.add('hidden');
      sectPicker.style.display = 'none';
    }
  },

  renderSects() {
    try {
      const grid = document.getElementById('sectGrid');
      if (!grid) return;
      
      grid.innerHTML = '';
      let html = '';
      const sects = G.data.SECTS || {};
      
      if (Object.keys(sects).length === 0) {
        grid.innerHTML = '<div class="text-red-500 font-bold text-sm col-span-3 text-center py-4 border border-red-500/50 rounded bg-red-500/10">⚠️ 錯誤：讀取不到門派數據！請檢查 Google Sheet 嘅 Sects 表。</div>';
        return;
      }

      Object.keys(sects).forEach(key => {
        const s = sects[key];
        const blocked = s.genderLimit && s.genderLimit !== this.state.gender;
        const selected = this.state.sect === s.id;
        const borderClass = blocked ? 'border-ink-border opacity-40' : (selected ? 'border-cinnabar bg-ink-900' : 'border-ink-border bg-ink-900/60 hover:bg-ink-900');
        
        html += `
          <div onclick="${blocked ? '' : `CharacterCreationSystem.selectSect('${s.id}')`}" 
               class="p-3 rounded-xl border-2 cursor-pointer transition ${borderClass}">
            <div class="flex items-center justify-between mb-1">
              <span class="font-black text-sm text-parchment-100">${s.name || '未命名門派'}</span>
              ${blocked ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400">限制</span>' : ''}
            </div>
            <p class="text-[10px] text-gray-400">${s.desc || ''}</p>
          </div>
        `;
      });

      grid.innerHTML = html;
    } catch (e) {
      alert('門派渲染出錯: ' + e.message);
      console.error(e);
    }
  },

  selectSect(id) {
    this.state.sect = id;
    this.renderSects();
    this.renderStatBoard();
  },

  applyOrigin() {
    const o = G.data.ORIGINS[this.state.origin];
    if (!o) return;
    this.state.stats = { ...o.baseStats }; 
    
    if (this.state.origin === 'entered_sect' && this.state.sect && G.data.SECTS[this.state.sect]) {
      this.state.stats = { ...G.data.SECTS[this.state.sect].sectStats };
    }
    this.state.freePoints = 10; 
    this.renderStatBoard();
    this.renderSummary();
  },

  renderStatBoard() {
    const board = document.getElementById('statBoard');
    if (!board) return;
    board.innerHTML = '';
    
    Object.keys(STATS_INFO).forEach(k => {
      const val = this.state.stats[k] !== undefined ? this.state.stats[k] : 0; 
      
      const div = document.createElement('div');
      div.className = 'bg-ink-800 p-2.5 rounded-lg border border-ink-border text-xs';
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-parchment-200">${STATS_INFO[k].name}</span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <button onclick="CharacterCreationSystem.adjustStat('${k}',-1)" class="w-6 h-6 rounded bg-ink-700 hover:bg-ink-600 text-white font-bold">-</button>
          <span class="font-mono text-base font-bold text-white">${val}</span>
          <button onclick="CharacterCreationSystem.adjustStat('${k}',1)" class="w-6 h-6 rounded bg-ink-700 hover:bg-ink-600 text-white font-bold">+</button>
        </div>`;
      board.appendChild(div);
    });
    document.getElementById('attrRemaining').textContent = this.state.freePoints;
  },

  adjustStat(k, delta) {
    const base = this._baseStats()[k];
    if (delta > 0 && this.state.freePoints > 0) {
      if (this.state.stats[k] >= 18) return;
      this.state.stats[k]++; this.state.freePoints--;
    } else if (delta < 0) {
      if (this.state.stats[k] <= base) return;
      this.state.stats[k]--; this.state.freePoints++;
    }
    this.renderStatBoard(); this.renderSummary();
  },

  _baseStats() {
    if (this.state.origin === 'entered_sect' && this.state.sect && G.data.SECTS[this.state.sect])
      return G.data.SECTS[this.state.sect].sectStats;
    return G.data.ORIGINS[this.state.origin]?.baseStats || {str:0,dex:0,con:0,int:0,wis:0,cha:0};
  },

  renderSummary() {
    const o = G.data.ORIGINS[this.state.origin];
    if (!o) return;
    const s = this.state.sect ? G.data.SECTS[this.state.sect] : null;
    const arts = [...(o.initialMartialArts || [])];
    if (s) arts.push(...(s.startingArts || []));
    const names = arts.map(id => G.data.MARTIAL_ARTS[id]?.name).filter(Boolean);
    document.getElementById('charSummary').innerHTML = `
      <div><b class="text-wuxiaGold">起源：</b>${o.name}${s ? ` · ${s.name}` : ''}</div>
      <div class="mt-1"><b class="text-wuxiaGold">初始武學：</b>${names.length ? names.join(' · ') : '無'}</div>
      <div class="mt-1"><b class="text-wuxiaGold">金錢：</b>${o.gold} 兩</div>`;
  },

  finish() {
    if (this.state.freePoints > 0) {
      return alert(`請先分配剩下的 ${this.state.freePoints} 點潛力！`);
    }

    const s = this.state;
    const name = document.getElementById('inputName').value.trim() || '無名';
    const o = G.data.ORIGINS[s.origin];
    const sect = s.sect ? G.data.SECTS[s.sect] : null;

    const finalStats = {};
    Object.keys(s.stats).forEach(k => {
      finalStats[k] = 10 + s.stats[k];
    });

    const conMod = Math.floor((finalStats.con - 10) / 2);
    const dexMod = Math.floor((finalStats.dex - 10) / 2);
    const wisMod = Math.floor((finalStats.wis - 10) / 2);
    
    const maxHp = (sect ? sect.baseHp : 24) + conMod * 3;
    const maxPos = (sect ? sect.basePos : 14) + Math.max(0, dexMod) * 2;
    const maxQi = (sect ? sect.baseQi : 5) + Math.max(0, wisMod);

    const tags = [];
    if (G.data.TAGS['origin_' + s.origin]) tags.push('origin_' + s.origin);
    if (s.sect && G.data.TAGS['sect_' + s.sect]) tags.push('sect_' + s.sect);
    tags.push(s.gender === 'male' ? 'gender_male' : 'gender_female');
    (o.initialTags || []).forEach(t => { if (G.data.TAGS[t]) tags.push(t); });
    
    // ★ 奇醜無比判斷
    if (s.stats.cha === 0) {
      tags.push('ugly_af');
    }

    const martialArts = [...(o.initialMartialArts || [])];
    if (sect) martialArts.push(...(sect.startingArts || []));

    const loadout = { attack: [null, null], inner: [null], utility: [null] };
    martialArts.forEach(id => {
      const a = G.data.MARTIAL_ARTS[id];
      if (!a || !a.slot || !loadout[a.slot]) return;
      const idx = loadout[a.slot].indexOf(null);
      if (idx !== -1) loadout[a.slot][idx] = id;
    });

    G.player = {
      name, gender: s.gender, origin: s.origin, sect: s.sect,
      stats: finalStats, 
      hp: maxHp, maxHp, pos: maxPos, maxPos, qi: maxQi, maxQi,
      ac: 10 + dexMod,
      gold: o.gold,
      martialArts,
      tags: [...new Set(tags)],
      companions: [],
      loadout,
      prof: 2
    };

    document.getElementById('screen-setup').classList.add('hidden');
    document.getElementById('screen-play').classList.remove('hidden');
    document.getElementById('restartBtn').classList.remove('hidden');
    document.getElementById('overviewBtn').classList.remove('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden');
    document.getElementById('ageBadge').classList.remove('hidden');
    soundEngine.playGong();

    G.currentAge = 13;
    G.usedEvents = [];
    HUD.render();
    HUD.setScene('序幕', '江湖初現');
    HUD.log('narrative', `十三歲，${name} 正式踏上江湖路。師門的庇護已經遠去，從此以後，一切靠自己。`);

    switchSystem('lifepath');
    SaveSystem.save();
  },

  restart() {
    document.getElementById('screen-play').classList.add('hidden');
    document.getElementById('screen-setup').classList.remove('hidden');
    document.getElementById('restartBtn').classList.add('hidden');
    document.getElementById('overviewBtn').classList.add('hidden');
    document.getElementById('loadoutBtn').classList.add('hidden');
    document.getElementById('ageBadge').classList.add('hidden');
    document.getElementById('narrativeLogs').innerHTML = '';
    document.getElementById('interactionPanel').innerHTML = '';
    document.getElementById('enemyHud').classList.add('hidden');
    G.player = null;
    G.currentAge = 13;
    this.enter();
  }
};
Systems.characterCreation = CharacterCreationSystem;