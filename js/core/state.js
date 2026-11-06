// 全局狀態：所有系統讀寫呢度
const G = {
  player: null,
  currentSystem: null,
  currentAge: 13,
  forceDiceMode: 'random',
  currentSeason: 0,
  seasons: ['春', '夏', '秋', '冬'],
  data: {
    TAGS: {}, ORIGINS: {}, SECTS: {}, MARTIAL_ARTS: {},
    EVENTS: {}, COMPANIONS: {}
  },
  usedEvents: [],
  diceCallback: null,
  enemy: null,
  currentCombatEvent: null,
  parrying: false
};

// 系統切換器
const Systems = {
  characterCreation: null,
  lifepath: null,
  events: null,
  combat: null,   // ★ 新增戰鬥系統
  ending: null,
  exploration: null
};

function switchSystem(name, payload) {
  G.currentSystem = name;
  const sys = Systems[name];
  if (sys && sys.enter) sys.enter(payload);
  else console.error('[System] Not found:', name);
}
function getEffectiveStats() {
  return { ...G.player.stats };
}

const STATS_INFO = {
  str: { name: '臂力', full: '臂力 (STR)' },
  dex: { name: '身法', full: '身法 (DEX)' },
  con: { name: '根骨', full: '根骨 (CON)' },
  int: { name: '悟性', full: '悟性 (INT)' },
  wis: { name: '心法', full: '心法 (WIS)' },
  cha: { name: '魅力', full: '魅力 (CHA)' }
};

const NAME_POOL = {
  surname: ['沈','李','王','張','劉','陳','楊','趙','歐陽','慕容','獨孤','上官'],
  given: ['凌霜','無忌','逍遙','青雲','驚鴻','如夢','天行','傲雪','驚濤','飛揚','清風','若水']
};