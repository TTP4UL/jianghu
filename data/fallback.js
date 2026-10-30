const FALLBACK_DATA = {
  TAGS: {
    origin_martial_family: { name: '武學世家', bonus: 0, category: 'origin', visible: true },
    origin_merchant: { name: '商賈之家', bonus: 0, category: 'origin', visible: true },
    origin_orphan: { name: '市井孤兒', bonus: 0, category: 'origin', visible: true },
    origin_mediocre: { name: '平庸凡人', bonus: 0, category: 'origin', visible: true },
    origin_entered_sect: { name: '已入門派', bonus: 0, category: 'origin', visible: true },
    sect_shaolin: { name: '少林弟子', bonus: 0, category: 'sect', visible: true },
    sect_wudang: { name: '武當弟子', bonus: 0, category: 'sect', visible: true },
    sect_emei: { name: '峨嵋弟子', bonus: 0, category: 'sect', visible: true },
    gender_male: { name: '男', bonus: 0, category: 'gender', visible: false },
    gender_female: { name: '女', bonus: 0, category: 'gender', visible: false },
    sword_master: { name: '劍法精通', bonus: 3, category: 'skill', visible: true },
    inner_power: { name: '內功深厚', bonus: 3, category: 'skill', visible: true },
    iron_body: { name: '鐵骨銅身', bonus: 2, category: 'skill', visible: true },
    sharp_eye: { name: '洞若觀火', bonus: 2, category: 'skill', visible: true },
    righteous: { name: '名門正派', bonus: 2, category: 'alignment', visible: true },
    evil: { name: '邪派', bonus: 2, category: 'alignment', visible: true },
    lucky: { name: '福星高照', bonus: 2, category: 'alignment', visible: true },
    vengeful: { name: '復仇心切', bonus: 2, category: 'alignment', visible: true }
  },
    ORIGINS: {
    martial_family: { id:'martial_family', name:'武學世家', desc:'...', gold:500, baseStats:{str:0,dex:0,con:0,int:0,wis:0,cha:0}, initialMartialArts:['c_basic_sword'], initialTags:['inner_power'], special:null },
    merchant: { id:'merchant', name:'商賈之家', desc:'...', gold:2000, baseStats:{str:0,dex:0,con:0,int:0,wis:0,cha:0}, initialMartialArts:['e_money_talk'], initialTags:['lucky'], special:null },
    orphan: { id:'orphan', name:'市井孤兒', desc:'...', gold:50, baseStats:{str:0,dex:0,con:0,int:0,wis:0,cha:0}, initialMartialArts:['e_street_fist'], initialTags:['vengeful'], special:null },
    mediocre: { id:'mediocre', name:'平庸凡人', desc:'...', gold:100, baseStats:{str:0,dex:0,con:0,int:0,wis:0,cha:0}, initialMartialArts:[], initialTags:[], special:null },
    entered_sect: { id:'entered_sect', name:'已入門派', desc:'...', gold:200, baseStats:{str:0,dex:0,con:0,int:0,wis:0,cha:0}, initialMartialArts:[], initialTags:['righteous'], special:'showSectPicker' }
  },
  SECTS: {
    shaolin: { id:'shaolin', name:'少林', genderLimit:null, desc:'天下武功出少林', baseHp:32, basePos:20, baseQi:5, sectStats:{str:15,dex:10,con:15,int:10,wis:12,cha:9}, startingArts:['d_shaolin_fist','d_luohan'], featureText:'罡氣架勢上限提升，能硬抗重擊' },
    wudang: { id:'wudang', name:'武當', genderLimit:null, desc:'以柔克剛，後發制人', baseHp:28, basePos:16, baseQi:6, sectStats:{str:10,dex:14,con:12,int:15,wis:10,cha:10}, startingArts:['a_taiji','c_wudang_sword'], featureText:'太極卸力，架勢恢復加快' },
    emei: { id:'emei', name:'峨嵋', genderLimit:'female', desc:'巾幗不讓鬚眉', baseHp:26, basePos:18, baseQi:7, sectStats:{str:10,dex:14,con:11,int:13,wis:14,cha:10}, startingArts:['b_emei_sword','c_emei_palm'], featureText:'劍法與心法並重，真氣充沛' }
  },
  MARTIAL_ARTS: {
    ex_jiuyang: { id:'ex_jiuyang', name:'九陽神功', grade:'EX', type:'內功', slot:'inner', basePower:100, learnDC:30, growthRate:5, desc:'至陽至剛，天下無敵' },
    s_dugu: { id:'s_dugu', name:'獨孤九劍', grade:'S', type:'劍法', slot:'attack', basePower:85, learnDC:25, growthRate:4, desc:'以無招勝有招' },
    a_taiji: { id:'a_taiji', name:'太極拳', grade:'A', type:'拳法', slot:'attack', basePower:70, learnDC:20, growthRate:3, desc:'以柔克剛，四兩撥千斤' },
    b_emei_sword: { id:'b_emei_sword', name:'峨嵋劍法', grade:'B', type:'劍法', slot:'attack', basePower:55, learnDC:15, growthRate:2, desc:'峨嵋入門劍法，重意不重招' },
    c_basic_sword: { id:'c_basic_sword', name:'基礎劍法', grade:'C', type:'劍法', slot:'attack', basePower:30, learnDC:10, growthRate:1, desc:'江湖人人會使的入門劍法' },
    c_wudang_sword: { id:'c_wudang_sword', name:'武當劍法', grade:'C', type:'劍法', slot:'attack', basePower:32, learnDC:11, growthRate:1.2, desc:'武當入門劍法，以柔馭剛' },
    c_emei_palm: { id:'c_emei_palm', name:'峨嵋掌法', grade:'C', type:'拳法', slot:'attack', basePower:28, learnDC:10, growthRate:1, desc:'峨嵋入門掌法，輕靈飄逸' },
    d_shaolin_fist: { id:'d_shaolin_fist', name:'羅漢拳', grade:'D', type:'拳法', slot:'attack', basePower:20, learnDC:8, growthRate:1, desc:'少林入門拳法，剛猛紮實' },
    d_luohan: { id:'d_luohan', name:'羅漢伏虎', grade:'D', type:'拳法', slot:'attack', basePower:22, learnDC:8, growthRate:1, desc:'少林進階拳法' },
    e_money_talk: { id:'e_money_talk', name:'商道', grade:'E', type:'特殊', slot:'utility', basePower:10, learnDC:5, growthRate:0.5, desc:'討價還價的江湖技藝' },
    e_street_fist: { id:'e_street_fist', name:'街頭把式', grade:'E', type:'拳法', slot:'attack', basePower:10, learnDC:5, growthRate:0.5, desc:'打架用的下三濫招' }
  },
  LIFEPATH_EVENTS: {
    lp13_shaolin: { id:'lp13_shaolin', age:13, requireTags:['sect_shaolin'], forbidTags:[], priority:10, title:'羅漢堂晨鐘', text:'天未光，羅漢堂鐘聲響起。你隨眾僧練拳，師父在你身旁停下腳步。', speaker:'師父' },
    lp13_emei: { id:'lp13_emei', age:13, requireTags:['sect_emei','gender_female'], forbidTags:[], priority:10, title:'金頂雲霧', text:'峨嵋金頂，雲霧繚繞。師父將一柄木劍遞給你：「峨嵋劍法，重意不重招。」', speaker:'師父' },
    lp13_martial: { id:'lp13_martial', age:13, requireTags:['origin_martial_family'], forbidTags:[], priority:10, title:'家傳殘卷', text:'父親帶你到祠堂，從暗格取出一本泛黃殘破的劍譜。「這是祖上留下的，能領悟多少，看你自己。」', speaker:'父親' },
    lp13_orphan: { id:'lp13_orphan', age:13, requireTags:['origin_orphan'], forbidTags:[], priority:10, title:'街頭生存', text:'你在街頭已經混了十三年。今日，一個衣著華貴的老者在你面前被三個混混圍住。', speaker:'旁白' },
    lp13_common: { id:'lp13_common', age:13, requireTags:[], forbidTags:['sect_shaolin','sect_wudang','sect_emei'], priority:0, title:'少年立志', text:'十三歲，你站在人生的第一個岔路口。村口老人說，江湖很大，也很小。', speaker:'旁白' },
    lp14_common: { id:'lp14_common', age:14, requireTags:[], forbidTags:[], priority:0, title:'江湖傳聞', text:'十四歲，你開始聽到更多關於江湖的傳聞。有人在酒館說起「華山論劍」。', speaker:'旁白' },
    lp15_common: { id:'lp15_common', age:15, requireTags:[], forbidTags:[], priority:0, title:'初遇強敵', text:'十五歲，你在山道上遇到一個身手不凡的陌生人，他似乎在找什麼。', speaker:'旁白' },
    lp16_common: { id:'lp16_common', age:16, requireTags:[], forbidTags:[], priority:0, title:'心魔試煉', text:'十六歲，你開始夢見一些奇怪的東西。有人說，這是走火入魔的前兆。', speaker:'旁白' },
    lp17_common: { id:'lp17_common', age:17, requireTags:[], forbidTags:[], priority:0, title:'生死一線', text:'十七歲，你修煉時經脈逆行，生死一線。你必須做出選擇。', speaker:'旁白' },
        // 14 歲
    lp14_taohua: { id:'lp14_taohua', age:14, requireTags:['origin_merchant','origin_orphan'], forbidTags:[], priority:5, title:'東海奇遇', text:'你因緣際會流落東海孤島，島上有一位性情古怪的白衣書生……', speaker:'旁白' },
    
    // 15 歲
    lp15_shaolin: { id:'lp15_shaolin', age:15, requireTags:['sect_shaolin'], forbidTags:[], priority:5, title:'藏經閣偶遇', text:'你在少林藏經閣打掃時，遇見一位默默無聞的掃地老僧。', speaker:'旁白' }
  },
  LIFEPATH_CHOICES: {
    lp13_common: [
      { text:'潛心修煉', desc:'閉門三年，打好根基。', type:'check', checkName:'根骨檢定', attr:'con', dc:12, tags:['iron_body'], success:{narrative:'你根基穩固，氣血充盈。',effects:{con:2},next:null}, fail:{narrative:'修煉不得法，略感不適。',effects:{con:-1,hp:-3},next:null} },
      { text:'遊歷四方', desc:'外出見識，增長閱歷。', type:'check', checkName:'悟性檢定', attr:'int', dc:11, tags:['sharp_eye'], success:{narrative:'你見多識廣，悟性大開。',effects:{int:2},next:null}, fail:{narrative:'路上遇到騙子，損失錢財。',effects:{gold:-50},next:null} }
    ],
    lp13_shaolin: [
      { text:'苦練羅漢拳', desc:'專心修習本門武功。', type:'check', checkName:'臂力檢定', attr:'str', dc:12, tags:['iron_body'], success:{narrative:'你的羅漢拳已有小成。',effects:{str:2},next:null}, fail:{narrative:'練功過度，肌肉酸痛。',effects:{str:-1,hp:-5},next:null} },
      { text:'偷學進階武學', desc:'偷偷翻看羅漢堂的秘籍。', type:'check', checkName:'悟性檢定', attr:'int', dc:15, tags:[], success:{narrative:'你竟在殘卷中悟出羅漢伏虎真意！',effects:{addMartialArt:'d_luohan',int:1},next:null}, fail:{narrative:'被師兄發現，罰跪三日。',effects:{int:-1,hp:-3},next:null} }
    ],
    lp13_martial: [
      { text:'潛心鑽研劍譜', desc:'閉關三年，專攻家傳劍法。', type:'check', checkName:'悟性檢定', attr:'int', dc:14, tags:['sword_master'], success:{narrative:'你從殘卷中悟出劍法真意！',effects:{int:2,addTag:'sword_master',addMartialArt:'c_basic_sword'},next:null}, fail:{narrative:'經脈受損，劍法無成。',effects:{int:-1,hp:-5},next:null} },
      { text:'偷練後山禁術', desc:'傳聞後山禁地藏有絕世武學。', type:'check', checkName:'悟性檢定', attr:'int', dc:18, tags:[], success:{narrative:'竟是獨孤九劍殘篇！你欣喜若狂。',effects:{addMartialArt:'s_dugu',int:3},next:null}, fail:{narrative:'走火入魔，氣血大損！',effects:{hp:-15,addTag:'evil'},next:null} }
    ],
lp14_common: [
  { 
    text:'前往華山', 
    desc:'聽聞華山有高人論劍。', 
    type:'check', 
    checkName:'福緣檢定', 
    attr:'wis', 
    dc:13, 
    tags:['lucky'], 
    success:{
      narrative:'你結識了一位華山弟子，獲贈劍譜，他更決定與你同行！',
      effects:{addMartialArt:'c_basic_sword', wis:1, addCompanion:'comp_huashan'},
      next:null
    }, 
    fail:{
      narrative:'路上盤纏耗盡，狼狽而歸。',
      effects:{gold:-100, hp:-3},
      next:null
    } 
  },
  { 
    text:'留在原地', 
    desc:'穩紮穩打，繼續修煉。', 
    type:'direct', 
    effects:{con:1, qi:1}, 
    next:null 
  }
],
    lp15_common: [
      { text:'主動挑戰', desc:'你想試試自己的身手。', type:'check', checkName:'臂力檢定', attr:'str', dc:14, tags:['sword_master','iron_body'], success:{narrative:'你擊敗了對方，名聲初顯。',effects:{str:2,cha:1,addTag:'sword_master'},next:null}, fail:{narrative:'你被對方打傷，狼狽逃走。',effects:{hp:-10,str:-1},next:null} },
      { text:'暗中觀察', desc:'先看看對方底細。', type:'check', checkName:'悟性檢定', attr:'int', dc:12, tags:['sharp_eye'], success:{narrative:'你發現對方是名門弟子，學到了幾招。',effects:{int:2},next:null}, fail:{narrative:'你被對方發現，遭到追殺。',effects:{hp:-6},next:null} }
    ],
    lp16_common: [
      { text:'直面心魔', desc:'以意志對抗內心恐懼。', type:'check', checkName:'心法檢定', attr:'wis', dc:15, tags:['inner_power'], success:{narrative:'你戰勝心魔，心境更上一層樓。',effects:{wis:3,addTag:'inner_power'},next:null}, fail:{narrative:'心魔反噬，你大病一場。',effects:{wis:-2,hp:-10},next:null} },
      { text:'求助師長', desc:'向信任的人尋求幫助。', type:'check', checkName:'名望檢定', attr:'cha', dc:12, tags:['righteous'], success:{narrative:'師長為你開解，你豁然開朗。',effects:{wis:1,cha:1,hp:5},next:null}, fail:{narrative:'無人可求助，你獨自煎熬。',effects:{wis:-1},next:null} }
    ],
    lp17_common: [
      { text:'強行衝關', desc:'以命搏突破，成則一飛沖天。', type:'check', checkName:'根骨檢定', attr:'con', dc:17, tags:['iron_body','inner_power'], success:{narrative:'突破成功！你經脈暢通，氣血如虹。',effects:{con:3,qi:2,hp:10},next:null}, fail:{narrative:'經脈盡斷，英年早逝……',effects:{},next:null,failGameOver:true} },
      { text:'穩紮穩打', desc:'放棄突破，穩住現有根基。', type:'direct', effects:{con:1,hp:5}, next:null }
    ],
        lp14_taohua: [
      { text:'虛心求教', desc:'請教書生武學之道。', type:'check', checkName:'悟性檢定', attr:'int', dc:16, tags:['sharp_eye'], success:{narrative:'書生見你聰慧，決定傳你奇門之術，並與你結伴同行。', effects:{addCompanion:'comp_dongxie', int:2}, next:null}, fail:{narrative:'書生嫌你資質平庸，拂袖而去。', effects:{int:-1}, next:null} },
      { text:'不與理會', desc:'盡快找船離開。', type:'direct', effects:{dex:1}, next:null }
    ],
    lp15_shaolin: [
      { text:'請老僧指點', desc:'向掃地僧請教佛法與武學。', type:'check', checkName:'心法檢定', attr:'wis', dc:18, tags:['inner_power'], success:{narrative:'老僧微微一笑，隨手一拂便化解了你的招式。他決定隨你下山。', effects:{addCompanion:'comp_swaiter', wis:2}, next:null}, fail:{narrative:'老僧只是搖頭，繼續掃地。', effects:{}, next:null} },
      { text:'默默打掃', desc:'專心做好本份。', type:'direct', effects:{wis:1}, next:null }
    ]
  },
  EVENTS: {
    act1_inn: { id:'act1_inn', type:'normal', badge:'第壹章 · 客棧風雲', title:'風雨欲來 · 黑風寨索命門', text:'暴雨如注，你身披斗笠邁入官道旁的「悅來客棧」。三名手持鬼頭環刀的黑風寨惡煞正在腳踹櫃檯。', choices:[ { text:'拍案怒斥 · 威懾惡徒', desc:'以江湖名威直壓其銳氣。', type:'check', checkName:'名望威壓', attr:'cha', dc:12, tags:['righteous','lucky'], success:{narrative:'三人見你氣度不凡，倉皇遁走！',effects:{qi:2},next:'act2_forest'}, fail:{narrative:'三人拔刀撲來！',effects:{pos:-4},next:'act2_forest'} }, { text:'拔劍相向', desc:'不發一語，直接出鞘。', type:'check', checkName:'身法先攻', attr:'dex', dc:13, tags:['sword_master'], success:{narrative:'寒芒一閃，惡徒潰退！',effects:{addTag:'sword_master'},next:'act2_forest'}, fail:{narrative:'你被桌椅絆倒，架勢受損。',effects:{pos:-3},next:'act2_forest'} } ] },
    act2_forest: { id:'act2_forest', type:'normal', badge:'第貳章 · 密林暗影', title:'古木幽篁 · 奇門連環毒弩', text:'你追尋黑風寨殘黨深入竹林，四周寒霧四起，地面暗藏機關。', choices:[ { text:'施展輕功', desc:'踩踏竹梢飄過陷阱。', type:'check', checkName:'身法輕功', attr:'dex', dc:13, tags:['sword_master'], success:{narrative:'你身輕如燕，直取寨門！',effects:{posSet:99},next:'act3_boss'}, fail:{narrative:'你踏中陷阱，架勢大損。',effects:{pos:-5},next:'act3_boss'} }, { text:'拆解機關', desc:'以悟性破陣。', type:'check', checkName:'悟性機關', attr:'int', dc:12, tags:['sharp_eye'], success:{narrative:'機關反噬，暗哨全清！',effects:{qi:1,addTag:'sharp_eye'},next:'act3_boss'}, fail:{narrative:'你強行破除，真氣耗損。',effects:{qi:-1},next:'act3_boss'} } ] },
    act3_boss: { id:'act3_boss', type:'combat', badge:'最終決戰', title:'黑風聚義堂 · 決戰「狂刀」厲煞', text:'「乳臭未乾的雜種，竟敢闖我黑風總寨！」巨漢猛踏青石板，狂暴煞氣撲面而來！', speaker:'狂刀厲煞', enemy:{ name:'「狂刀」厲煞', hp:48, maxHp:48, pos:24, maxPos:24, ac:13, isStunned:false, isPoisoned:0 }, onVictory:'victory', onDefeat:'defeat' },
    victory: { id:'victory', type:'ending', variant:'victory', badge:'威震黑白兩道', title:'一代宗師之姿', text:'黑風寨殘部四散奔逃，你在聚義堂暗格起獲前朝密信與官銀。' },
    defeat: { id:'defeat', type:'ending', variant:'defeat', badge:'氣數已盡', title:'殞落深山', text:'刀芒掠過，身軀不支倒在血泊中……江湖路遠，英魂長眠。' },
    lifepath_death: { id:'lifepath_death', type:'ending', variant:'defeat', badge:'中道崩殂', title:'英年早逝', text:'經脈盡斷，氣血枯竭。你的人生在十七歲戛然而止……' },
        dugu_departs: { 
      id:'dugu_departs', 
      type:'normal', 
      badge:'同伴離去', 
      title:'劍魔遠去', 
      text:'「我的劍道已傳予你，剩下的路，自己走吧。」劍魔化作一道劍光消失在天際。', 
      choices:[
        { text:'目送遠去', type:'direct', effects:{removeCompanion:'comp_sworddemon', addTag:'dugu_legacy'}, next:'act1_inn' }
      ]
    },
  },
    COMPANIONS: {
    comp_dongxie: { id:'comp_dongxie', name:'桃花島主', grade:'EX', desc:'東海孤島之上，一位精通琴棋書畫、奇門遁甲的白衣書生。', tags:['companion','sharp_eye'], passiveStats:{dex:3,int:3,hp:12}, attackName:'落英神劍掌', attackPower:25, attackEffect:'enemy_stun:1' },
    comp_taiji: { id:'comp_taiji', name:'太極宗師', grade:'S', desc:'武當山上一位白髮道長，百歲高齡仍精神矍鑠。', tags:['companion','inner_power','righteous'], passiveStats:{wis:3,con:3,hp:15}, attackName:'太極推手', attackPower:28, attackEffect:'self_pos_up:15' },
    comp_emei: { id:'comp_emei', name:'峨嵋掌門', grade:'A', desc:'峨嵋派掌門，性情剛烈，手持倚天劍。', tags:['companion','sword_master','righteous'], passiveStats:{dex:2,wis:2,hp:10}, attackName:'峨嵋金頂劍', attackPower:22, attackEffect:'enemy_ac_down:2' },
    comp_huashan: { id:'comp_huashan', name:'華山棄徒', grade:'B', desc:'一名被逐出師門的華山弟子，劍法凌厲。', tags:['companion','sword_master'], passiveStats:{dex:2,str:1,hp:8}, attackName:'華山落雁劍', attackPower:16, attackEffect:'' },
    comp_wanderer: { id:'comp_wanderer', name:'江湖遊俠', grade:'C', desc:'四海為家，見義勇為。', tags:['companion','lucky'], passiveStats:{con:2,cha:1,hp:5}, attackName:'遊俠快刀', attackPower:10, attackEffect:'' },
    comp_thug: { id:'comp_thug', name:'市井混混', grade:'D', desc:'街頭出身，講義氣，也講利益。', tags:['companion','vengeful'], passiveStats:{str:1,con:1,hp:3}, attackName:'板磚招呼', attackPower:6, attackEffect:'' }
  },
};