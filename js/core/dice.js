const DiceSystem = {
  check({ title, attr, dc, tags, onComplete }) {
    soundEngine.playDiceRoll();
    const eff = getEffectiveStats();
    const mod = Math.floor((eff[attr] - 10) / 2);
    const tagResult = TagUtils.bonus(tags);

    const modal = document.getElementById('diceModal');
    const visual = document.getElementById('d20Visual');
    const banner = document.getElementById('diceCritBanner');
    const titleEl = document.getElementById('diceCheckTitle');
    const formulaEl = document.getElementById('diceCheckFormula');
    const valueEl = document.getElementById('d20ValueDisplay');
    const breakdown = document.getElementById('diceBreakdown');

    titleEl.textContent = title;
    const parts = [`修正 ${mod >= 0 ? '+' : ''}${mod}`];
    if (tagResult.detail.length) parts.push(...tagResult.detail);
    formulaEl.textContent = `DC ${dc} | ${parts.join(' + ')}`;
    banner.classList.add('hidden');
    valueEl.textContent = '...';
    visual.className = 'w-24 h-24 rounded-2xl bg-gradient-to-tr from-cinnabar-dark via-cinnabar to-wuxiaGold flex items-center justify-center text-white text-3xl font-black shadow-2xl border-2 border-parchment-200/50 dice-rolling';
    modal.classList.remove('hidden');

    setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + mod + tagResult.total;
      visual.classList.remove('dice-rolling');
      valueEl.textContent = d20;

      const nat20 = d20 === 20, nat1 = d20 === 1;
      let success = total >= dc;
      if (nat20) { success = true; this._banner(banner, '★ 大成功 · 天人合一 ★', 'gold'); soundEngine.playGong(); }
      else if (nat1) { success = false; this._banner(banner, '☠ 大失敗 · 走火失手 ☠', 'red'); }
      else if (success) soundEngine.playBladeClash();

      const tagStr = tagResult.total ? ` + Tag(${tagResult.total})` : '';
      breakdown.textContent = `[${d20}] + 屬性(${mod})${tagStr} = ${total} vs DC ${dc} (${success ? '通過' : '失敗'})`;

      G.diceCallback = () => {
        modal.classList.add('hidden');
        HUD.log('dice', `【${title}】1d20(${d20}) + ${mod}${tagStr} = ${total} (DC ${dc}) ➔ ${success ? '通過' : '失敗'}`);
        onComplete({ success, d20, total, nat20, nat1 });
      };
    }, 600);
  },

  _banner(el, text, variant) {
    el.textContent = text;
    el.className = 'text-xs font-black tracking-widest uppercase py-1 px-3 rounded-full mb-3 inline-block ' +
      (variant === 'gold' ? 'bg-wuxiaGold text-black' : 'bg-red-800 text-white');
    el.classList.remove('hidden');
  },

  resolve() {
    if (G.diceCallback) { G.diceCallback(); G.diceCallback = null; }
  }
};