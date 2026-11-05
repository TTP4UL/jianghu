const EndingSystem = {
  currentPage: 1,
  showOnlyMajor: true,

  enter(payload) {
    const id = payload?.id || 'defeat';
    const ev = G.data.EVENTS[id] || { title: '江湖路盡', text: '你的江湖生涯就此落幕。', badge: '終局' };
    
    const p = G.player;
    if (!p) return;
    if (!p.lifeLog) p.lifeLog = [];

    // --- 1. 計算終極稱號與判詞 ---
    const rep = p.reputation || 0;
    const mor = p.morality || 0;
    let title = '無名小卒', titleColor = 'text-[#78614c]';
    const isRepHighPos = rep >= 15, isRepHighNeg = rep <= -15;
    const isMorHighPos = mor >= 15, isMorHighNeg = mor <= -15;

    if (isRepHighPos && isMorHighPos) { title = '名門大俠'; titleColor = 'text-[#15803d]'; }
    else if (isRepHighNeg && isMorHighNeg) { title = '魔道巨擘'; titleColor = 'text-[#991b1b]'; }
    else if (isRepHighPos && isMorHighNeg) { title = '偽善君子'; titleColor = 'text-[#b45309]'; }
    else if (isRepHighNeg && isMorHighPos) { title = '孤膽俠客'; titleColor = 'text-[#1d4ed8]'; }
    else if (rep === 0 && isMorHighPos) { title = '隱世高人'; titleColor = 'text-[#047857]'; }
    else if (rep === 0 && isMorHighNeg) { title = '隱世邪修'; titleColor = 'text-[#7f1d1d]'; }

    let judgement = '';
    if (title === '名門大俠') judgement = '一生行俠仗義，扶危濟困，江湖中人提起你的名號，無不心生敬仰。';
    else if (title === '魔道巨擘') judgement = '殺伐果斷，威震八方。你所到之處，正派聞風喪膽，卻也是一代梟雄。';
    else if (title === '偽善君子') judgement = '面上春風和氣，背地裡機關算盡。江湖對你褒貶不一，是個讓人捉摸不透的人物。';
    else if (title === '孤膽俠客') judgement = '世人皆謗你，你卻問心無愧。你背負著一身罵名，卻做著最坦蕩的俠義之事。';
    else if (title === '隱世高人') judgement = '大隱隱於市，你未曾求取半點虛名，卻在暗中默默守護了一方安寧。';
    else judgement = '你如同滄海一粟，在江湖的波瀾中悄然走過。雖然沒有驚天動地的事蹟，但這一生，你為自己活過。';

    // --- 2. 準備 UI HTML ---
    const origin = G.data.ORIGINS[p.origin];
    const companions = (p.companions || []).map(cid => G.data.COMPANIONS[cid]?.name).filter(Boolean).join(' 、 ') || '孤身一人';
    const topArts = (p.martialArts || []).map(aid => G.data.MARTIAL_ARTS[aid]).filter(a => a && ['EX', 'S', 'A'].includes(a.grade)).map(a => `<span class="px-2 py-0.5 bg-[#fff5f5] text-[#a82d25] border border-[#fca5a5] rounded text-xs font-bold font-mono">${a.name} [${a.grade}]</span>`).join('');
    
    // 生成時間軸 HTML
    const majorLogs = p.lifeLog.filter(log => log.isMajor);
    const allLogs = p.lifeLog;

    const endingHTML = `
      <div id="endingScreen" class="fixed inset-0 z-[100] bg-[#1a140e]/95 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm overflow-y-auto font-serif">
        <!-- ... (卷軸外觀保持不變) ... -->
        
          <!-- 分頁標籤保持不變 -->
          
          <!-- 第一頁保持不變 (卷首) -->
          <div id="econtent-1">...</div>

          <!-- 第二頁：平生傳記 -->
          <div id="econtent-2" class="hidden">
            
            <!-- ★ 新增：切換按鈕 -->
            <div class="flex justify-end mb-2 pr-2">
              <label class="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#8c6d46] hover:text-[#8b2c24]">
                <input type="checkbox" id="toggleMajorOnly" onchange="EndingSystem.toggleMajor()" checked class="accent-[#8b2c24] w-3.5 h-3.5 cursor-pointer">
                僅顯示人生轉折點
              </label>
            </div>

            <div class="bg-[#fbf8f1]/60 p-5 border border-[#c9b499] rounded-sm mb-5 max-h-[40vh] overflow-y-auto custom-scrollbar shadow-inner relative" id="timelineContainer">
              <!-- 左側垂直線 -->
              <div class="absolute left-[21px] top-6 bottom-6 w-px bg-[#d8ccb8]"></div>
              <!-- JS 會在這裡注入時間軸 -->
            </div>
          </div>

          <!-- ... (底部按鈕保持不變) ... -->
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = endingHTML;
    document.body.appendChild(div);

    // 渲染時間軸
    this.renderTimeline(majorLogs, allLogs, this.showOnlyMajor);
  },

  toggleMajor() {
    this.showOnlyMajor = document.getElementById('toggleMajorOnly').checked;
    const p = G.player;
    const majorLogs = p.lifeLog.filter(log => log.isMajor);
    const allLogs = p.lifeLog;
    this.renderTimeline(majorLogs, allLogs, this.showOnlyMajor);
  },

  renderTimeline(majorLogs, allLogs, showOnlyMajor) {
    const container = document.getElementById('timelineContainer');
    const logsToRender = showOnlyMajor ? majorLogs : allLogs;

    if (logsToRender.length === 0) {
      container.innerHTML = `<div class="text-xs text-[#8a7561] italic text-center pt-4">一生風平浪靜，未遇波瀾。</div>`;
      return;
    }

    let html = '';
    logsToRender.forEach(log => {
      // 判斷結果顏色
      let resultHtml = '';
      if (log.result === '大成功') resultHtml = `<span class="text-[#b45309] font-black text-[10px] ml-1">【大成功】</span>`;
      else if (log.result === '成功') resultHtml = `<span class="text-[#15803d] font-black text-[10px] ml-1">【成功】</span>`;
      else if (log.result === '大失敗') resultHtml = `<span class="text-[#991b1b] font-black text-[10px] ml-1">【大失敗】</span>`;
      else if (log.result === '失敗') resultHtml = `<span class="text-[#dc2626] font-black text-[10px] ml-1">【失敗】</span>`;

      // ★ 如果係重大事件，UI 更加華麗（用金色/紅色框，點都大粒啲）
      if (log.isMajor) {
        html += `
          <div class="relative pl-7 mb-5">
            <div class="absolute left-[2px] top-1 w-3 h-3 rounded-full bg-[#8b2c24] border-2 border-[#dfc9a4] shadow-sm"></div>
            <div class="text-[11px] font-black text-[#8b2c24] mb-1">${log.age} 歲 · 命運轉折</div>
            <div class="bg-[#fffbeb]/80 border border-[#fde68a] p-2.5 rounded shadow-sm">
              <div class="text-sm font-black text-[#b45309]">${log.event}</div>
              <div class="text-xs text-[#594432] mt-1 leading-relaxed">
                抉擇：<span class="font-bold">「${log.choice}」</span> ${resultHtml}
              </div>
            </div>
          </div>
        `;
      } else {
        // 普通事件，UI 比較低調
        html += `
          <div class="relative pl-7 mb-4 opacity-75">
            <div class="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-[#a89680]"></div>
            <div class="text-[10px] font-black text-[#8c6d46] mb-0.5">${log.age} 歲</div>
            <div class="text-sm font-bold text-[#2c1d11]">${log.event}</div>
            <div class="text-xs text-[#594432] mt-0.5">
              抉擇：<span class="font-medium">「${log.choice}」</span> ${resultHtml}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  },

  switchPage(page) {
    document.getElementById('econtent-1').classList.toggle('hidden', page !== 1);
    document.getElementById('econtent-2').classList.toggle('hidden', page !== 2);

    const btn1 = document.getElementById('epage-1');
    const btn2 = document.getElementById('epage-2');

    if (page === 1) {
      btn1.className = 'text-xs font-black pb-1 border-b-2 border-[#8b2c24] text-[#8b2c24]';
      btn2.className = 'text-xs font-black pb-1 border-b-2 border-transparent text-[#8c6d46] hover:text-[#8b2c24] transition';
    } else {
      btn1.className = 'text-xs font-black pb-1 border-b-2 border-transparent text-[#8c6d46] hover:text-[#8b2c24] transition';
      btn2.className = 'text-xs font-black pb-1 border-b-2 border-[#8b2c24] text-[#8b2c24]';
    }
  }
};

Systems.ending = EndingSystem;