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

    // ★ 如果有未分配點數（例如存檔時未點完），強制彈出加點
    if (G.pendingPoints > 0) {
      return this.showAllocModal(G.pendingPoints);
    }

    const event = this.pickEvent();
    
    // 如果沒有事件，直接給閉關選項
    if (!event) {
      HUD.setScene(`${G.currentAge}歲 · 平淡`, '歲月靜好');
      HUD.log('narrative', `這一年平平淡淡，沒有發生什麼特別的事。`);
      this.renderLifepathChoices([]);
      return;
    }

    G.usedEvents.push(event.id);
    HUD.setScene(`${G.currentAge}歲 · 成長`, event.title);
    HUD.log(event.speaker ? 'dialogue' : 'narrative', event.text, event.speaker || '旁白');
    
    const choices = G.data.LIFEPATH_CHOICES[event.id] || [];
    this.renderLifepathChoices(choices);
  },

  renderLifepathChoices(choices) {
    // ★ 1. 先過濾：檢查 requireTags 同 forbidTags
    const validChoices = choices.filter(c => {
      if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) return false;
      if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) return false;
      return true;
    });

    // ★ 2. 再生成選項按鈕
    const renderList = validChoices.map(c => ({
      label: c.text,
      checkText: c.type === 'check' ? `${STATS_INFO[c.attr]?.name || c.attr} DC ${c.dc}` : '',
      desc: c.desc,
      primary: c.type === 'check',
      action: () => this.handleChoice(c)
    }));

    // ★ 追加閉關選項 (只有閉關先會有加點)
    renderList.push({
      label: '🧘 閉關修煉 (跳過事件)',
      desc: '專心修煉，回滿氣血與架勢，並額外獲得 1 點潛力。',
      primary: false,
      action: () => {
        HUD.log('narrative', '你選擇避開世俗，閉關修煉。');
        EffectSystem.apply({ hp: 999, pos: 999, qi: 999 }); // 回滿狀態
        this.endYear(1); // ★ 改成 1 點，或者你想 3 點就改 3
      }
    });

    HUD.renderChoices(renderList);
  },

  pickEvent() {
    if (!G.data.LIFEPATH_EVENTS) return null;
    const all = Object.values(G.data.LIFEPATH_EVENTS).filter(e => 
      Number(e.age) === G.currentAge && !G.usedEvents.includes(e.id)
    );
    const specific = all.filter(e => 
      e.requireTags && e.requireTags.length > 0 &&
      TagUtils.hasAll(e.requireTags) &&
      TagUtils.hasNone(e.forbidTags)
    ).sort((a, b) => (b.priority || 0) - (a.priority || 0));
    if (specific.length > 0) return specific[0];
    const common = all.filter(e => 
      (!e.requireTags || e.requireTags.length === 0) &&
      TagUtils.hasNone(e.forbidTags)
    );
    return common[0] || null;
  },

  handleChoice(choice) {
    if (choice.type === 'direct') {
      if (choice.narrative) HUD.log('narrative', choice.narrative);
      EffectSystem.apply(choice.effects);
      
      // ★ 改動：普通選擇完結，直接跳下一年，不觸發加點
      if (choice.next) return switchSystem('events', { startEvent: choice.next });
      G.currentAge++;
      SaveSystem.save();
      setTimeout(() => this.runYear(), 300);
      return;
    }
    if (choice.type === 'check') {
      DiceSystem.check({
        title: choice.checkName, attr: choice.attr, dc: choice.dc, tags: choice.tags,
        onComplete: (res) => {
          const branch = res.success ? choice.success : choice.fail;
          if (branch.narrative) HUD.log('narrative', branch.narrative);
          EffectSystem.apply(branch.effects);
          if (!res.success && branch.failGameOver) return this.gameOver();
          
          // ★ 改動：普通檢定完結，直接跳下一年，不觸發加點
          if (branch.next) return switchSystem('events', { startEvent: branch.next });
          G.currentAge++;
          SaveSystem.save();
          setTimeout(() => this.runYear(), 300);
        }
      });
    }
  },

  // ★ 年尾結算
  endYear(basePoints) {
    G.pendingPoints = basePoints;
    G.tempAllocStats = { ...G.player.stats }; // 備份用於加減
    this.showAllocModal(basePoints);
  },

  showAllocModal(points) {
    if (!G.tempAllocStats) G.tempAllocStats = { ...G.player.stats };
    document.getElementById('allocModal').classList.remove('hidden');
    this.renderAllocBoard();
  },

  renderAllocBoard() {
    const board = document.getElementById('allocStatBoard');
    board.innerHTML = '';
    const baseStats = G.player.stats; // 原始基礎值
    
    Object.keys(STATS_INFO).forEach(k => {
      const val = G.tempAllocStats[k];
      const mod = Math.floor((val - 10) / 2);
      const div = document.createElement('div');
      div.className = 'bg-ink-800 p-2.5 rounded-lg border border-ink-border text-xs';
      div.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-parchment-200">${STATS_INFO[k].name}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-ink-700 text-wuxiaGold font-mono font-bold">${mod >= 0 ? '+' : ''}${mod}</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <button onclick="LifepathSystem.adjustAlloc('${k}',-1)" class="w-6 h-6 rounded bg-ink-700 hover:bg-ink-600 text-white font-bold ${val <= baseStats[k] ? 'opacity-50 cursor-not-allowed' : ''}">-</button>
          <span class="font-mono text-sm font-bold text-white">${val}</span>
          <button onclick="LifepathSystem.adjustAlloc('${k}',1)" class="w-6 h-6 rounded bg-ink-700 hover:bg-ink-600 text-white font-bold ${G.pendingPoints <= 0 ? 'opacity-50 cursor-not-allowed' : ''}">+</button>
        </div>`;
      board.appendChild(div);
    });

    document.getElementById('allocPointsLeft').textContent = G.pendingPoints;
    
    const btn = document.getElementById('allocConfirmBtn');
    if (G.pendingPoints === 0) {
      btn.disabled = false;
      btn.className = 'w-full py-2.5 rounded-xl font-black text-sm bg-cinnabar hover:bg-cinnabar-light text-white shadow-lg transition';
      btn.textContent = '完成分配，繼續前行';
    } else {
      btn.disabled = true;
      btn.className = 'w-full py-2.5 rounded-xl font-black text-sm bg-ink-700 text-gray-500 cursor-not-allowed transition';
      btn.textContent = `還剩 ${G.pendingPoints} 點未分配`;
    }
  },

  adjustAlloc(k, delta) {
    const base = G.player.stats[k];
    if (delta > 0 && G.pendingPoints > 0) {
      if (G.tempAllocStats[k] >= 20) return; // 屬性上限 20
      G.tempAllocStats[k]++;
      G.pendingPoints--;
    } else if (delta < 0) {
      if (G.tempAllocStats[k] <= base) return;
      G.tempAllocStats[k]--;
      G.pendingPoints++;
    }
    this.renderAllocBoard();
  },

  confirmAllocation() {
    if (G.pendingPoints > 0) return;
    
    // 應用到角色
    G.player.stats = { ...G.tempAllocStats };
    G.pendingPoints = 0;
    
    document.getElementById('allocModal').classList.add('hidden');
    HUD.render();
    SaveSystem.save();
    
    // 進入下一年
    G.currentAge++;
    setTimeout(() => this.runYear(), 300);
  },

  enterAdultStage() {
    G.currentAge = 18;
    HUD.render();
    HUD.setScene('第壹章', '踏入江湖');
    HUD.log('narrative', '十八歲，你正式踏入江湖。師門的庇護已經遠去，從此以後，一切靠自己。');
    switchSystem('events', { startEvent: 'act1_inn' });
  },

  gameOver() {
    switchSystem('ending', { id: 'lifepath_death' });
  }
};
Systems.lifepath = LifepathSystem;