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
    
    const totalMod = mod + tagResult.total;
    formulaEl.innerHTML = `
      <span class="text-xs">總修正: ${totalMod >= 0 ? '+' : ''}${totalMod} | </span>
      <span class="text-sm font-bold text-[#78614c] ml-1">目標難度 (DC):</span>
      <span class="text-2xl font-black text-[#a82d25] ml-1 tracking-wider">${dc}</span>
    `;
    
    // 清除所有舊狀態
    banner.classList.add('hidden');
    banner.classList.remove('banner-stamped');
    visual.classList.remove('crit-success-box', 'crit-fail-box', 'dice-pass-box', 'dice-fail-box');
    valueEl.classList.remove('crit-success-number', 'crit-fail-number', 'dice-pass-number', 'dice-fail-number');

    breakdown.innerHTML = '<span class="text-[#8a7561] font-serif tracking-wider">擲骰中……</span>';

    // 啟動輕微微彈動效
    visual.className = 'w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#8a1c14] via-[#a82d25] to-[#c2410c] flex items-center justify-center text-white text-3xl font-black shadow-md border-2 border-[#fef3c7]/60 dice-rolling';
    valueEl.className = 'dice-fast-number font-mono';
    modal.classList.remove('hidden');

    // 數字高速跳動（每 35ms 跳一個隨機數）
    const rollTimer = setInterval(() => {
      valueEl.textContent = Math.floor(Math.random() * 20) + 1;
    }, 35);

    // 0.5 秒迅速結算
    setTimeout(() => {
      clearInterval(rollTimer);
      visual.classList.remove('dice-rolling');
      valueEl.className = 'font-mono';

      // 1. 決定最終點數
      let d20 = Math.floor(Math.random() * 20) + 1;
      if (G.forceDiceMode === 'crit') d20 = 20;
      if (G.forceDiceMode === 'nineteen') d20 = 19;
      if (G.forceDiceMode === 'two') d20 = 2;
      if (G.forceDiceMode === 'fail') d20 = 1;

      // 2. 結算數值
      const total = d20 + mod + tagResult.total;
      valueEl.textContent = d20;

      const nat20 = d20 === 20;
      const nat1 = d20 === 1;
      let success = total >= dc;
      
      // 3. ★ 四階完整回饋體系 (大成功 / 大失敗 / 普通通過 / 普通失手)
      if (nat20) { 
        success = true; 
        visual.classList.add('crit-success-box');
        valueEl.classList.add('crit-success-number');
        this._banner(banner, '★ 大成功 · 天人合一 ★', 'gold'); 
        soundEngine.playGong(); 
      } else if (nat1) { 
        success = false; 
        visual.classList.add('crit-fail-box');
        valueEl.classList.add('crit-fail-number');
        this._banner(banner, '☠ 大失敗 · 走火失手 ☠', 'red'); 
        HUD.shakeScreen();
      } else if (success) {
        // ★ 普通成功：翠玉光華微彈
        visual.classList.add('dice-pass-box');
        valueEl.classList.add('dice-pass-number');
        soundEngine.playBladeClash();
      } else {
        // ★ 普通失敗：暗灰沉降微頓
        visual.classList.add('dice-fail-box');
        valueEl.classList.add('dice-fail-number');
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
    }, 500);
  },

  _banner(el, text, variant) {
    el.textContent = text;
    el.className = 'text-xs font-black tracking-widest uppercase py-1.5 px-4 rounded-full mb-3 inline-block font-serif banner-stamped ' +
      (variant === 'gold' 
        ? 'bg-gradient-to-r from-[#b45309] to-[#d97706] text-[#fffbeb] border border-[#fef08a] shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
        : 'bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white border border-[#f87171] shadow-[0_0_12px_rgba(185,28,28,0.6)]');
    el.classList.remove('hidden');
  },

  resolve() {
    if (this.diceCallback) { 
      this.diceCallback(); 
      this.diceCallback = null; 
    }
  }
};