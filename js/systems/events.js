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
      HUD.setScene(ev.badge || '江湖奇遇', ev.title || '未知遭遇');
      if (ev.text) {
        HUD.log(ev.speaker ? 'dialogue' : 'narrative', ev.text, ev.speaker || '旁白');
      }

      document.getElementById('encounterBadge').textContent = ev.badge || '江湖奇遇';
      document.getElementById('encounterTitle').textContent = ev.title || '未知遭遇';
      
      const subtitleEl = document.getElementById('encounterSubtitle');
      if (subtitleEl) {
        subtitleEl.textContent = ev.subtitle || '機緣巧合 · 莫測凶吉';
      }

      document.getElementById('encounterText').innerHTML = `<p class="indent-8 text-justify font-medium leading-relaxed">${ev.text || ''}</p>`;
      
      const optsContainer = document.getElementById('encounterOptions');
      optsContainer.innerHTML = '';
      
      // ★ 改用 ChoiceUtils 處理
      const processedChoices = ChoiceUtils.process(ev.choices || []);

      processedChoices.forEach(ch => {
        const btn = document.createElement('button');
        const hasCheck = !!ch.checkText;

        // 如果你有鎖定狀態，可以喺彈窗度加特別樣式
        const cardBgClass = ch.disabled 
          ? 'bg-[#f5f3ee] border-[#e5dcce] opacity-60 grayscale cursor-not-allowed'
          : hasCheck 
            ? 'bg-gradient-to-r from-[#fdf6e9] via-[#fcf9f2] to-white border-2 border-[#d4a373] shadow-xs hover:border-[#a82d25] hover:shadow-md hover:-translate-y-0.5' 
            : 'bg-white border border-[#d8ccb8] shadow-2xs hover:border-[#a82d25] hover:shadow-md hover:-translate-y-0.5';

        btn.className = `relative w-full p-3.5 rounded-lg text-left flex flex-col justify-between mb-2.5 transition-all duration-200 group font-serif ${cardBgClass}`;

        let checkPrefixHtml = '';
        if (hasCheck) {
          checkPrefixHtml = `
            <span class="seal-stamp text-[11px] px-2 py-0.5 rounded-sm bg-[#92400e] text-[#fef3c7] border border-[#78350f] font-mono font-bold tracking-wider mr-2 shadow-2xs">
              🎲 ${ch.checkText}
            </span>
          `;
        }

        let lockHtml = ch.disabled ? `<span class="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#e8decb] text-[#78614c] border border-[#d8ccb8] ml-2"><i class="fa-solid fa-lock mr-1"></i>未解鎖</span>` : '';
        let descHtml = ch.disabled && ch.lockReason 
          ? `<p class="text-xs text-[#b91c1c] font-bold mt-1 bg-[#fef2f2] px-2 py-0.5 rounded inline-block border border-[#fca5a5]">${ch.lockReason}</p>`
          : (ch.desc ? `<p class="text-xs text-[#594432] font-medium leading-relaxed mt-0.5">${ch.desc}</p>` : '');

        btn.innerHTML = `
          <div class="absolute top-2 bottom-2 left-1.5 w-1 ${hasCheck ? 'bg-[#b45309]' : 'bg-[#cfc0a9]'} rounded-full opacity-70 group-hover:bg-[#a82d25] transition-colors"></div>

          <div class="pl-2.5 w-full">
            <div class="flex items-center justify-between w-full mb-1">
              <div class="flex items-center flex-wrap gap-1">
                ${checkPrefixHtml}
                <span class="font-black text-sm sm:text-base tracking-wide text-[#2c1f14] group-hover:text-[#a82d25] transition-colors">
                  ${ch.label}
                </span>
                ${lockHtml}
              </div>
              <span class="text-xs text-[#b3a490] ${ch.disabled ? '' : 'group-hover:text-[#a82d25] group-hover:translate-x-1'} transition-all">
                <i class="fa-solid fa-chevron-right"></i>
              </span>
            </div>
            ${descHtml}
          </div>
        `;
        
        btn.onclick = () => {
          if (ch.disabled) {
            ch.action(); // 會觸發無法選擇的 log
            return;
          }
          optsContainer.querySelectorAll('button').forEach(b => {
            b.disabled = true;
            b.classList.add('opacity-40', 'cursor-not-allowed');
          });

          document.getElementById('encounterModal').classList.add('hidden');
          HUD.log('narrative', `你選擇了：${ch.label}`);
          ch.action();
        };

        optsContainer.appendChild(btn);
      });

      document.getElementById('encounterModal').classList.remove('hidden');
      return;
    }

    // 4. 普通事件
    HUD.setScene(ev.badge || '江湖', ev.title || '遭遇');
    if (ev.text) HUD.log(ev.speaker ? 'dialogue' : 'narrative', ev.text, ev.speaker || '旁白');

    // ★ 改用 ChoiceUtils 處理
    const formattedChoices = ChoiceUtils.process(ev.choices || []);

    if (formattedChoices.length === 0) {
      HUD.log('narrative', T('no_more_choices'));
      setTimeout(() => {
        if (G.currentAge < 18) LifepathSystem.nextYear();
        else ExplorationSystem.endEvent();
      }, 1000);
      return;
    }

    HUD.renderChoices(formattedChoices);
  },

  handleChoice(choice) {
    // ★ 初始化日誌與事件名
    if (!G.player.lifeLog) G.player.lifeLog = [];
    const evTitle = G.data.EVENTS[choice.eventId]?.title || '江湖奇遇';
    
    if (choice.type === 'direct') {
      if (choice.narrative) HUD.log('narrative', choice.narrative);
      EffectSystem.apply(choice.effects);
      
      // 判斷是否重大事件
      const isMajor = choice.effects && (
        choice.effects.reputation || choice.effects.morality || 
        choice.effects.addMartialArt || choice.effects.addTag
      );

      G.player.lifeLog.push({ 
        age: G.currentAge, 
        event: evTitle, 
        choice: choice.text, 
        result: null,
        isMajor: !!isMajor
      });
      
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
          
          let resultStr = res.nat20 ? '大成功' : res.nat1 ? '大失敗' : res.success ? '成功' : '失敗';
          
          // 判斷是否重大事件
          const isMajor = res.nat20 || res.nat1 || (branch.effects && (
            branch.effects.reputation || branch.effects.morality || 
            branch.effects.addMartialArt || branch.effects.addTag
          ));

          G.player.lifeLog.push({ 
            age: G.currentAge, 
            event: evTitle, 
            choice: choice.text, 
            result: resultStr,
            isMajor: !!isMajor
          });

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
      const targets = String(nextTarget).split('|').map(s => s.trim()).filter(Boolean);
      const chosenId = targets[Math.floor(Math.random() * targets.length)];
      if (G.data.EVENTS[chosenId]) {
        return this.load(chosenId); 
      }
    }
    
    HUD.closeEncounterModal();
    SaveSystem.save();  // ★ 新增
    
    if (G.currentAge < 18) {
      LifepathSystem.nextYear();
    } else {
      ExplorationSystem.endEvent();
    }
  }
};
Systems.events = EventSystem;