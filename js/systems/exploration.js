const ExplorationSystem = {
// 在 ExplorationSystem 內替換 enter 方法：
  enter() {
    if (G.currentSeason === undefined) G.currentSeason = 0;
    this.updateHeader();
    HUD.render();
    HUD.closeEncounterModal();
    HUD.clearChoices();

    const seasonNames = ['春', '夏', '秋', '冬'];
    HUD.setScene(`${G.currentAge}歲 · ${seasonNames[G.currentSeason]}季`, '江湖歷練');
    
    const seasonText = {
      0: '春風拂柳，萬物復甦，江湖道上旅人絡繹不絕。',
      1: '夏日炎炎，蟬鳴躁動，各方勢力暗流湧動。',
      2: '秋風蕭瑟，落葉紛飛，正是俠客仗劍獨行之時。',
      3: '冬雪皚皚，天地肅殺，荒郊驛站爐火正旺。'
    }[G.currentSeason];

    HUD.log('narrative', `${seasonText} 佇立於分岔路口，你打算如何行動？`);

    // 升級為江湖木牌選項
    HUD.renderChoices([
      { 
        label: '🏮 入酒肆打聽風聲', 
        desc: '尋座沽酒，探聽各方門派動向與江湖秘聞。', 
        primary: false, 
        customClass: 'wuxia-explore-card',
        action: () => this.doAction('tavern') 
      },
      { 
        label: '🌲 出城遊歷', 
        desc: '踏足山川荒野，極易遭遇突發奇遇、綠林劫道或前人遺府。', 
        primary: false, 
        customClass: 'wuxia-explore-card',
        action: () => this.doAction('explore') 
      },
      { 
        label: '🧘 閉關', 
        desc: '尋覓靜室調勻周天真氣，回滿全狀態，沉澱 1 點潛力。', 
        primary: false, 
        customClass: 'wuxia-explore-card',
        action: () => this.doAction('retreat') 
      }
    ]);
  },

  updateHeader() {
    const badge = document.getElementById('ageBadge');
    if (badge) {
      badge.classList.remove('hidden');
      badge.textContent = `${G.currentAge}歲 · ${['春','夏','秋','冬'][G.currentSeason]}季`;
    }
  },

  doAction(actionType) {
    if (actionType === 'retreat') {
      HUD.log('lifepath', T('retreat'));
      EffectSystem.apply({ hp: 999, pos: 999, qi: 999 });

      // ★ 新增：閉關有 30% 機率移除一個 debuff
      const debuffs = (G.player.tags || []).filter(t => t.startsWith('debuff_'));
      if (debuffs.length > 0 && Math.random() < 0.3) {
        const removeId = debuffs[Math.floor(Math.random() * debuffs.length)];
        if (TagUtils.remove(removeId)) {
          const tagName = G.data.TAGS[removeId]?.name || removeId;
          HUD.log('lifepath', T('debuff_heal', { tag: tagName }));
        }
      }

      LifepathSystem.endYear(1);
    } else {
      const eventId = this.pickNextEvent(actionType);
      if (eventId) {
        EventSystem.load(eventId);
      } else {
        HUD.log('narrative', T('empty_explore'));
        this.endEvent(); 
      }
    }
  },

  pickNextEvent(actionType) {
    return EventPicker.pick({ 
      isLifepath: false, 
      actionType: actionType 
    });
  },

  // ★ 補回呢個方法
  endEvent() {
    SaveSystem.save();
    this.nextSeason();
  },

  nextSeason() {
    G.currentSeason++;
    
    // 只有跨年嗰下先彈句提示，四季交替唔好洗版
    if (G.currentSeason >= 4) {
      G.currentSeason = 0;
      G.currentAge++;
      HUD.log('narrative', T('year_passed', { age: G.currentAge }));
    }
    
    SaveSystem.save();
    this.enter(); // 直接渲染下一季的畫面
  }
};
Systems.exploration = ExplorationSystem;