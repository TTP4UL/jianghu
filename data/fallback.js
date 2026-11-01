const FALLBACK_DATA = {
  "TAGS": {
    "origin_martial_family": {
      "id": "origin_martial_family",
      "name": "武學世家",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "origin_merchant": {
      "id": "origin_merchant",
      "name": "商賈之家",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "origin_orphan": {
      "id": "origin_orphan",
      "name": "市井孤兒",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "origin_mediocre": {
      "id": "origin_mediocre",
      "name": "平庸凡人",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "origin_entered_sect": {
      "id": "origin_entered_sect",
      "name": "已入門派",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "origin_unmarried": {
      "id": "origin_unmarried",
      "name": "慘被退婚",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "Grade": "D"
    },
    "sect_shaolin": {
      "id": "sect_shaolin",
      "name": "少林弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "Grade": "D"
    },
    "sect_wudang": {
      "id": "sect_wudang",
      "name": "武當弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "Grade": "D"
    },
    "sect_emei": {
      "id": "sect_emei",
      "name": "峨嵋弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "Grade": "D"
    },
    "gender_male": {
      "id": "gender_male",
      "name": "男",
      "bonus": 0,
      "category": "gender",
      "visible": false,
      "Grade": ""
    },
    "gender_female": {
      "id": "gender_female",
      "name": "女",
      "bonus": 0,
      "category": "gender",
      "visible": false,
      "Grade": ""
    },
    "sword_master": {
      "id": "sword_master",
      "name": "劍法精通",
      "bonus": 3,
      "category": "skill",
      "visible": true,
      "Grade": "C"
    },
    "inner_power": {
      "id": "inner_power",
      "name": "內功深厚",
      "bonus": 3,
      "category": "skill",
      "visible": true,
      "Grade": "D"
    },
    "iron_body": {
      "id": "iron_body",
      "name": "鐵骨銅身",
      "bonus": 2,
      "category": "skill",
      "visible": true,
      "Grade": "D"
    },
    "sharp_eye": {
      "id": "sharp_eye",
      "name": "洞若觀火",
      "bonus": 2,
      "category": "skill",
      "visible": true,
      "Grade": "D"
    },
    "righteous": {
      "id": "righteous",
      "name": "名門正派",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "Grade": "D"
    },
    "evil": {
      "id": "evil",
      "name": "邪派",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "Grade": "D"
    },
    "lucky": {
      "id": "lucky",
      "name": "福星高照",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "Grade": "D"
    },
    "vengeful": {
      "id": "vengeful",
      "name": "復仇心切",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "Grade": "D"
    },
    "ugly_af": {
      "id": "ugly_af",
      "name": "奇醜無比",
      "bonus": -2,
      "category": "trait",
      "visible": true,
      "Grade": "D"
    }
  },
  "ORIGINS": {
    "martial_family": {
      "id": "martial_family",
      "name": "武學世家",
      "desc": "祖上曾出過一位宗師，家中藏有幾本殘缺秘籍。",
      "intro": "你生於青磚綠瓦的武林名門，自幼伴隨晨鐘劍鳴而醒。長輩以嚴苛規訓雕琢你的根骨，兵器架上的冷鐵是你最初的玩伴。族中藏經閣深鎖著歷代先輩以命相搏的殘卷秘籍，門楣的榮耀與重擔，從你落地啼哭那一刻起便已刻入骨血。",
      "gold": 500,
      "str": 2,
      "dex": 1,
      "con": 2,
      "int": 0,
      "wis": 0,
      "cha": 0,
      "initialMartialArts": [
        "c_basic_sword"
      ],
      "initialTags": [
        "inner_power"
      ],
      "special": null,
      "baseStats": {
        "str": 2,
        "dex": 1,
        "con": 2,
        "int": 0,
        "wis": 0,
        "cha": 0
      }
    },
    "merchant": {
      "id": "merchant",
      "name": "商賈之家",
      "desc": "家中經營鏢局，自幼見慣江湖人物與三教九流。",
      "intro": "算盤珠落玉盤之聲，是你童年唯一的音律。身為巨富商賈之子，你自幼跟隨父輩穿梭於南來北往的鏢隊與酒肆。在你眼中，江湖並非單憑快意恩仇，天下熙熙皆為利來，刀光劍影背後，只要銀票足夠厚，縱使閻羅惡煞亦得俯首稱臣。",
      "gold": 2000,
      "str": 0,
      "dex": 0,
      "con": 1,
      "int": 0,
      "wis": 2,
      "cha": 1,
      "initialMartialArts": [
        "e_money_talk"
      ],
      "initialTags": [
        "lucky"
      ],
      "special": null,
      "baseStats": {
        "str": 0,
        "dex": 0,
        "con": 1,
        "int": 0,
        "wis": 2,
        "cha": 1
      }
    },
    "orphan": {
      "id": "orphan",
      "name": "市井孤兒",
      "desc": "街頭長大，一身傷疤換來一身本領，無牽無掛。",
      "intro": "破廟漏雨的屋簷、泥濘骯髒的後巷，便是撫育你長大的江湖。你不知父母名姓，只知若手慢半寸便會餓死街頭。一身青紫傷疤換來比野狗更敏銳的求生本能。無門無派、無名無姓，這天地雖大，你唯有一雙拳頭和一腔不信命的狠勁。",
      "gold": 50,
      "str": 0,
      "dex": 2,
      "con": 1,
      "int": 1,
      "wis": 1,
      "cha": 0,
      "initialMartialArts": [
        "e_street_fist"
      ],
      "initialTags": [
        "vengeful"
      ],
      "special": null,
      "baseStats": {
        "str": 0,
        "dex": 2,
        "con": 1,
        "int": 1,
        "wis": 1,
        "cha": 0
      }
    },
    "mediocre": {
      "id": "mediocre",
      "name": "平庸凡人",
      "desc": "你各方面都很普通，沒有背景，沒有天賦，但你活到了今日。",
      "intro": "你沒有驚天動地的血海深仇，亦無百年難遇的絕世靈根。身為邊陲小鎮再尋常不過的少年，旁人在演武場一日千里，你揮汗如雨數載方能搬運一口濁氣。但頑石若歷千萬刀雕琢，亦能割裂長空。凡人的一生，未到最後，誰敢妄言平庸？",
      "gold": 100,
      "str": 1,
      "dex": 1,
      "con": 1,
      "int": 1,
      "wis": 1,
      "cha": 0,
      "initialMartialArts": [],
      "initialTags": [],
      "special": null,
      "baseStats": {
        "str": 1,
        "dex": 1,
        "con": 1,
        "int": 1,
        "wis": 1,
        "cha": 0
      }
    },
    "entered_sect": {
      "id": "entered_sect",
      "name": "已入門派",
      "desc": "自幼拜入名門大派，已有根基。",
      "intro": "晨光初破，山門香煙繚繞。你幼時受引渡長老點化拜入名門大派，身披素色道袍，日夜修習祖師傳下的正統心法。門規森嚴如鐵，派系同門暗藏鋒芒。你雖站在無數江湖人艷羨的起跑線上，但深山長階之上，每一步登頂皆是考驗。",
      "gold": 200,
      "str": 0,
      "dex": 0,
      "con": 0,
      "int": 0,
      "wis": 0,
      "cha": 0,
      "initialMartialArts": [],
      "initialTags": [],
      "special": "righteous",
      "baseStats": {
        "str": 0,
        "dex": 0,
        "con": 0,
        "int": 0,
        "wis": 0,
        "cha": 0
      }
    },
    "unmarried": {
      "id": "unmarried",
      "name": "慘被退婚",
      "desc": "三十年河東，三十年河西，莫欺少年窮！",
      "intro": "議事大堂之上，聘禮被棄如敝履，退婚書當眾撕裂灑落如雪。昔日指腹為婚的天驕冷眼睥睨，宗族長輩冷言譏誚，只因你靈脈受阻、修為停滯。三十年河東，三十年河西！指甲刺破掌心滲出血跡，這份刻骨之恥，終將化作焚盡天地的燎原怒火。",
      "gold": 100,
      "str": 0,
      "dex": 0,
      "con": 0,
      "int": 3,
      "wis": 3,
      "cha": 0,
      "initialMartialArts": [],
      "initialTags": [],
      "special": null,
      "baseStats": {
        "str": 0,
        "dex": 0,
        "con": 0,
        "int": 3,
        "wis": 3,
        "cha": 0
      }
    }
  },
  "SECTS": {
    "shaolin": {
      "id": "shaolin",
      "name": "少林",
      "genderLimit": "male",
      "desc": "天下武功出少林",
      "baseHp": 32,
      "basePos": 20,
      "baseQi": 5,
      "str": 3,
      "dex": 0,
      "con": 3,
      "int": 0,
      "wis": 0,
      "cha": 0,
      "startingArts": [
        "d_shaolin_fist",
        "d_luohan"
      ],
      "featureText": "罡氣架勢上限提升，能硬抗重擊",
      "sectStats": {
        "str": 3,
        "dex": 0,
        "con": 3,
        "int": 0,
        "wis": 0,
        "cha": 0
      }
    },
    "wudang": {
      "id": "wudang",
      "name": "武當",
      "genderLimit": "",
      "desc": "以柔克剛，後發制人",
      "baseHp": 28,
      "basePos": 16,
      "baseQi": 6,
      "str": 2,
      "dex": 1,
      "con": 2,
      "int": 1,
      "wis": 1,
      "cha": 0,
      "startingArts": [
        "a_taiji",
        "c_wudang_sword"
      ],
      "featureText": "太極卸力，架勢恢復加快",
      "sectStats": {
        "str": 2,
        "dex": 1,
        "con": 2,
        "int": 1,
        "wis": 1,
        "cha": 0
      }
    },
    "emei": {
      "id": "emei",
      "name": "峨嵋",
      "genderLimit": "female",
      "desc": "巾幗不讓鬚眉",
      "baseHp": 26,
      "basePos": 18,
      "baseQi": 7,
      "str": 0,
      "dex": 2,
      "con": 0,
      "int": 0,
      "wis": 1,
      "cha": 3,
      "startingArts": [
        "b_emei_sword",
        "c_emei_palm"
      ],
      "featureText": "劍法與心法並重，真氣充沛",
      "sectStats": {
        "str": 0,
        "dex": 2,
        "con": 0,
        "int": 0,
        "wis": 1,
        "cha": 3
      }
    }
  },
  "MARTIAL_ARTS": {
    "ex_jiuyang": {
      "id": "ex_jiuyang",
      "name": "九陽神功",
      "grade": "EX",
      "type": "內功",
      "slot": "inner",
      "basePower": 100,
      "learnDC": 30,
      "growthRate": 5,
      "desc": "至陽至剛，天下無敵"
    },
    "s_dugu": {
      "id": "s_dugu",
      "name": "獨孤九劍",
      "grade": "S",
      "type": "劍法",
      "slot": "attack",
      "basePower": 85,
      "learnDC": 25,
      "growthRate": 4,
      "desc": "以無招勝有招"
    },
    "a_taiji": {
      "id": "a_taiji",
      "name": "太極拳",
      "grade": "A",
      "type": "拳法",
      "slot": "attack",
      "basePower": 70,
      "learnDC": 20,
      "growthRate": 3,
      "desc": "以柔克剛，四兩撥千斤"
    },
    "b_emei_sword": {
      "id": "b_emei_sword",
      "name": "峨嵋劍法",
      "grade": "B",
      "type": "劍法",
      "slot": "attack",
      "basePower": 55,
      "learnDC": 15,
      "growthRate": 2,
      "desc": "峨嵋入門劍法，重意不重招"
    },
    "c_basic_sword": {
      "id": "c_basic_sword",
      "name": "基礎劍法",
      "grade": "C",
      "type": "劍法",
      "slot": "attack",
      "basePower": 30,
      "learnDC": 10,
      "growthRate": 1,
      "desc": "江湖人人會使的入門劍法"
    },
    "c_wudang_sword": {
      "id": "c_wudang_sword",
      "name": "武當劍法",
      "grade": "C",
      "type": "劍法",
      "slot": "attack",
      "basePower": 32,
      "learnDC": 11,
      "growthRate": 1.2,
      "desc": "武當入門劍法，以柔馭剛"
    },
    "c_emei_palm": {
      "id": "c_emei_palm",
      "name": "峨嵋掌法",
      "grade": "C",
      "type": "拳法",
      "slot": "attack",
      "basePower": 28,
      "learnDC": 10,
      "growthRate": 1,
      "desc": "峨嵋入門掌法，輕靈飄逸"
    },
    "d_shaolin_fist": {
      "id": "d_shaolin_fist",
      "name": "羅漢拳",
      "grade": "D",
      "type": "拳法",
      "slot": "attack",
      "basePower": 20,
      "learnDC": 8,
      "growthRate": 1,
      "desc": "少林入門拳法，剛猛紮實"
    },
    "d_luohan": {
      "id": "d_luohan",
      "name": "羅漢伏虎",
      "grade": "D",
      "type": "拳法",
      "slot": "attack",
      "basePower": 22,
      "learnDC": 8,
      "growthRate": 1,
      "desc": "少林進階拳法"
    },
    "e_money_talk": {
      "id": "e_money_talk",
      "name": "商道",
      "grade": "E",
      "type": "特殊",
      "slot": "utility",
      "basePower": 10,
      "learnDC": 5,
      "growthRate": 0.5,
      "desc": "討價還價的江湖技藝"
    },
    "e_street_fist": {
      "id": "e_street_fist",
      "name": "街頭把式",
      "grade": "E",
      "type": "拳法",
      "slot": "attack",
      "basePower": 10,
      "learnDC": 5,
      "growthRate": 0.5,
      "desc": "打架用的下三濫招"
    }
  },
  "COMPANIONS": {
    "comp_dongxie": {
      "id": "comp_dongxie",
      "name": "桃花島主",
      "grade": "EX",
      "desc": "東海孤島之上，一位精通琴棋書畫、奇門遁甲的白衣書生。",
      "tags": [
        "companion",
        "sharp_eye"
      ],
      "passiveStats": {
        "dex": 3,
        "int": 3,
        "hp": 12
      },
      "attackName": "落英神劍掌",
      "attackPower": 25,
      "attackEffect": "enemy_stun:1"
    },
    "comp_taiji": {
      "id": "comp_taiji",
      "name": "太極宗師",
      "grade": "S",
      "desc": "武當山上一位白髮道長，百歲高齡仍精神矍鑠。",
      "tags": [
        "companion",
        "inner_power",
        "righteous"
      ],
      "passiveStats": {
        "wis": 3,
        "con": 3,
        "hp": 15
      },
      "attackName": "太極推手",
      "attackPower": 28,
      "attackEffect": "self_pos_up:15"
    },
    "comp_emei": {
      "id": "comp_emei",
      "name": "峨嵋掌門",
      "grade": "A",
      "desc": "峨嵋派掌門，性情剛烈，手持倚天劍。",
      "tags": [
        "companion",
        "sword_master",
        "righteous"
      ],
      "passiveStats": {
        "dex": 2,
        "wis": 2,
        "hp": 10
      },
      "attackName": "峨嵋金頂劍",
      "attackPower": 22,
      "attackEffect": "enemy_ac_down:2"
    },
    "comp_huashan": {
      "id": "comp_huashan",
      "name": "華山棄徒",
      "grade": "B",
      "desc": "一名被逐出師門的華山弟子，劍法凌厲。",
      "tags": [
        "companion",
        "sword_master"
      ],
      "passiveStats": {
        "dex": 2,
        "str": 1,
        "hp": 8
      },
      "attackName": "華山落雁劍",
      "attackPower": 16,
      "attackEffect": ""
    },
    "comp_wanderer": {
      "id": "comp_wanderer",
      "name": "江湖遊俠",
      "grade": "C",
      "desc": "四海為家，見義勇為。",
      "tags": [
        "companion",
        "lucky"
      ],
      "passiveStats": {
        "con": 2,
        "cha": 1,
        "hp": 5
      },
      "attackName": "遊俠快刀",
      "attackPower": 10,
      "attackEffect": ""
    },
    "comp_thug": {
      "id": "comp_thug",
      "name": "市井混混",
      "grade": "D",
      "desc": "街頭出身，講義氣，也講利益。",
      "tags": [
        "companion",
        "vengeful"
      ],
      "passiveStats": {
        "str": 1,
        "con": 1,
        "hp": 3
      },
      "attackName": "板磚招呼",
      "attackPower": 6,
      "attackEffect": ""
    }
  },
  "LIFEPATH_EVENTS": [
    {
      "id": "lp13_shaolin",
      "age": 13,
      "requireTags": [
        "sect_shaolin"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "羅漢堂晨鐘",
      "text": "天未光，羅漢堂鐘聲響起。你隨眾僧練拳，師父在你身旁停下腳步。",
      "speaker": "師父"
    },
    {
      "id": "lp13_emei",
      "age": 13,
      "requireTags": [
        "sect_emei",
        "gender_female"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "金頂雲霧",
      "text": "峨嵋金頂，雲霧繚繞。師父將一柄木劍遞給你：「峨嵋劍法，重意不重招。」",
      "speaker": "師父"
    },
    {
      "id": "lp13_orphan",
      "age": 13,
      "requireTags": [
        "origin_orphan"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "街頭生存",
      "text": "你在街頭已經混了十三年。今日，一個衣著華貴的老者在你面前被三個混混圍住。",
      "speaker": "旁白"
    },
    {
      "id": "lp13_common",
      "age": 13,
      "requireTags": [],
      "forbidTags": [
        "sect_shaolin",
        "sect_wudang",
        "sect_emei"
      ],
      "priority": 0,
      "title": "少年立志",
      "text": "十三歲，你站在人生的第一個岔路口。村口老人說，江湖很大，也很小。",
      "speaker": "旁白"
    },
    {
      "id": "lp14_common",
      "age": 14,
      "requireTags": [],
      "forbidTags": [],
      "priority": 0,
      "title": "江湖傳聞",
      "text": "十四歲，你開始聽到更多關於江湖的傳聞。有人在酒館說起「華山論劍」。",
      "speaker": "旁白"
    },
    {
      "id": "lp15_common",
      "age": 15,
      "requireTags": [],
      "forbidTags": [],
      "priority": 0,
      "title": "初遇強敵",
      "text": "十五歲，你在山道上遇到一個身手不凡的陌生人，他似乎在找什麼。",
      "speaker": "旁白"
    },
    {
      "id": "lp16_common",
      "age": 16,
      "requireTags": [],
      "forbidTags": [],
      "priority": 0,
      "title": "心魔試煉",
      "text": "十六歲，你開始夢見一些奇怪的東西。有人說，這是走火入魔的前兆。",
      "speaker": "旁白"
    },
    {
      "id": "lp17_common",
      "age": 17,
      "requireTags": [],
      "forbidTags": [],
      "priority": 0,
      "title": "生死一線",
      "text": "十七歲，你修煉時經脈逆行，生死一線。你必須做出選擇。",
      "speaker": "旁白"
    },
    {
      "id": "lp13_martial",
      "age": 13,
      "requireTags": [
        "origin_martial_family"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "家傳殘卷",
      "text": "父親帶你到祠堂，從暗格取出一本泛黃殘破的劍譜。「這是祖上留下的，能領悟多少，看你自己。」",
      "speaker": "父親"
    },
    {
      "id": "lp14_martial",
      "age": 14,
      "requireTags": [
        "origin_martial_family"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "宗族年會",
      "text": "每年歲晚的族中演武，各房同輩齊聚。堂兄仗著早修煉兩年，在擂台上公然邀你指教：「賢弟，讓為兄稱稱你的斤兩！」",
      "speaker": "堂兄"
    },
    {
      "id": "lp15_martial",
      "age": 15,
      "requireTags": [
        "origin_martial_family"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "世仇叩門",
      "text": "數十年前與家族結怨的「斷魂刀」傳人登門尋仇，指名要見識你家祖傳絕學，父輩皆在外辦事，莊內大亂。",
      "speaker": "旁白"
    },
    {
      "id": "lp16_martial",
      "age": 16,
      "requireTags": [
        "origin_martial_family"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "祖師密道",
      "text": "盛夏修煉之際，你在後山石窟意外發現刻有祖師名諱的密道石門，陣陣陰寒罡氣從石縫逸出。",
      "speaker": "旁白"
    },
    {
      "id": "lp17_martial",
      "age": 17,
      "requireTags": [
        "origin_martial_family"
      ],
      "forbidTags": [],
      "priority": 10,
      "title": "冠禮試煉",
      "text": "十七歲行加冠禮，按祖訓需獨自入洗劍池浸淬佩劍，並承受三道劍氣洗禮，若成則可接掌家傳寶劍。",
      "speaker": "父親"
    }
  ],
  "LIFEPATH_CHOICES": {
    "lp13_common": [
      {
        "eventId": "lp13_common",
        "order": 1,
        "text": "潛心修煉",
        "desc": "閉門三年，打好根基。",
        "type": "check",
        "checkName": "根骨檢定",
        "attr": "con",
        "dc": 12,
        "tags": "iron_body",
        "successNarrative": "你根基穩固，氣血充盈。",
        "successEffects": "con:2",
        "successNext": "",
        "failNarrative": "修煉不得法，略感不適。",
        "failEffects": "con:-1|hp:-3",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你根基穩固，氣血充盈。",
          "effects": {
            "con": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "修煉不得法，略感不適。",
          "effects": {
            "con": -1,
            "hp": -3
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp13_common",
        "order": 2,
        "text": "遊歷四方",
        "desc": "外出見識，增長閱歷。",
        "type": "check",
        "checkName": "悟性檢定",
        "attr": "int",
        "dc": 11,
        "tags": "sharp_eye",
        "successNarrative": "你見多識廣，悟性大開。",
        "successEffects": "int:2",
        "successNext": "",
        "failNarrative": "路上遇到騙子，損失錢財。",
        "failEffects": "gold:-50",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你見多識廣，悟性大開。",
          "effects": {
            "int": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "路上遇到騙子，損失錢財。",
          "effects": {
            "gold": -50
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp13_shaolin": [
      {
        "eventId": "lp13_shaolin",
        "order": 1,
        "text": "苦練羅漢拳",
        "desc": "專心修習本門武功。",
        "type": "check",
        "checkName": "臂力檢定",
        "attr": "str",
        "dc": 12,
        "tags": "iron_body",
        "successNarrative": "你的羅漢拳已有小成。",
        "successEffects": "str:2",
        "successNext": "",
        "failNarrative": "練功過度，肌肉酸痛。",
        "failEffects": "str:-1|hp:-5",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你的羅漢拳已有小成。",
          "effects": {
            "str": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "練功過度，肌肉酸痛。",
          "effects": {
            "str": -1,
            "hp": -5
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp13_shaolin",
        "order": 2,
        "text": "偷學進階武學",
        "desc": "偷偷翻看羅漢堂的秘籍。",
        "type": "check",
        "checkName": "悟性檢定",
        "attr": "int",
        "dc": 15,
        "tags": "",
        "successNarrative": "你竟在殘卷中悟出羅漢伏虎真意！",
        "successEffects": "addMartialArt:d_luohan|int:1",
        "successNext": "",
        "failNarrative": "被師兄發現，罰跪三日。",
        "failEffects": "int:-1|hp:-3",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你竟在殘卷中悟出羅漢伏虎真意！",
          "effects": {
            "addMartialArt": "d_luohan",
            "int": 1
          },
          "next": null
        },
        "fail": {
          "narrative": "被師兄發現，罰跪三日。",
          "effects": {
            "int": -1,
            "hp": -3
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp14_common": [
      {
        "eventId": "lp14_common",
        "order": 1,
        "text": "前往華山",
        "desc": "聽聞華山有高人論劍。",
        "type": "check",
        "checkName": "福緣檢定",
        "attr": "wis",
        "dc": 13,
        "tags": "lucky",
        "successNarrative": "你結識了一位華山弟子，獲贈劍譜，他更決定與你同行！",
        "successEffects": "addMartialArt:c_basic_sword|wis:1|addCompanion:comp_huashan",
        "successNext": "",
        "failNarrative": "路上盤纏耗盡，狼狽而歸。",
        "failEffects": "gold:-100|hp:-3",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你結識了一位華山弟子，獲贈劍譜，他更決定與你同行！",
          "effects": {
            "addMartialArt": "c_basic_sword",
            "wis": 1,
            "addCompanion": "comp_huashan"
          },
          "next": null
        },
        "fail": {
          "narrative": "路上盤纏耗盡，狼狽而歸。",
          "effects": {
            "gold": -100,
            "hp": -3
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp14_common",
        "order": 2,
        "text": "留在原地",
        "desc": "穩紮穩打，繼續修煉。",
        "type": "direct",
        "checkName": "",
        "attr": "",
        "dc": "",
        "tags": "",
        "successNarrative": "",
        "successEffects": "",
        "successNext": "",
        "failNarrative": "",
        "failEffects": "",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "con:1|qi:1",
        "requireTags": [],
        "forbidTags": [],
        "narrative": "",
        "effects": null,
        "next": "con:1|qi:1"
      }
    ],
    "lp15_common": [
      {
        "eventId": "lp15_common",
        "order": 1,
        "text": "主動挑戰",
        "desc": "你想試試自己的身手。",
        "type": "check",
        "checkName": "臂力檢定",
        "attr": "str",
        "dc": 14,
        "tags": "sword_master|iron_body",
        "successNarrative": "你擊敗了對方，名聲初顯。",
        "successEffects": "str:2|cha:1|addTag:sword_master",
        "successNext": "",
        "failNarrative": "你被對方打傷，狼狽逃走。",
        "failEffects": "hp:-10|str:-1",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你擊敗了對方，名聲初顯。",
          "effects": {
            "str": 2,
            "cha": 1,
            "addTag": "sword_master"
          },
          "next": null
        },
        "fail": {
          "narrative": "你被對方打傷，狼狽逃走。",
          "effects": {
            "hp": -10,
            "str": -1
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp15_common",
        "order": 2,
        "text": "暗中觀察",
        "desc": "先看看對方底細。",
        "type": "check",
        "checkName": "悟性檢定",
        "attr": "int",
        "dc": 12,
        "tags": "sharp_eye",
        "successNarrative": "你發現對方是名門弟子，學到了幾招。",
        "successEffects": "int:2",
        "successNext": "",
        "failNarrative": "你被對方發現，遭到追殺。",
        "failEffects": "hp:-6",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你發現對方是名門弟子，學到了幾招。",
          "effects": {
            "int": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "你被對方發現，遭到追殺。",
          "effects": {
            "hp": -6
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp16_common": [
      {
        "eventId": "lp16_common",
        "order": 1,
        "text": "直面心魔",
        "desc": "以意志對抗內心恐懼。",
        "type": "check",
        "checkName": "心法檢定",
        "attr": "wis",
        "dc": 15,
        "tags": "inner_power",
        "successNarrative": "你戰勝心魔，心境更上一層樓。",
        "successEffects": "wis:3|addTag:inner_power",
        "successNext": "",
        "failNarrative": "心魔反噬，你大病一場。",
        "failEffects": "wis:-2|hp:-10",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你戰勝心魔，心境更上一層樓。",
          "effects": {
            "wis": 3,
            "addTag": "inner_power"
          },
          "next": null
        },
        "fail": {
          "narrative": "心魔反噬，你大病一場。",
          "effects": {
            "wis": -2,
            "hp": -10
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp16_common",
        "order": 2,
        "text": "求助師長",
        "desc": "向信任的人尋求幫助。",
        "type": "check",
        "checkName": "名望檢定",
        "attr": "cha",
        "dc": 12,
        "tags": "righteous",
        "successNarrative": "師長為你開解，你豁然開朗。",
        "successEffects": "wis:1|cha:1|hp:5",
        "successNext": "",
        "failNarrative": "無人可求助，你獨自煎熬。",
        "failEffects": "wis:-1",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "師長為你開解，你豁然開朗。",
          "effects": {
            "wis": 1,
            "cha": 1,
            "hp": 5
          },
          "next": null
        },
        "fail": {
          "narrative": "無人可求助，你獨自煎熬。",
          "effects": {
            "wis": -1
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp17_common": [
      {
        "eventId": "lp17_common",
        "order": 1,
        "text": "強行衝關",
        "desc": "以命搏突破，成則一飛沖天。",
        "type": "check",
        "checkName": "根骨檢定",
        "attr": "con",
        "dc": 17,
        "tags": "iron_body|inner_power",
        "successNarrative": "突破成功！你經脈暢通，氣血如虹。",
        "successEffects": "con:3|qi:2|hp:10",
        "successNext": "",
        "failNarrative": "經脈盡斷，英年早逝……",
        "failEffects": "",
        "failNext": "",
        "failGameOver": true,
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "突破成功！你經脈暢通，氣血如虹。",
          "effects": {
            "con": 3,
            "qi": 2,
            "hp": 10
          },
          "next": null
        },
        "fail": {
          "narrative": "經脈盡斷，英年早逝……",
          "effects": null,
          "next": null,
          "failGameOver": true
        }
      },
      {
        "eventId": "lp17_common",
        "order": 2,
        "text": "穩紮穩打",
        "desc": "放棄突破，穩住現有根基。",
        "type": "direct",
        "checkName": "",
        "attr": "",
        "dc": "",
        "tags": "",
        "successNarrative": "",
        "successEffects": "",
        "successNext": "",
        "failNarrative": "",
        "failEffects": "",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "con:1|hp:5",
        "requireTags": [],
        "forbidTags": [],
        "narrative": "",
        "effects": null,
        "next": "con:1|hp:5"
      }
    ],
    "lp13_martial": [
      {
        "eventId": "lp13_martial",
        "order": 1,
        "text": "潛心鑽研劍譜",
        "desc": "閉門苦修，專攻家傳劍法。",
        "type": "check",
        "checkName": "悟性檢定",
        "attr": "int",
        "dc": 14,
        "tags": "sword_master",
        "successNarrative": "你屏息凝神參透殘卷劍意，劍氣如虹，一套基礎劍法在你手中化腐朽為神奇！",
        "successEffects": "int:2|addTag:sword_master|addMartialArt:c_basic_sword",
        "successNext": "",
        "failNarrative": "心浮氣躁強行催動劍氣，經脈逆亂刺痛難忍，劍譜反被內勁震裂數頁。",
        "failEffects": "int:-1|hp:-5",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你屏息凝神參透殘卷劍意，劍氣如虹，一套基礎劍法在你手中化腐朽為神奇！",
          "effects": {
            "int": 2,
            "addTag": "sword_master",
            "addMartialArt": "c_basic_sword"
          },
          "next": null
        },
        "fail": {
          "narrative": "心浮氣躁強行催動劍氣，經脈逆亂刺痛難忍，劍譜反被內勁震裂數頁。",
          "effects": {
            "int": -1,
            "hp": -5
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp13_martial",
        "order": 2,
        "text": "偷練後山禁術",
        "desc": "傳聞後山禁地藏有絕世武學殘頁。",
        "type": "check",
        "checkName": "悟性檢定",
        "attr": "int",
        "dc": 18,
        "tags": "",
        "successNarrative": "石壁古字如龍蛇飛舞，你福至心靈竟參透獨孤九劍殘篇，胸中豪氣萬千！",
        "successEffects": "addMartialArt:s_dugu|int:3",
        "successNext": "",
        "failNarrative": "禁地煞氣入腦，心魔反噬如萬蟻噬骨，你雙目赤紅狂噴鮮血，煞念深種！",
        "failEffects": "hp:-15|addTag:evil",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "石壁古字如龍蛇飛舞，你福至心靈竟參透獨孤九劍殘篇，胸中豪氣萬千！",
          "effects": {
            "addMartialArt": "s_dugu",
            "int": 3
          },
          "next": null
        },
        "fail": {
          "narrative": "禁地煞氣入腦，心魔反噬如萬蟻噬骨，你雙目赤紅狂噴鮮血，煞念深種！",
          "effects": {
            "hp": -15,
            "addTag": "evil"
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp14_martial": [
      {
        "eventId": "lp14_martial",
        "order": 1,
        "text": "亮劍登台接戰",
        "desc": "以硬實力正面迎擊堂兄的挑釁。",
        "type": "check",
        "checkName": "臂力比拼",
        "attr": "str",
        "dc": 13,
        "tags": "sword_master",
        "successNarrative": "金鐵交鳴之聲震徹全場！你沉腰坐馬一記震字訣，直接挑飛堂兄長劍，滿堂長老皆撫鬚稱讚！",
        "successEffects": "str:2|cha:1|gold:200",
        "successNext": "",
        "failNarrative": "堂兄重刀勢大力沉，你虎口震裂兵刃脫手，在滿堂族人的低語嘆息中狼狽敗陣。",
        "failEffects": "cha:-1|hp:-5",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "金鐵交鳴之聲震徹全場！你沉腰坐馬一記震字訣，直接挑飛堂兄長劍，滿堂長老皆撫鬚稱讚！",
          "effects": {
            "str": 2,
            "cha": 1,
            "gold": 200
          },
          "next": null
        },
        "fail": {
          "narrative": "堂兄重刀勢大力沉，你虎口震裂兵刃脫手，在滿堂族人的低語嘆息中狼狽敗陣。",
          "effects": {
            "cha": -1,
            "hp": -5
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp14_martial",
        "order": 2,
        "text": "巧言避其鋒芒",
        "desc": "認可堂兄武功，借機請教拆招要訣。",
        "type": "direct",
        "checkName": "",
        "attr": "",
        "dc": "",
        "tags": "",
        "successNarrative": "",
        "successEffects": "",
        "successNext": "",
        "failNarrative": "",
        "failEffects": "",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "你抱拳躬身盛讚堂兄武藝，堂兄虛榮大滿足下傾囊相授拆招關竅，族長亦頷首誇你氣度沉穩。",
        "directEffects": "wis:1|con:1",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "narrative": "你抱拳躬身盛讚堂兄武藝，堂兄虛榮大滿足下傾囊相授拆招關竅，族長亦頷首誇你氣度沉穩。",
        "effects": {
          "wis": 1,
          "con": 1
        },
        "next": null
      }
    ],
    "lp15_martial": [
      {
        "eventId": "lp15_martial",
        "order": 1,
        "text": "拔劍守護山莊",
        "desc": "挺身而出，以祖傳劍訣迎戰狂徒！",
        "type": "check",
        "checkName": "身法劍訣",
        "attr": "dex",
        "dc": 14,
        "tags": "sword_master",
        "successNarrative": "你身如驚鴻穿梭於重重刀光之中，一劍刺穿惡徒手腕！狂徒負痛遁逃，山莊上下皆呼你為少主！",
        "successEffects": "dex:2|str:1|cha:2",
        "successNext": "",
        "failNarrative": "狂徒刀法狠辣霸道，你拼死招架仍被刀氣震傷肺腑，幸得莊內老護院拼死將你救下。",
        "failEffects": "hp:-15|pos:-5",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你身如驚鴻穿梭於重重刀光之中，一劍刺穿惡徒手腕！狂徒負痛遁逃，山莊上下皆呼你為少主！",
          "effects": {
            "dex": 2,
            "str": 1,
            "cha": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "狂徒刀法狠辣霸道，你拼死招架仍被刀氣震傷肺腑，幸得莊內老護院拼死將你救下。",
          "effects": {
            "hp": -15,
            "pos": -5
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp15_martial",
        "order": 2,
        "text": "開啟護莊機關",
        "desc": "利用地利與祖師留下的暗弩機關周旋。",
        "type": "check",
        "checkName": "洞悉機巧",
        "attr": "int",
        "dc": 12,
        "tags": "sharp_eye",
        "successNarrative": "你巧妙扭動青銅獸首，萬千破甲弩箭與滾石傾瀉而下，將狂徒逼得抱頭鼠竄，遺落滿地財貨！",
        "successEffects": "int:2|gold:300",
        "successNext": "",
        "failNarrative": "機關因年久失修卡死，反彈的機簧暗箭擦傷你手臂，狂徒趁亂搶走莊內不少財物。",
        "failEffects": "hp:-8",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你巧妙扭動青銅獸首，萬千破甲弩箭與滾石傾瀉而下，將狂徒逼得抱頭鼠竄，遺落滿地財貨！",
          "effects": {
            "int": 2,
            "gold": 300
          },
          "next": null
        },
        "fail": {
          "narrative": "機關因年久失修卡死，反彈的機簧暗箭擦傷你手臂，狂徒趁亂搶走莊內不少財物。",
          "effects": {
            "hp": -8
          },
          "next": null,
          "failGameOver": false
        }
      }
    ],
    "lp16_martial": [
      {
        "eventId": "lp16_martial",
        "order": 1,
        "text": "運轉內力破門",
        "desc": "嘗試以雄渾內勁強行震開石門封印。",
        "type": "check",
        "checkName": "內功根骨",
        "attr": "con",
        "dc": 15,
        "tags": "inner_power",
        "successNarrative": "你雙掌凝聚畢生純陽真氣猛擊石印，石門轟鳴大開，純陽九陽秘卷現世，你周身暖流奔騰！",
        "successEffects": "addMartialArt:ex_jiuyang|con:2|qi:2",
        "successNext": "",
        "failNarrative": "祖師罡氣封印豈容硬闖，剛猛反震之力直透心脈，震得你氣血翻湧，經絡劇烈抽搐！",
        "failEffects": "hp:-12|qi:-1",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "你雙掌凝聚畢生純陽真氣猛擊石印，石門轟鳴大開，純陽九陽秘卷現世，你周身暖流奔騰！",
          "effects": {
            "addMartialArt": "ex_jiuyang",
            "con": 2,
            "qi": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "祖師罡氣封印豈容硬闖，剛猛反震之力直透心脈，震得你氣血翻湧，經絡劇烈抽搐！",
          "effects": {
            "hp": -12,
            "qi": -1
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp16_martial",
        "order": 2,
        "text": "靜坐拓印石刻",
        "desc": "不涉險地，僅在洞外拓印石壁上的吐納心法。",
        "type": "direct",
        "checkName": "",
        "attr": "",
        "dc": "",
        "tags": "",
        "successNarrative": "",
        "successEffects": "",
        "successNext": "",
        "failNarrative": "",
        "failEffects": "",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "你盤膝於石門前三丈，將洞壁上殘留的古老吐納口訣一字不落銘記於心，體內濁氣盡排，神清氣爽。",
        "directEffects": "con:2|hp:5",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "narrative": "你盤膝於石門前三丈，將洞壁上殘留的古老吐納口訣一字不落銘記於心，體內濁氣盡排，神清氣爽。",
        "effects": {
          "con": 2,
          "hp": 5
        },
        "next": null
      }
    ],
    "lp17_martial": [
      {
        "eventId": "lp17_martial",
        "order": 1,
        "text": "沐浴三道劍氣",
        "desc": "咬牙引劍氣入體，洗髓伐毛，鍛造無上劍骨。",
        "type": "check",
        "checkName": "堅毅意志",
        "attr": "con",
        "dc": 16,
        "tags": "iron_body|sword_master",
        "successNarrative": "三道洗劍池凌厲劍氣貫體而過，你咬牙強忍抽筋剝骨之痛，經脈浴火重塑，祖傳靈劍嗡鳴認主！",
        "successEffects": "con:3|str:2|hp:15|qi:2",
        "successNext": "",
        "failNarrative": "狂暴劍氣如萬刃刮骨，你終是無法承受昏厥過去，佩劍光芒暗淡，體內留下了難以癒合的暗傷……",
        "failEffects": "hp:-20|con:-2",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "",
        "directEffects": "",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "success": {
          "narrative": "三道洗劍池凌厲劍氣貫體而過，你咬牙強忍抽筋剝骨之痛，經脈浴火重塑，祖傳靈劍嗡鳴認主！",
          "effects": {
            "con": 3,
            "str": 2,
            "hp": 15,
            "qi": 2
          },
          "next": null
        },
        "fail": {
          "narrative": "狂暴劍氣如萬刃刮骨，你終是無法承受昏厥過去，佩劍光芒暗淡，體內留下了難以癒合的暗傷……",
          "effects": {
            "hp": -20,
            "con": -2
          },
          "next": null,
          "failGameOver": false
        }
      },
      {
        "eventId": "lp17_martial",
        "order": 2,
        "text": "順其自然淬劍",
        "desc": "只求穩健取劍，不強融狂暴劍氣。",
        "type": "direct",
        "checkName": "",
        "attr": "",
        "dc": "",
        "tags": "",
        "successNarrative": "",
        "successEffects": "",
        "successNext": "",
        "failNarrative": "",
        "failEffects": "",
        "failNext": "",
        "failGameOver": "",
        "directNarrative": "你以溫和內力隔空接引，祖傳佩劍徐徐落入手中，雖未獲劍氣淬骨，但人劍合一，神完氣足。",
        "directEffects": "str:1|dex:1|hp:5",
        "directNext": "",
        "requireTags": [],
        "forbidTags": [],
        "narrative": "你以溫和內力隔空接引，祖傳佩劍徐徐落入手中，雖未獲劍氣淬骨，但人劍合一，神完氣足。",
        "effects": {
          "str": 1,
          "dex": 1,
          "hp": 5
        },
        "next": null
      }
    ]
  },
  "EVENTS": {
    "act1_inn": {
      "id": "act1_inn",
      "type": "normal",
      "uiType": "modal",
      "badge": "第壹章 · 客棧風雲",
      "title": "風雨欲來 · 黑風寨索命門",
      "text": "暴雨如注，你身披斗笠邁入官道旁的「悅來客棧」。三名手持鬼頭環刀的黑風寨惡煞正在腳踹櫃檯。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "victory",
      "onVictory": "defeat",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "act1_inn",
          "order": 1,
          "text": "拍案怒斥 · 威懾惡徒",
          "desc": "以江湖名威直壓其銳氣。",
          "type": "check",
          "checkName": "名望威壓",
          "attr": "cha",
          "dc": 12,
          "tags": "righteous|lucky",
          "successNarrative": "三人見你氣度不凡，倉皇遁走！",
          "successEffects": "qi:2",
          "successNext": "act2_forest",
          "failNarrative": "三人拔刀撲來！",
          "failEffects": "pos:-4",
          "failNext": "act2_forest",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "success": {
            "narrative": "三人見你氣度不凡，倉皇遁走！",
            "effects": {
              "qi": 2
            },
            "next": "act2_forest"
          },
          "fail": {
            "narrative": "三人拔刀撲來！",
            "effects": {
              "pos": -4
            },
            "next": "act2_forest",
            "failGameOver": false
          }
        },
        {
          "eventId": "act1_inn",
          "order": 2,
          "text": "拔劍相向",
          "desc": "不發一語，直接出鞘。",
          "type": "check",
          "checkName": "身法先攻",
          "attr": "dex",
          "dc": 13,
          "tags": "sword_master",
          "successNarrative": "寒芒一閃，惡徒潰退！",
          "successEffects": "addTag:sword_master",
          "successNext": "act2_forest",
          "failNarrative": "你被桌椅絆倒，架勢受損。",
          "failEffects": "pos:-3",
          "failNext": "act2_forest",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "success": {
            "narrative": "寒芒一閃，惡徒潰退！",
            "effects": {
              "addTag": "sword_master"
            },
            "next": "act2_forest"
          },
          "fail": {
            "narrative": "你被桌椅絆倒，架勢受損。",
            "effects": {
              "pos": -3
            },
            "next": "act2_forest",
            "failGameOver": false
          }
        }
      ]
    },
    "act2_forest": {
      "id": "act2_forest",
      "type": "normal",
      "uiType": "",
      "badge": "第貳章 · 密林暗影",
      "title": "古木幽篁 · 奇門連環毒弩",
      "text": "你追尋黑風寨殘黨深入竹林，四周寒霧四起，地面暗藏機關。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "victory",
      "onVictory": "defeat",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "act2_forest",
          "order": 1,
          "text": "施展輕功",
          "desc": "踩踏竹梢飄過陷阱。",
          "type": "check",
          "checkName": "身法輕功",
          "attr": "dex",
          "dc": 13,
          "tags": "sword_master",
          "successNarrative": "你身輕如燕，直取寨門！",
          "successEffects": "posSet:99",
          "successNext": "act3_boss",
          "failNarrative": "你踏中陷阱，架勢大損。",
          "failEffects": "pos:-5",
          "failNext": "act3_boss",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "success": {
            "narrative": "你身輕如燕，直取寨門！",
            "effects": {
              "posSet": 99
            },
            "next": "act3_boss"
          },
          "fail": {
            "narrative": "你踏中陷阱，架勢大損。",
            "effects": {
              "pos": -5
            },
            "next": "act3_boss",
            "failGameOver": false
          }
        },
        {
          "eventId": "act2_forest",
          "order": 2,
          "text": "拆解機關",
          "desc": "以悟性破陣。",
          "type": "check",
          "checkName": "悟性機關",
          "attr": "int",
          "dc": 12,
          "tags": "sharp_eye",
          "successNarrative": "機關反噬，暗哨全清！",
          "successEffects": "qi:1|addTag:sharp_eye",
          "successNext": "act3_boss",
          "failNarrative": "你強行破除，真氣耗損。",
          "failEffects": "qi:-1",
          "failNext": "act3_boss",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "success": {
            "narrative": "機關反噬，暗哨全清！",
            "effects": {
              "qi": 1,
              "addTag": "sharp_eye"
            },
            "next": "act3_boss"
          },
          "fail": {
            "narrative": "你強行破除，真氣耗損。",
            "effects": {
              "qi": -1
            },
            "next": "act3_boss",
            "failGameOver": false
          }
        }
      ]
    },
    "act3_boss": {
      "id": "act3_boss",
      "type": "combat",
      "uiType": "",
      "badge": "最終決戰",
      "title": "黑風聚義堂 · 決戰「狂刀」厲煞",
      "text": "「乳臭未乾的雜種，竟敢闖我黑風總寨！」巨漢猛踏青石板，狂暴煞氣撲面而來！",
      "speaker": "狂刀厲煞",
      "enemyName": "「狂刀」厲煞",
      "enemyHp": 48,
      "enemyPos": 24,
      "enemyAc": 13,
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "enemy": {
        "name": "「狂刀」厲煞",
        "hp": 48,
        "maxHp": 48,
        "pos": 24,
        "maxPos": 24,
        "ac": 13,
        "isStunned": false,
        "isPoisoned": 0
      }
    },
    "victory": {
      "id": "victory",
      "type": "ending",
      "uiType": "",
      "badge": "威震黑白兩道",
      "title": "一代宗師之姿",
      "text": "黑風寨殘部四散奔逃，你在聚義堂暗格起獲前朝密信與官銀。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "",
      "onVictory": "victory",
      "onDefeat": "",
      "endingVariant": ""
    },
    "defeat": {
      "id": "defeat",
      "type": "ending",
      "uiType": "",
      "badge": "氣數已盡",
      "title": "殞落深山",
      "text": "刀芒掠過，身軀不支倒在血泊中……江湖路遠，英魂長眠。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "",
      "onVictory": "defeat",
      "onDefeat": "",
      "endingVariant": ""
    },
    "lifepath_death": {
      "id": "lifepath_death",
      "type": "ending",
      "uiType": "",
      "badge": "中道崩殂",
      "title": "英年早逝",
      "text": "經脈盡斷，氣血枯竭。你的人生在十七歲戛然而止……",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "",
      "onVictory": "defeat",
      "onDefeat": "",
      "endingVariant": ""
    },
    "event_tavern_mock": {
      "id": "event_tavern_mock",
      "type": "normal",
      "uiType": "",
      "badge": "酒館",
      "title": "消息靈通",
      "text": "你在酒館聽到有人談論黑風寨的惡行。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "event_tavern_mock",
          "order": 1,
          "text": "繼續打聽",
          "desc": "",
          "type": "direct",
          "checkName": "",
          "attr": "",
          "dc": "",
          "tags": "",
          "successNarrative": "",
          "successEffects": "",
          "successNext": "",
          "failNarrative": "",
          "failEffects": "",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "你結識了一位江湖百曉生，名望提升。",
          "directEffects": "cha:1",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "narrative": "你結識了一位江湖百曉生，名望提升。",
          "effects": {
            "cha": 1
          },
          "next": null
        }
      ]
    },
    "event_explore_mock": {
      "id": "event_explore_mock",
      "type": "normal",
      "uiType": "",
      "badge": "奇遇",
      "title": "重傷老者",
      "text": "路上，你見到一個渾身是血的老者倒在路邊。",
      "speaker": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyAc": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "event_explore_mock",
          "order": 1,
          "text": "上前救人",
          "desc": "",
          "type": "direct",
          "checkName": "",
          "attr": "",
          "dc": "",
          "tags": "",
          "successNarrative": "",
          "successEffects": "",
          "successNext": "",
          "failNarrative": "",
          "failEffects": "",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "你背起老者，尋找醫館……老者醒後傳授你一招。",
          "directEffects": "hp:-5|addTag:lucky",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "narrative": "你背起老者，尋找醫館……老者醒後傳授你一招。",
          "effects": {
            "hp": -5,
            "addTag": "lucky"
          },
          "next": null
        },
        {
          "eventId": "event_explore_mock",
          "order": 2,
          "text": "轉身離開",
          "desc": "",
          "type": "direct",
          "checkName": "",
          "attr": "",
          "dc": "",
          "tags": "",
          "successNarrative": "",
          "successEffects": "",
          "successNext": "",
          "failNarrative": "",
          "failEffects": "",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "你嘆了口氣，繼續趕路。",
          "directEffects": "",
          "directNext": "",
          "requireTags": [],
          "forbidTags": [],
          "narrative": "你嘆了口氣，繼續趕路。",
          "effects": null,
          "next": null
        }
      ]
    }
  }
};