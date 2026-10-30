const EndingSystem = {
  enter(payload) {
    const ev = G.data.EVENTS[payload.id];
    if (!ev) return;
    
    HUD.setScene(ev.badge || '終局', ev.title || '一生');
    HUD.log(ev.variant === 'victory' ? 'lifepath' : 'combat', ev.text);
    
    // 總結面板
    const p = G.player;
    const tags = p.tags.filter(t => G.data.TAGS[t]?.visible !== false).map(t => G.data.TAGS[t].name).join(' · ');
    const arts = p.martialArts.map(id => G.data.MARTIAL_ARTS[id]?.name).join(' · ');
    
    HUD.log('narrative', `【一生總結】\n武學：${arts || '無'}\n特性：${tags || '無'}\n金錢：${p.gold} 兩`);
    
    HUD.clearChoices();
    HUD.renderChoices([
      { label: '再活一次', desc: '重新開始遊戲', primary: true, action: () => CharacterCreationSystem.restart() }
    ]);
  }
};
Systems.ending = EndingSystem;