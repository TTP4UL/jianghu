const EventSystem = {
  enter(payload) {
    if (payload && payload.startEvent) {
      this.load(payload.startEvent);
    }
  },

  load(eventId) {
    HUD.clearChoices(); // ★ 關鍵：載入新事件前，先清空舊按鈕！
    const ev = G.data.EVENTS[eventId];
    if (!ev) return console.error('Event not found:', eventId);

    HUD.setScene(ev.badge || '江湖', ev.title || '遭遇');
    if (ev.text) HUD.log(ev.speaker ? 'dialogue' : 'narrative', ev.text, ev.speaker || '旁白');

    if (ev.type === 'combat') {
      // ★ 切換到戰鬥系統
      return switchSystem('combat', { event: ev });
    }

    if (ev.type === 'ending') {
      switchSystem('ending', { id: eventId });
      return;
    }

    // 普通事件
    const choices = ev.choices || [];
    const validChoices = choices.filter(c => {
      if (c.requireTags && c.requireTags.length > 0 && !TagUtils.hasAll(c.requireTags)) return false;
      if (c.forbidTags && c.forbidTags.length > 0 && !TagUtils.hasNone(c.forbidTags)) return false;
      return true;
    });
    HUD.renderChoices(choices.map(c => ({
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
      SaveSystem.save();
      if (choice.next) this.load(choice.next);
      return;
    }

    if (choice.type === 'check') {
      DiceSystem.check({
        title: choice.checkName,
        attr: choice.attr,
        dc: choice.dc,
        tags: choice.tags,
        onComplete: (res) => {
          const branch = res.success ? choice.success : choice.fail;
          if (branch.narrative) HUD.log('narrative', branch.narrative);
          EffectSystem.apply(branch.effects);
          if (branch.next) this.load(branch.next);
        }
      });
    }
  }
};
Systems.events = EventSystem;