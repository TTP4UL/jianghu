const DiceSystem = {
  check({ title, attr, dc, tags, successEffects, failEffects, critSuccessEffects, critFailEffects, onComplete }) {
    soundEngine.playDiceRoll();
    const eff = getEffectiveStats();
    const mod = Math.floor((eff[attr] - 10) / 2);
    const tagResult = TagUtils.bonus(tags, attr);

    const modal = document.getElementById('diceModal');
    const visual = document.getElementById('d20Visual');
    const banner = document.getElementById('diceCritBanner');
    const titleEl = document.getElementById('diceCheckTitle');
    const formulaEl = document.getElementById('diceCheckFormula');
    const valueEl = document.getElementById('d20ValueDisplay');
    const breakdown = document.getElementById('diceBreakdown');

    titleEl.textContent = title;
    formulaEl.innerHTML = `
      <span class="text-xs">屬性修正: ${mod >= 0 ? '+' : ''}${mod} | </span>
      <span class="text-sm font-bold text-[#78614c] ml-1">目標難度 (DC):</span>
      <span class="text-2xl font-black text-[#a82d25] ml-1 tracking-wider">${dc}</span>
    `;
    
    banner.classList.add('hidden');
    breakdown.innerHTML = '<span class="text-[#8a7561] font-serif tracking-wider animate-pulse">命運流轉，凝神擲骰中……</span>';

    // ★ 重置並觸發動畫 (先移除 class 強制重繪)
    visual.classList.remove('dice-rolling');
    void visual.offsetWidth; // 強制瀏覽器 Reflow，保證動畫每次必觸發
    visual.className = 'w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#8a1c14] via-[#a82d25] to-[#c2410c] flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-[#fef3c7]/60 dice-rolling';
    
    valueEl.className = 'dice-fast-number font-mono';
    modal.classList.remove('hidden');

    // ★ 數字極速跳動反饋（每 40ms 跳一個隨機數）
    const rollTimer = setInterval(() => {
      valueEl.textContent = Math.floor(Math.random() * 20) + 1;
    }, 40);

    setTimeout(() => {
      clearInterval(rollTimer);
      valueEl.className = 'font-mono';

      // 1. 決定最終點數
      let d20 = Math.floor(Math.random() * 20) + 1;
      if (G.forceDiceMode === 'crit') d20 = 20;
      if (G.forceDiceMode === 'nineteen') d20 = 19;
      if (G.forceDiceMode === 'two') d20 = 2;
      if (G.forceDiceMode === 'fail') d20 = 1;

      // 2. 結算數值
      const total = d20 + mod + tagResult.total;
      visual.classList.remove('dice-rolling');
      valueEl.textContent = d20;

      const nat20 = d20 === 20;
      const nat1 = d20 === 1;
      let success = total >= dc;
      
      // 3. 成功 / 失敗反饋
      if (nat20) { 
        success = true; 
        this._banner(banner, '★ 大成功 · 天人合一 ★', 'gold'); 
        soundEngine.playGong(); 
      } else if (nat1) { 
        success = false; 
        this._banner(banner, '☠ 大失敗 · 走火失手 ☠', 'red'); 
      } else if (success) {
        soundEngine.playBladeClash();
      }

      let finalEffects = success ? successEffects : failEffects;
      if (nat20 && critSuccessEffects) finalEffects = critSuccessEffects;
      if (nat1 && critFailEffects) finalEffects = critFailEffects;

      const effectText = (typeof parseEffectsToText === 'function') ? parseEffectsToText(finalEffects) : '';

      let html = `
        <div class="mb-2 font-bold text-[#2c1f14] text-lg font-serif">
          總計: <span class="text-xl text-[#a82d25] font-mono">${total}</span> 
          <span class="ml-3 ${success ? 'text-green-700' : 'text-red-700'}">${success ? '通過' : '失手'}</span>
        </div>
      `;
      if (effectText) {
        html += `<div class="text-sm mt-2 text-[#594432] bg-[#f5ede0]/50 p-2 rounded border border-[#d8ccb8] font-serif"><span class="font-bold text-[#b45309]">效果：</span>${effectText}</div>`;
      }

      this.diceCallback = () => {
        modal.classList.add('hidden');
        HUD.log('dice', `【${title}】1d20(${d20}) + 修正(${mod + tagResult.total}) = ${total} (DC ${dc}) ➔ ${success ? '通過' : '失敗'}`);
        onComplete({ success, d20, total, nat20, nat1 });
      };
      
      breakdown.innerHTML = html;
    }, 750);
  },

  _banner(el, text, variant) {
    el.textContent = text;
    el.className = 'text-xs font-black tracking-widest uppercase py-1 px-3 rounded-full mb-3 inline-block font-serif ' +
      (variant === 'gold' ? 'bg-[#b45309] text-white shadow-md' : 'bg-red-800 text-white');
    el.classList.remove('hidden');
  },

  resolve() {
    if (this.diceCallback) { 
      this.diceCallback(); 
      this.diceCallback = null; 
    }
  }
};