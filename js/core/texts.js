// ==========================================
// 全局系統文本庫 (System Texts)
// ==========================================

const SYSTEM_TEXTS = {
  // 戰鬥 (Combat)
  meditate: "你退後半步，雙目微閉，運轉真氣。回復 {qi} 點真氣。",
  parry: "你沉肩墜肘，擺出防禦架勢。架勢回復 {pos} 點，若成功架開攻擊，將順勢反擊！",
  enemy_stunned: "敵方處於眩暈，無法行動！",
  poison_player: "你劇毒發作！無視架勢，直接受到 {dmg} 點真實傷害！",
  poison_enemy: "敵方劇毒發作！無視架勢，直接受到 {dmg} 點真實傷害！",
  defeat: "眼前一黑，你倒在了血泊之中……",
  victory: "【戰勝】你擊敗了 {name}！",

  // 探索 (Exploration)
  retreat: "你選擇閉關修煉，真氣與氣血恢復圓滿。",
  debuff_heal: "靜心調息之下，【{tag}】竟隱隱鬆動，傷勢漸癒。",
  year_passed: "【歲月如梭】轉眼間，又過了一年，你已經 {age} 歲了。",
  empty_explore: "你逛了一圈，沒有遇到什麼特別的事。",

  // 成長 (Lifepath)
  peaceful_year: "這一年平平淡淡，沒有發生什麼特別的事。",
  adult_start: "十八歲，你正式踏入江湖。這一年，你開始了自己傳奇的江湖生涯。",
  no_more_choices: "（這件事就此告一段落）"
};

// 插值工具：將 {xxx} 替換為具體數值
function T(key, params) {
  let str = SYSTEM_TEXTS[key] || key;
  if (params) {
    Object.keys(params).forEach(k => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
  }
  return str;
}