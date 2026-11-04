const EventSystem = {
  enter(payload) {
    HUD.render();
    if (payload && payload.startEvent) {
      return this.load(payload.startEvent);
    }
    ExplorationSystem.enter(); 
  },

  load(eventId) {
    const ev = G.data.EVENTS[eventId];
    if (!ev) {
      console.error('Event not found:', eventId);
      return ExplorationSystem.endEvent();
    }

    // 1. 結局事件
    if (ev.type === 'ending') {
      return switchSystem('ending', { id: eventId });
    }

    // 2. 戰鬥事件
    if (ev.type === 'combat') {
      return switchSystem('combat', { event: ev });
    }

    // 3. ★ 奇遇彈窗 (uiType === 'modal')
    if (ev.uiType === 'modal') {
      // ★ 核心修正：先寫入右側主日誌，留下歷史紀錄
      HUD.setScene(ev.badge || '江湖奇遇', ev.title || '未知遭遇');
      if (ev.text) {
        HUD.log(ev.speaker ? 'dialogue' : 'narrative', ev.text, ev.speaker || '旁白');
      }

      // 然後再把內容填進彈窗
      document.getElementById('encounterBadge').textContent = ev.badge || '江湖奇遇';
      document.getElementById('encounterTitle').textContent = ev.title || '未知遭遇';
      document.getElementById('encounterText').innerHTML = `<p class="indent-7">${ev.text || ''}</p>`;
      
      const optsContainer = document.getElementById('encounterOptions');
      optsContainer.innerHTML = '';
      
      (ev.choices || []).forEach(c => {
        if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) return;
        if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) return;

        const btn = document.createElement('button');
        btn.className = 'wuxia-choice-card w-full py-3 px-4 rounded-xl text-left border border-[#dcd1c2] flex flex-col justify-between mb-2 hover:border-[#a82d25] transition';
        btn.innerHTML = `
          <div class="flex justify-between items-center w-full">
             <span class="font-bold text-[#2c1f14]">${c.text}</span>
             ${c.type === 'check' ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5]">${STATS_INFO[c.attr]?.name || c.attr} DC ${c.dc}</span>` : ''}
          </div>
          <span class="text-xs text-[#8a7561] mt-1">${c.desc || ''}</span>`;
        
        btn.onclick = () => {
          document.getElementById('encounterModal').classList.add('hidden');
          // 選擇後，在日誌留下選擇的紀錄
          HUD.log('narrative', `你選擇了：${c.text}`);
          this.handleChoice(c);
        };
        optsContainer.appendChild(btn);
      });

      document.getElementById('encounterModal').classList.remove('hidden');
      return;
    }

    // 4. 普通事件
    HUD.setScene(ev.badge || '江湖', ev.title || '遭遇');
    if (ev.text) HUD.log(ev.speaker ? 'dialogue' : 'narrative', ev.text, ev.speaker || '旁白');

    const choices = ev.choices || [];
    const validChoices = choices.filter(c => {
      if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) return false;
      if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) return false;
      return true;
    });

    // ★ 自動補位：如果沒有選項，自動結束
    if (validChoices.length === 0) {
      HUD.log('narrative', '（這件事就此告一段落）');
      setTimeout(() => ExplorationSystem.endEvent(), 1000);
      return;
    }

    HUD.renderChoices(validChoices.map(c => ({
      label: c.text,
      checkText: c.type === 'check' ? `${STATS_INFO[c.attr]?.name || c.attr} DC ${c.dc}` : '',
      desc: c.desc,
      primary: c.type === 'check',
      action: () => this.handleChoice(c)
    })));
  },

  handleChoice(choice) {
    if (choice.type === 'direct') {
      if (choice.narrative) HUD.log('narrative', choice.narrative);
      EffectSystem.apply(choice.effects);
      this.resolveNext(choice.next);
      return;
    }

    if (choice.type === 'check') {
      DiceSystem.check({
        title: choice.checkName, attr: choice.attr, dc: choice.dc, tags: choice.tags,
        successEffects: choice.success?.effects, 
        failEffects: choice.fail?.effects,
        critSuccessEffects: choice.critSuccess?.effects,
        critFailEffects: choice.critFail?.effects,
        onComplete: (res) => {
          let branch = res.success ? (choice.success || {}) : (choice.fail || {});
          
          if (res.nat20 && choice.critSuccess) {
            branch = {
              narrative: choice.critSuccess.narrative || branch.narrative,
              effects: choice.critSuccess.effects || branch.effects,
              next: choice.critSuccess.next || branch.next,
              failGameOver: choice.critSuccess.failGameOver || branch.failGameOver
            };
          }
          if (res.nat1 && choice.critFail) {
            branch = {
              narrative: choice.critFail.narrative || branch.narrative,
              effects: choice.critFail.effects || branch.effects,
              next: choice.critFail.next || branch.next,
              failGameOver: choice.critFail.failGameOver || branch.failGameOver
            };
          }
          
          if (branch.narrative) HUD.log('narrative', branch.narrative);
          EffectSystem.apply(branch.effects);
          
          if (!res.success && branch.failGameOver) {
            return switchSystem('ending', { id: 'lifepath_death' });
          }
          
          this.resolveNext(branch.next);
        }
      });
    }
  },

  resolveNext(nextTarget) {
    if (nextTarget) {
      const targets = String(nextTarget).split(',').map(s => s.trim()).filter(Boolean);
      const chosenId = targets[Math.floor(Math.random() * targets.length)];
      if (G.data.EVENTS[chosenId]) {
        return this.load(chosenId); 
      }
    }
    
    HUD.closeEncounterModal();
    
    // ★ 核心判斷：13-17歲回歸 Lifepath 結算，18歲後回歸 Exploration 結算
    if (G.currentAge < 18) {
      LifepathSystem.nextYear();
    } else {
      ExplorationSystem.endEvent();
    }
  }
};
Systems.events = EventSystem;