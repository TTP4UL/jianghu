class WuxiaSoundEngine {
  constructor() { 
    this.muted = true; // 預設靜音
  }

  toggleMute() {
    // 如果你想保留個掣嘅切換動畫，可以保留呢段
    const icon = document.getElementById('sfxIcon');
    const text = document.getElementById('sfxText');
    if (icon && text) {
      icon.className = 'fa-solid fa-volume-xmark text-gray-400';
      text.textContent = '音效: 關';
    }
  }

  // ★ 以下全部清空，唔會再有任何聲音
  playBladeClash() {}
  playGong() {}
  playQiSurge() {}
  playDiceRoll() {}
}

const soundEngine = new WuxiaSoundEngine();