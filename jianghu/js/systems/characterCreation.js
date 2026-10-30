const CharacterCreationSystem = {
  state: { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} },

  enter() {
    this.state = { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} };
    // ★ 移除 this.renderOrigins(); 因為 Step 1 仲未需要睇 Origin
    this.selectGender('male');
    this.renderStatBoard();
    this.goToStep(1);
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
    
    // ★ 關鍵：當去到 Step 2 嗰陣，先至渲染 Origins
    if (n === 2) {
      const picker = document.getElementById('originPicker');
      if (Object.keys(G.data.ORIGINS).length === 0) {
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
    if (this.state.origin === 'entered_sect') this.renderSects();
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
    picker.innerHTML = '';
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
        <div class="text-[10px] text-gray-500">屬性總和：${Object.values(o.baseStats).reduce((a, b) => a + b, 0)}</div>`;
      picker.appendChild(div);
    });
  },

   selectOrigin(id) {
    const o = G.data.ORIGINS[id];
    this.state.origin = id;
    this.state.sect = null;
    this.state.stats = { ...o.baseStats };
    this.state.freePoints = 10;
    
    const sectPicker = document.getElementById('sectPicker');
    
    // ★ 安全檢查：確保 special 存在且等於 showSectPicker
    if (o.special && o.special.trim() === 'showSectPicker') {
      sectPicker.classList.remove('hidden');
      this.renderSects();
    } else {
      sectPicker.classList.add('hidden');
    }

    this.renderOrigins();
    this.renderStatBoard();
  },
  
  renderSects() {
    const grid = document.getElementById('sectGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (!G.data.SECTS || Object.keys(G.data.SECTS).length === 0) {
      grid.innerHTML = '<div class="text-red-500 text-xs col-span-3">錯誤：未載入門派數據</div>';
      return;
    }

    Object.values(G.data.SECTS).forEach(s => {
      const blocked = s.genderLimit && s.genderLimit !== this.state.gender;
      const selected = this.state.sect === s.id;
      const div = document.createElement('div');
      div.className = 'p-3 rounded-xl border-2 transition ' +
        (blocked ? 'opacity-40 cursor-not-allowed border-ink-border' :
         selected ? 'border-cinnabar bg-ink-900 cursor-pointer' :
         'border-ink-border bg-ink-900/60 hover:bg-ink-900 cursor-pointer');
      if (!blocked) div.onclick = () => { 
        this.state.sect = s.id; 
        this.renderSects(); 
      };
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-black text-sm text-parchment-100">${s.name}</span>
          ${blocked ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400">限制</span>' : ''}
        </div>
        <p class="text-[10px] text-gray-400">${s.desc}</p>`;
      grid.appendChild(div);
    });
  },

  applyOrigin() {
    const o = G.data.ORIGINS[this.state.origin];
    this.state.stats = { ...o.baseStats }; // 呢度會讀取 Excel 嘅 0、2、3
    
    if (this.state.origin === 'entered_sect' && this.state.sect) {
      this.state.stats = { ...G.data.SECTS[this.state.sect].sectStats };
    }
    this.state.freePoints = 10; // ★ 改成 10 點
    this.renderStatBoard();
    this.renderSummary();
  },

 renderStatBoard() {
    const board = document.getElementById('statBoard');
    board.innerHTML = '';
    
    Object.keys(STATS_INFO).forEach(k => {
      const val = this.state.stats[k] !== undefined ? this.state.stats[k] : 0; 
      
      const div = document.createElement('div');
      div.className = 'bg-ink-800 p-2.5 rounded-lg border border-ink-border text-xs';
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <!-- ★ 只顯示屬性名，冇咗修正值 -->
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
    if (this.state.origin === 'entered_sect' && this.state.sect)
      return G.data.SECTS[this.state.sect].sectStats;
    return G.data.ORIGINS[this.state.origin].baseStats; // 回傳 0, 2, 3 等
  },

  renderSummary() {
    const o = G.data.ORIGINS[this.state.origin];
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

    // ★ 修改 1：喺計修正值之前，先計出「真實屬性」（UI數值 + 10 基礎值）
    const finalStats = {};
    Object.keys(s.stats).forEach(k => {
      finalStats[k] = 10 + s.stats[k];
    });

    // ★ 修改 2：用 finalStats 嚟計修正值（conMod, dexMod, wisMod）
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
      stats: finalStats, // ★ 修改 3：將包含 +10 嘅真實屬性傳入玩家數據
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