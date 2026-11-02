const CharacterCreationSystem = {
  state: { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} },

  enter() {
    this.state = { step: 1, gender: 'male', origin: null, sect: null, freePoints: 10, stats: {} };
    this.selectGender('male');
    this.renderStatBoard();
    this.goToStep(1);
    
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
    return 'py-2.5 rounded-xl border text-sm font-black transition cursor-pointer shadow-xs ' +
      (active 
        ? 'border-[#a82d25] bg-[#fff5f5] text-[#a82d25]' 
        : 'border-[#cfc0a9] bg-white text-[#78614c] hover:bg-[#f7efe0]');
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
      div.className = `p-4 rounded-xl border cursor-pointer transition shadow-xs ${
        selected 
          ? 'border-2 border-[#a82d25] bg-[#fffaf8]' 
          : 'border-[#d8ccb8] bg-white hover:border-[#a82d25] hover:bg-[#fffdfa]'
      }`;
      div.onclick = () => this.selectOrigin(o.id);
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-black text-sm text-[#2c1f14] tracking-wider">${o.name}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] font-bold font-mono">${o.gold} 兩</span>
        </div>
        <p class="text-xs text-[#594432] leading-relaxed mb-2">${o.desc}</p>
        <div class="text-[11px] font-bold text-[#8a7561] tracking-wider">先天屬性總和：${Object.values(o.baseStats || {}).reduce((a, b) => a + b, 0)}</div>`;
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
      const sects = G.data.SECTS || {};
      
      if (Object.keys(sects).length === 0) {
        grid.innerHTML = '<div class="text-[#a82d25] text-sm col-span-3 text-center py-4 border border-[#fca5a5] rounded-xl bg-[#fff5f5]">門派卷宗載入中...</div>';
        return;
      }

      Object.keys(sects).forEach(key => {
        const s = sects[key];
        const blocked = s.genderLimit && s.genderLimit !== this.state.gender;
        const selected = this.state.sect === s.id;
        const borderClass = blocked 
          ? 'border-[#e5dcce] bg-[#f5ede0] opacity-50 cursor-not-allowed' 
          : (selected 
              ? 'border-2 border-[#a82d25] bg-[#fffaf8] shadow-xs' 
              : 'border-[#d8ccb8] bg-white hover:border-[#a82d25] hover:bg-[#fffdfa]');
        
        const card = document.createElement('div');
        card.className = `p-3.5 rounded-xl border cursor-pointer transition ${borderClass}`;
        if (!blocked) card.onclick = () => this.selectSect(s.id);
        
        card.innerHTML = `
          <div class="flex items-center justify-between mb-1">
            <span class="font-black text-sm text-[#2c1f14]">${s.name || '未命名門派'}</span>
            ${blocked ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">限制</span>' : ''}
          </div>
          <p class="text-xs text-[#594432]">${s.desc || ''}</p>
        `;
        grid.appendChild(card);
      });
    } catch (e) {
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

  // ★ 新增：計算升級所需潛力點
  getCostForNextPoint(currentVal) {
    if (currentVal < 3) return 1;
    if (currentVal < 6) return 2;
    if (currentVal < 9) return 3;
    return 4;
  },

  // ★ 新增：計算降級退還潛力點
  getRefundForPoint(prevVal) {
    if (prevVal < 3) return 1;
    if (prevVal < 6) return 2;
    if (prevVal < 9) return 3;
    return 4;
  },

  renderStatBoard() {
    const board = document.getElementById('statBoard');
    if (!board) return;
    board.innerHTML = '';
    
    Object.keys(STATS_INFO).forEach(k => {
      const val = this.state.stats[k] !== undefined ? this.state.stats[k] : 0; 
      const cost = this.getCostForNextPoint(val);
      const canAfford = this.state.freePoints >= cost;
      
      const div = document.createElement('div');
      div.className = 'bg-white p-3 rounded-xl border border-[#d8ccb8] flex flex-col justify-between shadow-xs';
      div.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="font-black text-xs tracking-widest text-[#2c1f14] font-serif">${STATS_INFO[k].name}</span>
          <span class="text-[10px] text-[#8a7561] font-mono font-bold">[+10]</span>
        </div>
        <div class="flex items-center justify-between">
          <button onclick="CharacterCreationSystem.adjustStat('${k}',-1)" class="w-7 h-7 rounded-lg border border-[#cfc0a9] bg-[#f5ede0] hover:bg-[#e8decb] text-[#2c1f14] font-black text-base flex items-center justify-center transition shadow-xs cursor-pointer">-</button>
          <div class="flex flex-col items-center">
            <span class="font-mono text-xl font-black text-[#a82d25] leading-none">${val}</span>
            <span class="text-[9px] text-[#8a7561] mt-0.5">消耗 ${cost}</span>
          </div>
          <button onclick="CharacterCreationSystem.adjustStat('${k}',1)" class="w-7 h-7 rounded-lg border border-[#cfc0a9] bg-[#f5ede0] hover:bg-[#e8decb] text-[#2c1f14] font-black text-base flex items-center justify-center transition shadow-xs cursor-pointer ${!canAfford ? 'opacity-30 cursor-not-allowed' : ''}">+</button>
        </div>`;
      board.appendChild(div);
    });
    document.getElementById('attrRemaining').textContent = this.state.freePoints;
  },

  adjustStat(k, delta) {
    const base = this._baseStats()[k];
    if (delta > 0) {
      // ★ 將上限改為 25（UI 顯示 15，修正值 +7）
      if (this.state.stats[k] >= 25) {
        return alert('該屬性已達先天極限（15）！');
      }
      const cost = this.getCostForNextPoint(this.state.stats[k]);
      if (this.state.freePoints >= cost) {
        this.state.stats[k]++; 
        this.state.freePoints -= cost;
      }
    } else if (delta < 0) {
      if (this.state.stats[k] <= base) return;
      const refund = this.getRefundForPoint(this.state.stats[k] - 1);
      this.state.stats[k]--; 
      this.state.freePoints += refund;
    }
    this.renderStatBoard(); this.renderSummary();
  },

  randomizeStats() {
    const baseStats = this._baseStats();
    const keys = Object.keys(STATS_INFO);
    const totalPoints = 10; // 創角總點數

    let perfectSolutions = []; // 收集所有能完美用完的結果
    let bestStats = null;
    let minRemaining = totalPoints;

    // ★ 核心優化：模擬 300 次，收集所有能剛好用完點數的結果
    for (let trial = 0; trial < 300; trial++) {
      let tempStats = {};
      keys.forEach(k => { tempStats[k] = baseStats[k] || 0; });
      let tempPoints = totalPoints;
      let attempts = 0;

      while (tempPoints > 0 && attempts < 100) {
        attempts++;
        const availableKeys = keys.filter(k => tempStats[k] < 18);
        if (availableKeys.length === 0) break;

        const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        const cost = this.getCostForNextPoint(tempStats[randomKey]);

        if (tempPoints >= cost) {
          tempStats[randomKey]++;
          tempPoints -= cost;
        } else {
          let canAddAny = false;
          for (const k of availableKeys) {
            if (tempPoints >= this.getCostForNextPoint(tempStats[k])) {
              canAddAny = true; break;
            }
          }
          if (!canAddAny) break;
        }
      }

      // 如果完美用完，收集進完美解池
      if (tempPoints === 0) {
        perfectSolutions.push(tempStats);
      }
      
      // 記錄最優解（作備用）
      if (tempPoints < minRemaining) {
        minRemaining = tempPoints;
        bestStats = tempStats;
      }
    }

    let finalStats = null;
    
    // ★ 終極隨機：如果完美解池唔係空嘅，就從入面隨機抽一個！
    if (perfectSolutions.length > 0) {
      const randomIndex = Math.floor(Math.random() * perfectSolutions.length);
      finalStats = perfectSolutions[randomIndex];
      this.state.freePoints = 0;
    } else if (bestStats) {
      finalStats = bestStats;
      this.state.freePoints = minRemaining;
    }

    if (finalStats) {
      Object.keys(STATS_INFO).forEach(k => {
        this.state.stats[k] = finalStats[k];
      });
    }

    this.renderStatBoard();
    this.renderSummary();
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

    // 1. 計算真實屬性
    const finalStats = {};
    Object.keys(s.stats).forEach(k => {
      finalStats[k] = 10 + s.stats[k];
    });

    const conMod = Math.floor((finalStats.con - 10) / 2);
    const dexMod = Math.floor((finalStats.dex - 10) / 2);
    const wisMod = Math.floor((finalStats.wis - 10) / 2);
    const intMod = Math.floor((finalStats.int - 10) / 2); // ★ 新增：悟性修正
    
    let maxHp = (sect ? sect.baseHp : 24) + conMod * 3;
    let maxPos = (sect ? sect.basePos : 14) + Math.max(0, intMod) * 2; 
    let maxQi = (sect ? sect.baseQi : 5) + Math.max(0, wisMod);

    // 2. 處理 Tags
    const tags = [];
    if (G.data.TAGS['origin_' + s.origin]) tags.push('origin_' + s.origin);
    if (s.sect && G.data.TAGS['sect_' + s.sect]) tags.push('sect_' + s.sect);
    tags.push(s.gender === 'male' ? 'gender_male' : 'gender_female');
    (o.initialTags || []).forEach(t => { if (G.data.TAGS[t]) tags.push(t); });
    
    // 3. 處理武學與裝備
    const martialArts = [...(o.initialMartialArts || [])];
    if (sect) martialArts.push(...(sect.startingArts || []));

    const loadout = { attack: [null, null], inner: [null], utility: [null] };
    martialArts.forEach(id => {
      const a = G.data.MARTIAL_ARTS[id];
      if (!a || !a.slot || !loadout[a.slot]) return;
      const idx = loadout[a.slot].indexOf(null);
      if (idx !== -1) loadout[a.slot][idx] = id;
    });

    Object.keys(loadout).forEach(slotKey => {
      loadout[slotKey].forEach(artId => {
        if (!artId) return;
        const art = G.data.MARTIAL_ARTS[artId];
        if (!art) return;

        if (art.grantTags) {
          String(art.grantTags).split('|').map(t => t.trim()).forEach(t => {
            if (t && !tags.includes(t)) tags.push(t);
          });
        }

        if (art.innerEffect) {
          String(art.innerEffect).split('|').forEach(eff => {
            const [key, val] = eff.split(':');
            const num = Number(val);
            if (key === 'maxHp') maxHp += num;
            if (key === 'maxPos') maxPos += num;
            if (key === 'maxQi') maxQi += num;
          });
        }
      });
    });

    // 4. 建立玩家物件
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
      prof: 2,
      morality: 0,
      reputation: 0,
      contribution: 0
    };

    // ★ 關鍵：直接讀取起源表原本的 o.intro
    const originTitle = o.name + (sect ? ` · ${sect.name}` : '');
    const introText = o.intro || `十三歲，${name} 正式邁入江湖。從此以後，一切靠自己。`;

    // 寫入黃皮殘卷 DOM
    const badgeEl = document.getElementById('introScrollOriginBadge');
    if (badgeEl) badgeEl.innerHTML = `<span class="seal-stamp text-[11px] px-2.5 py-0.5">${originTitle}</span>`;
    
    const textEl = document.getElementById('introScrollText');
    if (textEl) textEl.textContent = introText;

    const scrollNameEl = document.getElementById('introScrollName');
    if (scrollNameEl) scrollNameEl.textContent = `【${name}】十三歲 · 志在四方`;

    // 隱藏創角面板，彈出黃皮殘卷
    document.getElementById('screen-setup').classList.add('hidden');
    
    if (typeof soundEngine !== 'undefined' && soundEngine.playGong) {
      soundEngine.playGong();
    }

    const scrollModal = document.getElementById('introScrollModal');
    if (scrollModal) scrollModal.classList.remove('hidden');
  },

  // ★ 玩家點擊「翻開卷宗 · 啟程」後，正式切入主畫面與 lifepath
  proceedToGame() {
    const scrollModal = document.getElementById('introScrollModal');
    if (scrollModal) scrollModal.classList.add('hidden');

    // 展開主畫面與按鈕
    document.getElementById('screen-play').classList.remove('hidden');
    document.getElementById('restartBtn').classList.remove('hidden');
    document.getElementById('overviewBtn').classList.remove('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden');
    document.getElementById('ageBadge').classList.remove('hidden');

    G.currentAge = 13;
    G.usedEvents = [];
    HUD.render();
    HUD.setScene('序幕', '江湖初現');

    // 在背景日誌也記錄這段出身旁白
    const o = G.data.ORIGINS[G.player.origin];
    const introText = o.intro || `十三歲，${G.player.name} 正式邁入江湖。從此以後，一切靠自己。`;
    HUD.log('narrative', introText);

    // 正式啟動成長期
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