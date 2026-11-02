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

    const event = this.pickEvent();
    if (!event) {
      HUD.setScene(`${G.currentAge}歲 · 平淡`, '歲月靜好');
      HUD.log('narrative', `這一年平平淡淡，沒有發生什麼特別的事。`);
      this.renderLifepathChoices([]);
      return;
    }

    G.usedEvents.push(event.id);
    HUD.setScene(`${G.currentAge}歲 · 成長`, event.title);
    HUD.log(event.speaker ? 'dialogue' : 'narrative', event.text, event.speaker || '旁白');
    
    // ★ 改動：從 EVENT_CHOICES 讀取選項
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
      action: () => this.handleChoice(c)
    }));

    renderList.push({
      label: '🧘 閉關修煉 (跳過事件)',
      desc: '專心修煉，回滿氣血與架勢，並額外獲得 1 點潛力。',
      primary: false,
      action: () => {
        HUD.log('narrative', '你選擇避開世俗，閉關修煉。');
        EffectSystem.apply({ hp: 999, pos: 999, qi: 999 });
        this.endYear(1); 
      }
    });

    if (renderList.length > 0) {
      HUD.renderChoices(renderList);
    }
  },

  pickEvent() {
    if (!G.data.EVENTS) return null;
    
    // ★ 核心改動：直接從 EVENTS 表抓取符合年齡的事件
    const all = Object.values(G.data.EVENTS).filter(e => {
      // 排除結局
      if (e.type === 'ending') return false;
      
      // 判斷年齡是否符合（支援單一數字或 13-17 範圍）
      if (e.age) {
        if (String(e.age).includes('-')) {
          const [min, max] = String(e.age).split('-').map(Number);
          if (G.currentAge < min || G.currentAge > max) return false;
        } else if (Number(e.age) !== G.currentAge) {
          return false;
        }
      } else {
        // 如果冇填 age，就唔會喺成長期觸發
        return false; 
      }

      // 排除 18 歲以上才觸發嘅歷練事件
      if (Number(e.age) >= 18) return false;

      if (G.usedEvents.includes(e.id)) return false;

      return true;
    });

    // 優先檢查專屬事件
    const specific = all.filter(e => 
      (e.requireTags && e.requireTags.length > 0 && TagUtils.hasAll(e.requireTags)) &&
      TagUtils.hasNone(e.forbidTags)
    ).sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));

    if (specific.length > 0) return specific[0];

    // 普通事件池
    const common = all.filter(e => 
      (!e.requireTags || e.requireTags.length === 0) &&
      TagUtils.hasNone(e.forbidTags)
    );

    if (common.length === 0) return null;

    // 權重抽籤
    const totalWeight = common.reduce((sum, e) => sum + (Number(e.weight) || 10), 0);
    let rand = Math.random() * totalWeight;

    for (const ev of common) {
      const w = Number(ev.weight) || 10;
      if (rand < w) return ev;
      rand -= w;
    }

    return common[0];
  },

  handleChoice(choice) {
    if (choice.type === 'direct') {
      if (choice.narrative) HUD.log('narrative', choice.narrative);
      
      const effectText = parseEffectsToText(choice.effects);
      if (effectText) HUD.log('dice', `【結算】${effectText}`);
      
      EffectSystem.apply(choice.effects);
      
      if (choice.next && G.data.EVENTS[choice.next]) {
        EventSystem.load(choice.next);
      } else {
        this.nextYear();
      }
      return;
    }

    if (choice.type === 'check') {
      DiceSystem.check({
        title: choice.checkName, 
        attr: choice.attr, 
        dc: choice.dc, 
        tags: choice.tags,
        successEffects: choice.success?.effects, 
        failEffects: choice.fail?.effects,
        critSuccessEffects: choice.critSuccess?.effects,
        critFailEffects: choice.critFail?.effects,
        onComplete: (res) => {
          let branch = res.success ? choice.success : choice.fail;
          if (res.nat20 && choice.critSuccess) branch = choice.critSuccess;
          if (res.nat1 && choice.critFail) branch = choice.critFail;
          if (!branch) branch = {};
          
          if (branch.narrative) HUD.log('narrative', branch.narrative);
          
          EffectSystem.apply(branch.effects);
          
          if (!res.success && branch.failGameOver) return this.gameOver();
          
          if (branch.next && G.data.EVENTS[branch.next]) {
            EventSystem.load(branch.next);
          } else {
            this.nextYear();
          }
        }
      });
    }
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

  getCostForNextPoint(currentVal) {
    const displayVal = currentVal - 10;
    if (displayVal < 3) return 1;
    if (displayVal < 6) return 2;
    if (displayVal < 9) return 3;
    return 4;
  },

  getRefundForPoint(prevVal) {
    const displayVal = prevVal - 10;
    if (displayVal < 3) return 1;
    if (displayVal < 6) return 2;
    if (displayVal < 9) return 3;
    return 4;
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
      const cost = this.getCostForNextPoint(rawVal);
      
      // ★ 判斷呢個屬性係咪仲可以升級，而且點數足夠
      const isMaxed = rawVal >= 28; // 上限顯示 18
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

    const savedText = G.player.savedPoints > 0 ? `<span class="text-[10px] text-jade-600 ml-1">(含儲備 ${G.player.savedPoints} 點)</span>` : '';
    document.getElementById('allocPointsLeft').innerHTML = `${G.pendingPoints} ${savedText}`;
    
    const btn = document.getElementById('allocConfirmBtn');
    
    // ★ 如果仲有點數，但係已經冇任何屬性可以升（或者唔夠點數升），就俾佢撳「保留點數並繼續」
    if (G.pendingPoints === 0) {
      btn.disabled = false;
      btn.className = 'wuxia-primary-btn w-full py-3 rounded-xl font-black text-sm tracking-widest cursor-pointer shadow-md transition';
      btn.textContent = '完成分配，繼續前行';
    } else if (!canUpgradeAny) {
      btn.disabled = false;
      btn.className = 'wuxia-primary-btn w-full py-3 rounded-xl font-black text-sm tracking-widest cursor-pointer shadow-md transition border-[#b45309] bg-[#b45309]';
      btn.textContent = `保留 ${G.pendingPoints} 點，繼續前行`;
    } else {
      btn.disabled = true;
      btn.className = 'w-full py-3 rounded-xl font-bold text-sm bg-[#e8decb] text-[#78614c] border border-[#d8cca8] cursor-not-allowed tracking-widest';
      btn.textContent = `還剩 ${G.pendingPoints} 點未分配`;
    }
  },

  adjustAlloc(k, delta) {
    const base = G.player.stats[k];
    const currentVal = G.tempAllocStats[k];

    if (delta > 0) {
      if (currentVal >= 28) return; // ★ 上限 28 (顯示 18)
      const cost = this.getCostForNextPoint(currentVal);
      if (G.pendingPoints >= cost) {
        G.tempAllocStats[k]++;
        G.pendingPoints -= cost;
      }
    } else if (delta < 0) {
      if (currentVal <= base) return;
      const refund = this.getRefundForPoint(currentVal - 1);
      G.tempAllocStats[k]--;
      G.pendingPoints += refund;
    }
    this.renderAllocBoard();
  },

    confirmAllocation() {
    // 移除 if (G.pendingPoints > 0) return; 呢句阻擋！

    // 1. 將未用完嘅點數存入儲備池
    G.player.savedPoints = (G.player.savedPoints || 0) + G.pendingPoints;
    
    // 2. 清零待分配點數
    G.pendingPoints = 0;
    
    // 3. 應用屬性變化
    G.player.stats = { ...G.tempAllocStats };
    
    // 4. 關閉彈窗
    document.getElementById('allocModal').classList.add('hidden');
    HUD.render();
    SaveSystem.save();
    
    // 5. 推進時間
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
    HUD.log('lifepath', '十八歲，你正式踏入江湖。這一年，你開始了自己傳奇的江湖生涯。');
    
    switchSystem('exploration');
    SaveSystem.save();
  }
};
Systems.lifepath = LifepathSystem;