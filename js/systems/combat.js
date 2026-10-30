const CombatSystem = {
  enter(payload) {
    const ev = payload.event;
    G.currentCombatEvent = ev;
    G.enemy = { ...ev.enemy }; // 複製一份敵人數據
    G.companionAttackUsed = false; // 重置同伴攻擊
    
    document.getElementById('loadoutBtn').classList.add('hidden'); // 戰鬥中隱藏功法按鈕
    document.getElementById('enemyHud').classList.remove('hidden');
    
    HUD.setScene(ev.badge || '戰鬥', ev.title || '遭遇強敵');
    this.updateHUD();
    soundEngine.playGong();
    this.renderActions();
  },

  updateHUD() {
    const e = G.enemy;
    document.getElementById('enemyName').textContent = e.name;
    document.getElementById('enemyAC').textContent = e.ac;
    document.getElementById('enemyHpText').textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
    document.getElementById('enemyHpBar').style.width = `${Math.min(100, Math.max(0, (e.hp / e.maxHp) * 100))}%`;
    document.getElementById('enemyPosText').textContent = `${Math.max(0, e.pos)} / ${e.maxPos}`;
    document.getElementById('enemyPosBar').style.width = `${Math.min(100, Math.max(0, (e.pos / e.maxPos) * 100))}%`;
    
    const status = [];
    if (e.isStunned) status.push('【眩暈】');
    if (e.isPoisoned > 0) status.push(`【劇毒:${e.isPoisoned}】`);
    document.getElementById('enemyStatusTag').textContent = status.join(' ');
    
    HUD.updateGauges();
  },

  renderActions() {
    if (G.player.hp <= 0) return this.end(false);
    if (G.enemy.hp <= 0) return this.end(true);

    const actions = [];

    // 1. 普通攻擊
    actions.push({
      label: '⚔️ 普通攻擊',
      checkText: `命中 vs AC ${G.enemy.ac}`,
      desc: '1d8 + 屬性調整，不消耗真氣。',
      primary: true,
      action: () => this.attack()
    });

    // 2. 功法攻擊 (消耗真氣)
    const attackArts = G.player.loadout?.attack.filter(Boolean) || [];
    if (attackArts.length > 0) {
      // 自動選用裝備中的第一門功法
      const artId = attackArts[0];
      const art = G.data.MARTIAL_ARTS[artId];
      actions.push({
        label: `✨ 施展【${art.name}】`,
        checkText: '消耗 2 真氣',
        desc: `威力大增，基礎傷害 ${art.basePower / 10}d8。`,
        action: () => this.useArt(art)
      });
    }

    // 3. 格擋/調息
    actions.push({
      label: '🛡️ 凝神格擋',
      checkText: '回復架勢',
      desc: '本回合受到傷害減少，並回復 5 點架勢。',
      action: () => this.parry()
    });

    // 4. 同伴攻擊 (如果有同伴，且本場未用過)
    if (G.player.companions && G.player.companions.length > 0 && !G.companionAttackUsed) {
      const compNames = G.player.companions.map(id => G.data.COMPANIONS[id]?.name).join(' / ');
      actions.push({
        label: `👥 同伴援助 · ${compNames}`,
        checkText: '每場限一次',
        desc: '由同伴出手，威力視等級而定。',
        action: () => this.companionAttack()
      });
    }

    HUD.renderChoices(actions);
  },

  dealDamage(target, dmg, isCrit = false) {
    let rem = dmg;
    const isPlayer = (target === G.player);
    const targetEl = isPlayer ? document.getElementById('hudHpCur').parentElement : document.getElementById('enemyHpText').parentElement;

    if (target.pos > 0) {
      if (target.pos >= rem) {
        target.pos -= rem;
        rem = 0;
        HUD.log('combat', `${isPlayer ? '你的' : '敵方的'}架勢抵擋了攻擊！`);
      } else {
        rem -= target.pos;
        target.pos = 0;
        HUD.log('combat', `${isPlayer ? '你的' : '敵方的'}護體架勢被打崩！`);
        HUD.shakeScreen(); // ★ 架勢被打崩，畫面震動
      }
    }
    if (rem > 0) {
      target.hp = Math.max(0, target.hp - rem);
      HUD.log('combat', `造成 ${rem} 點氣血傷害！`);
      
      // ★ 傷害飄字
      HUD.floatDamage(targetEl, `-${rem}`, isCrit ? 'crit' : 'normal');
      
      // ★ 暴擊或被重擊時畫面震動
      if (isCrit || (isPlayer && rem >= 10)) {
        HUD.shakeScreen();
      }
    } else {
      // 如果完全被架勢擋住，彈出「格擋」字眼
      HUD.floatDamage(targetEl, '格擋', 'dodge');
    }
  },

  attack() {
    const p = G.player, e = G.enemy;
    const attr = p.stats.str > p.stats.dex ? 'str' : 'dex';
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: '普通攻擊', attr: attr, dc: e.ac, tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          const d8 = Math.floor(Math.random() * 8) + 1;
          const dmg = (d8 * (res.nat20 ? 2 : 1)) + mod;
          soundEngine.playBladeClash();
          this.dealDamage(e, dmg, res.nat20); // ★ 傳入暴擊
        } else {
          HUD.log('combat', '你的攻擊被敵方閃避！');
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
        }
        this.updateHUD();
        setTimeout(() => this.enemyTurn(), 1000);
      }
    });
  },

  useArt(art) {
    const p = G.player, e = G.enemy;
    if (p.qi < 2) {
      HUD.log('combat', '真氣不足，無法施展絕學！');
      return this.renderActions();
    }
    p.qi -= 2;
    p.qi = Math.max(0, p.qi); // 確保不為負
    HUD.updateGauges();

    const attr = art.type === '拳法' ? 'str' : 'dex';
    const mod = Math.floor((p.stats[attr] - 10) / 2);
    
    DiceSystem.check({
      title: `施展【${art.name}】`, attr: attr, dc: e.ac, tags: p.tags,
      onComplete: (res) => {
        if (res.success) {
          // 功法基礎傷害 = 基礎威力/10 d8
          const diceCount = Math.max(1, Math.floor(art.basePower / 10));
          let totalRoll = 0;
          for (let i = 0; i < diceCount; i++) totalRoll += Math.floor(Math.random() * 8) + 1;
          
          // 計算傷害 (暴擊 x2)
          const dmg = (totalRoll * (res.nat20 ? 2 : 1)) + mod;
          
          soundEngine.playQiSurge();
          HUD.log('combat', `【${art.name}】命中！`);
          
          // ★ 傳入暴擊判斷
          this.dealDamage(e, dmg, res.nat20); 
        } else {
          HUD.log('combat', `【${art.name}】被敵方化解！`);
          // ★ 彈出閃避字眼
          HUD.floatDamage(document.getElementById('enemyHpText').parentElement, '閃避', 'dodge');
        }
        
        this.updateHUD();
        setTimeout(() => this.enemyTurn(), 1000);
      }
    });
  },

  parry() {
    G.player.pos = Math.min(G.player.maxPos, G.player.pos + 5);
    G.player.parrying = true; // 標記本回合處於格擋狀態
    soundEngine.playBladeClash();
    HUD.log('combat', '你擺出防禦架勢，架勢回復。');
    HUD.updateGauges();
    setTimeout(() => this.enemyTurn(), 1000);
  },

  companionAttack() {
    G.companionAttackUsed = true;
    const comps = G.player.companions.map(id => G.data.COMPANIONS[id]).filter(Boolean);
    // 按等級排序，選最高級的出手
    const gradeOrder = { EX: 6, S: 5, A: 4, B: 3, C: 2, D: 1 };
    comps.sort((a, b) => (gradeOrder[b.grade] || 0) - (gradeOrder[a.grade] || 0));
    const c = comps[0];

    if (!c) return this.renderActions();

    const hitBonus = { EX: 8, S: 6, A: 5, B: 3, C: 2, D: 1 }[c.grade] || 1;
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + hitBonus;
    
    HUD.log('combat', `同伴【${c.name}】出手！擲出 ${d20} + ${hitBonus} = ${total} vs AC ${G.enemy.ac}`);
    
    if (total >= G.enemy.ac) {
      soundEngine.playBladeClash();
      this.dealDamage(G.enemy, c.attackPower);
      if (c.attackEffect) {
        // 簡單處理特效，例如中毒
        if (c.attackEffect.includes('enemy_poison')) {
          G.enemy.isPoisoned = (G.enemy.isPoisoned || 0) + 3;
          HUD.log('combat', '敵方中毒了！');
        }
      }
    } else {
      HUD.log('combat', '同伴的攻擊被閃避了！');
    }
    this.updateHUD();
    setTimeout(() => this.enemyTurn(), 1000);
  },

  enemyTurn() {
    const p = G.player, e = G.enemy;
    if (e.hp <= 0) return this.end(true);

    // 敵人中毒結算
    if (e.isPoisoned > 0) {
      const pDmg = 5 * e.isPoisoned;
      this.dealDamage(e, pDmg);
      HUD.log('combat', `敵方毒發，受到 ${pDmg} 傷害。`);
      e.isPoisoned--;
      this.updateHUD();
      if (e.hp <= 0) return this.end(true);
    }

    // 敵人眩暈結算
    if (e.isStunned) {
      e.isStunned = false;
      HUD.log('combat', '敵方處於眩暈，無法行動！');
      this.updateHUD();
      p.parrying = false; // 解除玩家格擋
      return this.renderActions();
    }

    // 敵人普通攻擊
    const d20 = Math.floor(Math.random() * 20) + 1;
    const eAtk = 4; // 假設敵人命中加值固定為 4
    const targetAC = p.ac + (p.parrying ? 4 : 0); // 如果格擋，AC+4
    const total = d20 + eAtk;

    HUD.log('combat', `敵方攻擊！擲出 ${d20} + ${eAtk} = ${total} vs 你的 AC ${targetAC}`);

    if (total >= targetAC) {
      let dmg = Math.floor(Math.random() * 10) + 4;
      const isCrit = d20 === 20;
      if (isCrit) dmg *= 2;
      
      HUD.log('combat', isCrit ? `敵方【暴擊】！` : `敵方擊中你！`);
      this.dealDamage(p, dmg, isCrit); // ★ 傳入暴擊
    } else {
      HUD.log('combat', '你成功閃避了敵方的攻擊！');
      HUD.floatDamage(document.getElementById('hudHpCur').parentElement, '閃避', 'dodge');
    }

    p.parrying = false; // 回合結束，解除格擋
    HUD.updateGauges();
    if (p.hp <= 0) this.end(false);
    else this.renderActions();
  },

  end(win) {
    document.getElementById('enemyHud').classList.add('hidden');
    document.getElementById('loadoutBtn').classList.remove('hidden');
    const ev = G.currentCombatEvent;
    
    if (win) {
      soundEngine.playGong();
      HUD.log('narrative', `【戰勝】你擊敗了 ${G.enemy.name}！`);
      EventSystem.load(ev.onVictory || 'victory');
    } else {
      HUD.log('combat', '眼前一黑，你倒在了血泊之中……');
      EventSystem.load(ev.onDefeat || 'defeat');
    }
    G.currentCombatEvent = null;
     SaveSystem.save();
  }
};
Systems.combat = CombatSystem;