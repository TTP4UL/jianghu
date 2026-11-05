const LifepathSystem = {
  enter() {
    G.currentAge = 13;
    G.usedEvents = [];
    this.runYear();
  },

  runYear() {
    if (G.currentAge > 17) return this.enterAdultStage();
    HUD.render();
    HUD.clearChoices();

    if (G.pendingPoints > 0) {
      return this.showAllocModal(G.pendingPoints);
    }

    const eventId = this.pickEvent();
    if (!eventId) {
      HUD.setScene(`${G.currentAge}歲 · 平淡`, '歲月靜好');
      HUD.log('narrative', T('peaceful_year'));
      this.renderLifepathChoices([]);
      return;
    }

    G.usedEvents.push(eventId);
    
    const event = G.data.EVENTS[eventId];
    if (!event) return;

    // ★ 如果事件是 modal，直接交給 EventSystem 處理彈窗！
    if (event.uiType === 'modal') {
      return EventSystem.load(eventId);
    }

    // ★ 終極防呆：如果連 text 都沒有，直接當作無事發生跳過
    if (!event.text || String(event.text).trim() === '') {
      console.warn('Event missing text:', eventId);
      HUD.setScene(`${G.currentAge}歲 · 平淡`, '歲月靜好');
      HUD.log('narrative', T('peaceful_year'));
      this.renderLifepathChoices([]);
      return;
    }

    // 普通事件維持原樣
    HUD.setScene(`${G.currentAge}歲 · 成長`, event.title || '江湖事');
    HUD.log(event.speaker ? 'dialogue' : 'narrative', event.text, event.speaker || '旁白');
    
    const choices = event.choices || [];
    this.renderLifepathChoices(choices);
  },

  renderLifepathChoices(choices) {
    const validChoices = choices.filter(c => {
      if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) return false;
      if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) return false;
      return true;
    });

    const renderList = validChoices.map(c => ({
      label: c.text,
      checkText: c.type === 'check' ? `${STATS_INFO[c.attr]?.name || c.attr} DC ${c.dc}` : '',
      desc: c.desc,
      primary: c.type === 'check',
      action: () => EventSystem.handleChoice(c)
    }));

    if (renderList.length > 0) {
      HUD.renderChoices(renderList);
    } else {
      // 如果 Excel 忘記填選項，系統會給個安全退出，避免卡死
      HUD.renderChoices([{
        label: '度過這一年',
        desc: '這一年平淡無奇地過去了。',
        primary: true,
        action: () => { G.currentAge++; setTimeout(() => this.runYear(), 300); }
      }]);
    }
  },

  pickEvent() {
    return EventPicker.pick({ 
      isLifepath: true, 
      usedEvents: G.usedEvents 
    });
  },

  nextYear() {
    G.currentAge++;
    setTimeout(() => this.runYear(), 300);
  },

  // ★ 結算時，將之前存落嘅點數加返埋一齊
  endYear(basePoints) {
    G.pendingPoints = basePoints + (G.player.savedPoints || 0);
    G.player.savedPoints = 0; // 清空儲備池，因為已經計入待分配點數
    G.tempAllocStats = { ...G.player.stats };
    this.showAllocModal(G.pendingPoints);
  },

  showAllocModal(points) {
    if (!G.tempAllocStats) G.tempAllocStats = { ...G.player.stats };
    document.getElementById('allocModal').classList.remove('hidden');
    this.renderAllocBoard();
  },

  renderAllocBoard() {
    const board = document.getElementById('allocStatBoard');
    board.innerHTML = '';
    const baseStats = G.player.stats;
    
    // ★ 核心防呆：檢查玩家是否有任何屬性可以升級
    let canUpgradeAny = false;

    Object.keys(STATS_INFO).forEach(k => {
      const rawVal = G.tempAllocStats[k];
      const displayVal = rawVal - 10;
      const addedPoints = rawVal - baseStats[k];
      const mod = Math.floor((rawVal - 10) / 2);
      const cost = StatUtils.getCostForNextPoint(rawVal);
      
      // ★ 判斷呢個屬性係咪仲可以升級，而且點數足夠
      const isMaxed = rawVal >= 25;
      const canAfford = G.pendingPoints >= cost;
      if (!isMaxed && canAfford) canUpgradeAny = true;

      const div = document.createElement('div');
      div.className = 'bg-white p-3.5 rounded-xl border border-[#d8ccb8] flex flex-col justify-between shadow-xs';
      div.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="font-black text-sm tracking-wider text-[#3d2c1d]">${STATS_INFO[k].name}</span>
          <div class="flex items-center gap-1 font-mono text-[11px]">
            ${addedPoints > 0 ? `<span class="text-[#a82d25] font-black">[+${addedPoints}]</span>` : ''}
            <span class="px-1.5 py-0.5 rounded bg-[#f5ede0] text-[#78614c] border border-[#d8ccb8] font-bold">檢定 ${mod >= 0 ? '+' : ''}${mod}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button onclick="LifepathSystem.adjustAlloc('${k}',-1)" 
            class="w-8 h-8 rounded-lg border border-[#cfc0a9] bg-[#f5ede0] hover:bg-[#e8decb] text-[#2c1f14] font-black text-lg transition flex items-center justify-center cursor-pointer shadow-xs ${rawVal <= baseStats[k] ? 'opacity-30 cursor-not-allowed' : ''}">-</button>
          
          <div class="flex flex-col items-center">
            <span class="font-mono text-2xl font-black text-[#2c1f14] leading-none ${isMaxed ? 'text-[#a82d25]' : ''}">${displayVal}</span>
            <span class="text-[9px] text-[#8a7561] mt-1">${isMaxed ? '已達上限' : `消耗 ${cost}`}</span>
          </div>

          <button onclick="LifepathSystem.adjustAlloc('${k}',1)" 
            class="w-8 h-8 rounded-lg border border-[#cfc0a9] bg-[#f5ede0] hover:bg-[#e8decb] text-[#2c1f14] font-black text-lg transition flex items-center justify-center cursor-pointer shadow-xs ${(!canAfford || isMaxed) ? 'opacity-30 cursor-not-allowed' : ''}">+</button>
        </div>`;
      board.appendChild(div);
    });

    const savedText = G.player.savedPoints > 0 ? `<span class="text-[10px] text-[#047857] ml-1 font-bold">(已存 ${G.player.savedPoints} 點)</span>` : '';
    document.getElementById('allocPointsLeft').innerHTML = `${G.pendingPoints} ${savedText}`;
    
    const btn = document.getElementById('allocConfirmBtn');
    
    // ★ 核心修改：永遠解鎖按鈕，讓玩家可以自由決定是否保留點數
    btn.disabled = false;
    if (G.pendingPoints === 0) {
      btn.className = 'wuxia-primary-btn w-full py-3 rounded-xl font-black text-sm tracking-widest cursor-pointer shadow-md transition';
      btn.textContent = '完成分配，繼續前行';
    } else {
      btn.className = 'wuxia-primary-btn w-full py-3 rounded-xl font-black text-sm tracking-widest cursor-pointer shadow-md transition border-[#b45309] bg-[#b45309]'; // 用橙色顯示保留狀態
      btn.textContent = `保留 ${G.pendingPoints} 點，繼續前行`;
    }
  },

  adjustAlloc(k, delta) {
    const base = G.player.stats[k];
    const currentVal = G.tempAllocStats[k];

    if (delta > 0) {
      if (currentVal >= 25) return;
      const cost = StatUtils.getCostForNextPoint(currentVal); // ★ 改為 StatUtils
      if (G.pendingPoints >= cost) {
        G.tempAllocStats[k]++;
        G.pendingPoints -= cost;
      }
    } else if (delta < 0) {
      if (currentVal <= base) return;
      const refund = StatUtils.getRefundForPoint(currentVal - 1);
      G.tempAllocStats[k]--;
      G.pendingPoints += refund;
    }
    this.renderAllocBoard();
  },

  confirmAllocation() {
    G.player.savedPoints = (G.player.savedPoints || 0) + G.pendingPoints;
    G.pendingPoints = 0;
    
    // ★ 核心簡化：使用工具統一處理衍生屬性
    const oldStats = { ...G.player.stats };
    G.player.stats = { ...G.tempAllocStats };
    StatUtils.applyDerivedStats(G.player, oldStats);
    
    document.getElementById('allocModal').classList.add('hidden');
    HUD.render();
    SaveSystem.save();
    
    if (G.currentSystem === 'exploration' || G.currentSystem === 'events') {
      ExplorationSystem.nextSeason();
    } else {
      this.nextYear();
    }
  },

  enterAdultStage() {
    G.currentAge = 18;
    G.currentSeason = 0;
    HUD.render();
    
    // ★ 不再直接顯示文字並切換系統，而是彈出成年 Modal
    document.getElementById('adultModal').classList.remove('hidden');
  },

  // ★ 新增：玩家點擊 Modal 按鈕後，正式進入歷練
  startAdultJourney() {
    document.getElementById('adultModal').classList.add('hidden');
    
    HUD.setScene('第壹章', '江湖歷練');
    HUD.log('lifepath', T('adult_start'));    
    switchSystem('exploration');
    SaveSystem.save();
  }
};
Systems.lifepath = LifepathSystem;