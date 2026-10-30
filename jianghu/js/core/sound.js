class WuxiaSoundEngine {
  constructor() { this.ctx = null; this.muted = false; }
  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  toggleMute() {
    this.muted = !this.muted;
    const icon = document.getElementById('sfxIcon');
    const text = document.getElementById('sfxText');
    if (this.muted) {
      icon.className = 'fa-solid fa-volume-xmark text-gray-400';
      text.textContent = '音效: 關';
    } else {
      icon.className = 'fa-solid fa-volume-high text-wuxiaGold';
      text.textContent = '音效: 開';
      this.playGong();
    }
  }
  playBladeClash() {
    if (this.muted) return; this.init();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(1400, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + 0.3);
  }
  playGong() {
    if (this.muted) return; this.init();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(260, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 1.2);
    g.gain.setValueAtTime(0.4, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + 1.2);
  }
  playQiSurge() {
    if (this.muted) return; this.init();
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(180, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.25, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + 0.42);
  }
  playDiceRoll() {
    if (this.muted) return; this.init();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (this.muted) return;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(120 + Math.random() * 260, this.ctx.currentTime);
        g.gain.setValueAtTime(0.12, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.06);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + 0.07);
      }, i * 110);
    }
  }
}
const soundEngine = new WuxiaSoundEngine();