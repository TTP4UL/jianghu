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
      HUD.log('lifepath', '你選擇閉關修煉，真氣與氣血恢復圓滿。');
      EffectSystem.apply({ hp: 999, pos: 999, qi: 999 });
      
      // ★ 核心修正：直接呼叫 LifepathSystem 的結算方法，確保儲備點數正確相加
      LifepathSystem.endYear(1);
    } else {
      const eventId = this.pickNextEvent(actionType);
      if (eventId) {
        EventSystem.load(eventId);
      } else {
        HUD.log('narrative', '你逛了一圈，沒有遇到什麼特別的事。');
        this.endEvent(); 
      }
    }
  },

  pickNextEvent(actionType) {
    if (!G.data.EVENTS) return null;

    const candidates = Object.values(G.data.EVENTS).filter(e => {
      // 1. 排除結局與戰鬥主體
      if (e.type === 'ending' || e.type === 'combat') return false;
      
      // ★ 核心修改：如果 weight 明確填了 0，或者字串 '0'，就絕對不會被隨機抽中！
      if (e.weight !== undefined && e.weight !== '' && Number(e.weight) === 0) return false;

      // 2. 區分酒館與探索
      if (actionType === 'tavern') {
        if (e.badge !== '酒館' && e.uiType !== 'tavern' && !e.title.includes('酒')) return false;
      } else if (actionType === 'explore') {
        if (e.badge === '酒館' || e.uiType === 'tavern') return false;
      }
      
      // 3. 年齡檢查
      if (e.age) {
        if (String(e.age).includes('-')) {
          const [min, max] = e.age.split('-').map(Number);
          if (G.currentAge < min || G.currentAge > max) return false;
        } else if (Number(e.age) !== G.currentAge) {
          return false;
        }
      }

      // 4. Tag 檢查
      if (e.requireTags && e.requireTags.length > 0 && !TagUtils.hasAll(e.requireTags)) return false;
      if (e.forbidTags && e.forbidTags.length > 0 && !TagUtils.hasNone(e.forbidTags)) return false;

      return true;
    });

    if (candidates.length === 0) return null;

    // 5. 優先檢查專屬事件 (例如必定觸發嘅主線)
    const specific = candidates.filter(e => Number(e.priority) > 0)
      .sort((a, b) => Number(b.priority) - Number(a.priority));
      
    if (specific.length > 0) return specific[0].id;

    // 6. 隨機事件池按 weight 抽籤
    const totalWeight = candidates.reduce((sum, e) => {
      // 如果 weight 留空，預設為 10；如果係數字就轉數字
      let w = e.weight;
      if (w === undefined || w === '') w = 10;
      return sum + Number(w);
    }, 0);
    
    let rand = Math.random() * totalWeight;

    for (const ev of candidates) {
      let w = ev.weight;
      if (w === undefined || w === '') w = 10;
      w = Number(w);
      
      if (rand < w) return ev.id;
      rand -= w;
    }

    return candidates[0].id;
  },

  // ★ 自動過渡：不顯示任何按鈕，直接跳季
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
      HUD.log('narrative', `【歲月如梭】轉眼間，又過了一年，你已經 ${G.currentAge} 歲了。`);
    }
    
    SaveSystem.save();
    this.enter(); // 直接渲染下一季的畫面
  }
};
Systems.exploration = ExplorationSystem;