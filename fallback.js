const FALLBACK_DATA = {
  "TAGS": {
    "test_origin_tag": {
      "id": "test_origin_tag",
      "name": "測試起源",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "EX"
    },
    "test_skill_tag": {
      "id": "test_skill_tag",
      "name": "測試武學",
      "bonus": 0,
      "category": "skill",
      "visible": true,
      "grade": "EX"
    },
    "test_inner_tag": {
      "id": "test_inner_tag",
      "name": "測試內功",
      "bonus": 0,
      "category": "skill",
      "visible": true,
      "grade": "EX"
    },
    "origin_martial_family": {
      "id": "origin_martial_family",
      "name": "武學世家",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "origin_merchant": {
      "id": "origin_merchant",
      "name": "商賈之家",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "origin_orphan": {
      "id": "origin_orphan",
      "name": "市井孤兒",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "origin_mediocre": {
      "id": "origin_mediocre",
      "name": "平庸凡人",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "origin_entered_sect": {
      "id": "origin_entered_sect",
      "name": "已入門派",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "origin_unmarried": {
      "id": "origin_unmarried",
      "name": "慘被退婚",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "sect_shaolin": {
      "id": "sect_shaolin",
      "name": "少林弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "grade": "D"
    },
    "sect_wudang": {
      "id": "sect_wudang",
      "name": "武當弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "grade": "D"
    },
    "sect_emei": {
      "id": "sect_emei",
      "name": "峨嵋弟子",
      "bonus": 0,
      "category": "sect",
      "visible": true,
      "grade": "D"
    },
    "gender_male": {
      "id": "gender_male",
      "name": "男",
      "bonus": 0,
      "category": "gender",
      "visible": false,
      "grade": ""
    },
    "gender_female": {
      "id": "gender_female",
      "name": "女",
      "bonus": 0,
      "category": "gender",
      "visible": false,
      "grade": ""
    },
    "sword_master": {
      "id": "sword_master",
      "name": "劍法精通",
      "bonus": 3,
      "category": "skill",
      "visible": true,
      "grade": "C"
    },
    "inner_power": {
      "id": "inner_power",
      "name": "內功深厚",
      "bonus": 3,
      "category": "skill",
      "visible": true,
      "grade": "D"
    },
    "iron_body": {
      "id": "iron_body",
      "name": "鐵骨銅身",
      "bonus": 2,
      "category": "skill",
      "visible": true,
      "grade": "D"
    },
    "sharp_eye": {
      "id": "sharp_eye",
      "name": "洞若觀火",
      "bonus": 2,
      "category": "skill",
      "visible": true,
      "grade": "D"
    },
    "righteous": {
      "id": "righteous",
      "name": "名門正派",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "grade": "D"
    },
    "evil": {
      "id": "evil",
      "name": "邪派",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "grade": "D"
    },
    "lucky": {
      "id": "lucky",
      "name": "福星高照",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "grade": "D"
    },
    "vengeful": {
      "id": "vengeful",
      "name": "復仇心切",
      "bonus": 2,
      "category": "alignment",
      "visible": true,
      "grade": "D"
    },
    "tag_martial_bloodline": {
      "id": "tag_martial_bloodline",
      "name": "世家血脈",
      "bonus": 0,
      "category": "origin",
      "visible": true,
      "grade": "D"
    },
    "tag_heirloom_secret": {
      "id": "tag_heirloom_secret",
      "name": "祠堂秘辛",
      "bonus": 0,
      "category": "hidden",
      "visible": false,
      "grade": "C"
    },
    "tag_ex_jiuyang": {
      "id": "tag_ex_jiuyang",
      "name": "九陽神功",
      "bonus": 0,
      "category": "skill",
      "visible": true,
      "grade": "EX"
    }
  },
  "ORIGINS": {
    "test": {
      "id": "test",
      "name": "測試出身",
      "desc": "測試中...",
      "intro": "測試中...",
      "gold": 9999,
      "str": 5,
      "dex": 5,
      "con": 5,
      "int": 5,
      "wis": 5,
      "cha": 5,
      "initialMorality": 50,
      "initialMartialArts": [
        "ex_test",
        "ex_test2",
        "c_basic_sword"
      ],
      "initialTags": [
        "test_origin_tag"
      ],
      "special": null,
      "baseStats": {
        "str": 5,
        "dex": 5,
        "con": 5,
        "int": 5,
        "wis": 5,
        "cha": 5
      }
    },
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
      "initialMorality": "",
      "initialMartialArts": [
        "c_basic_sword"
      ],
      "initialTags": [
        "tag_martial_bloodline"
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
      "initialMorality": "",
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
      "initialMorality": "",
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
      "initialMorality": "",
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
      "initialMorality": "",
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
      "initialMorality": "",
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
    "ex_test": {
      "id": "ex_test",
      "name": "測試武學",
      "grade": "EX",
      "type": "拳法",
      "slot": "attack",
      "basePower": 50,
      "diceType": 6,
      "hits": "",
      "learnDC": 30,
      "growthRate": 5,
      "desc": "測試武學",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "test_skill_tag",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": 5
    },
    "ex_test2": {
      "id": "ex_test2",
      "name": "測試內功",
      "grade": "EX",
      "type": "內功",
      "slot": "inner",
      "basePower": 100,
      "diceType": "",
      "hits": "",
      "learnDC": 30,
      "growthRate": 5,
      "desc": "測試內功",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "test_inner_tag",
      "innerEffect": "maxHp:-10|maxPos:30|regen:3",
      "useAttr": "",
      "qiCost": ""
    },
    "ex_jiuyang": {
      "id": "ex_jiuyang",
      "name": "九陽神功",
      "grade": "EX",
      "type": "內功",
      "slot": "inner",
      "basePower": 100,
      "diceType": "",
      "hits": "",
      "learnDC": 30,
      "growthRate": 5,
      "desc": "至陽至剛，天下無敵",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "tag_ex_jiuyang",
      "innerEffect": "regen:5|qi_regen:1",
      "useAttr": "",
      "qiCost": ""
    },
    "s_dugu": {
      "id": "s_dugu",
      "name": "獨孤九劍",
      "grade": "S",
      "type": "劍法",
      "slot": "attack",
      "basePower": 30,
      "diceType": 6,
      "hits": 3,
      "learnDC": 25,
      "growthRate": 4,
      "desc": "以無招勝有招",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "str",
      "qiCost": ""
    },
    "a_taiji": {
      "id": "a_taiji",
      "name": "太極拳",
      "grade": "A",
      "type": "拳法",
      "slot": "attack",
      "basePower": 70,
      "diceType": "",
      "hits": "",
      "learnDC": 20,
      "growthRate": 3,
      "desc": "以柔克剛，四兩撥千斤",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "b_emei_sword": {
      "id": "b_emei_sword",
      "name": "峨嵋劍法",
      "grade": "B",
      "type": "劍法",
      "slot": "attack",
      "basePower": 55,
      "diceType": "",
      "hits": "",
      "learnDC": 15,
      "growthRate": 2,
      "desc": "峨嵋入門劍法，重意不重招",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "c_basic_sword": {
      "id": "c_basic_sword",
      "name": "基礎劍法",
      "grade": "C",
      "type": "劍法",
      "slot": "attack",
      "basePower": "",
      "diceType": "",
      "hits": "",
      "learnDC": 10,
      "growthRate": 1,
      "desc": "江湖人人會使的入門劍法",
      "specialEffect": "poison:2:5",
      "fixedDamage": 15,
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "c_wudang_sword": {
      "id": "c_wudang_sword",
      "name": "武當劍法",
      "grade": "C",
      "type": "劍法",
      "slot": "attack",
      "basePower": 32,
      "diceType": "",
      "hits": "",
      "learnDC": 11,
      "growthRate": 1.2,
      "desc": "武當入門劍法，以柔馭剛",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "c_emei_palm": {
      "id": "c_emei_palm",
      "name": "峨嵋掌法",
      "grade": "C",
      "type": "拳法",
      "slot": "attack",
      "basePower": 28,
      "diceType": "",
      "hits": "",
      "learnDC": 10,
      "growthRate": 1,
      "desc": "峨嵋入門掌法，輕靈飄逸",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "d_shaolin_fist": {
      "id": "d_shaolin_fist",
      "name": "羅漢拳",
      "grade": "D",
      "type": "拳法",
      "slot": "attack",
      "basePower": 20,
      "diceType": "",
      "hits": "",
      "learnDC": 8,
      "growthRate": 1,
      "desc": "少林入門拳法，剛猛紮實",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "d_luohan": {
      "id": "d_luohan",
      "name": "羅漢伏虎",
      "grade": "D",
      "type": "拳法",
      "slot": "attack",
      "basePower": 22,
      "diceType": "",
      "hits": "",
      "learnDC": 8,
      "growthRate": 1,
      "desc": "少林進階拳法",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "e_money_talk": {
      "id": "e_money_talk",
      "name": "商道",
      "grade": "E",
      "type": "特殊",
      "slot": "utility",
      "basePower": 10,
      "diceType": "",
      "hits": "",
      "learnDC": 5,
      "growthRate": 0.5,
      "desc": "討價還價的江湖技藝",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "e_street_fist": {
      "id": "e_street_fist",
      "name": "街頭把式",
      "grade": "E",
      "type": "拳法",
      "slot": "attack",
      "basePower": 10,
      "diceType": "",
      "hits": "",
      "learnDC": 5,
      "growthRate": 0.5,
      "desc": "打架用的下三濫招",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
    },
    "b_canyang_sword": {
      "id": "b_canyang_sword",
      "name": "殘陽劍法",
      "grade": "B",
      "type": "劍法",
      "slot": "attack",
      "basePower": 45,
      "diceType": 6,
      "hits": 2,
      "learnDC": 14,
      "growthRate": 1.8,
      "desc": "祖上流傳下來的殘缺劍法，劍勢如泣如訴，狠辣異常。",
      "specialEffect": "",
      "fixedDamage": "",
      "grantTags": "",
      "innerEffect": "",
      "useAttr": "",
      "qiCost": ""
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
      "attackEffect": "poison"
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
      "attackEffect": ""
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
      "attackEffect": ""
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
  "EVENTS": {
    "dummy": {
      "id": "dummy",
      "type": "combat",
      "uiType": "",
      "badge": "測試戰",
      "title": "打不死的小人",
      "text": "你好",
      "speaker": "小人",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "小人",
      "enemyHp": 999,
      "enemyPos": 999,
      "enemyQi": 999,
      "enemyAc": 5,
      "enemyArts": "c_basic_sword",
      "enemyInner": "ex_jiuyang",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "enemy": {
        "name": "小人",
        "hp": 999,
        "maxHp": 999,
        "pos": 999,
        "maxPos": 999,
        "ac": 5,
        "isStunned": false,
        "isPoisoned": 0
      }
    },
    "act1_inn": {
      "id": "act1_inn",
      "type": "normal",
      "uiType": "modal",
      "badge": "第壹章 · 客棧風雲",
      "title": "風雨欲來 · 黑風寨索命門",
      "text": "暴雨如注，你身披斗笠邁入官道旁的「悅來客棧」。三名手持鬼頭環刀的黑風寨惡煞正在腳踹櫃檯。",
      "speaker": "",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
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
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
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
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "act1_inn",
          "order": 2,
          "text": "拔劍相向",
          "desc": "不發一語，直接出鞘。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
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
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
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
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
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
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
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
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "act2_forest",
          "order": 2,
          "text": "拆解機關",
          "desc": "以悟性破陣。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
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
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
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
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "「狂刀」厲煞",
      "enemyHp": 48,
      "enemyPos": 24,
      "enemyQi": "",
      "enemyAc": 13,
      "enemyArts": "c_basic_sword",
      "enemyInner": "",
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
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
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
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
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
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "defeat",
      "onDefeat": "",
      "endingVariant": ""
    },
    "event_tavern_mock": {
      "id": "event_tavern_mock",
      "type": "normal",
      "uiType": "tavern",
      "badge": "酒館",
      "title": "消息靈通",
      "text": "你在酒館聽到有人談論黑風寨的惡行。",
      "speaker": "",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": ""
    },
    "event_explore_mock": {
      "id": "event_explore_mock",
      "type": "normal",
      "uiType": "",
      "badge": "奇遇",
      "title": "重傷老者",
      "text": "路上，你見到一個渾身是血的老者倒在路邊。",
      "speaker": "",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": "",
      "weight": "",
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
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
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
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
          "requireTags": [],
          "forbidTags": [],
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
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你嘆了口氣，繼續趕路。",
          "effects": null,
          "next": null
        }
      ]
    },
    "lp13_martial": {
      "id": "lp13_martial",
      "type": "normal",
      "uiType": "",
      "badge": "世家歲月",
      "title": "祠堂受罰",
      "text": "你因練功偷懶，被父親罰跪祖祠。深夜，你發現膝下的青磚似乎有些鬆動，裡面隱隱透出一股寒氣...",
      "speaker": "旁白",
      "age": 13,
      "requireTags": "origin_martial_family",
      "forbidTags": "",
      "priority": 10,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp13_martial",
          "order": 1,
          "text": "撬開青磚",
          "desc": "好奇心驅使你一探究竟。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 11,
          "tags": "tag_martial_bloodline",
          "successNarrative": "你在暗格中發現了沾著黑血的布帛，記錄了幾式殘缺劍法！",
          "successEffects": "addTag:tag_heirloom_secret|int:1",
          "successNext": "",
          "failNarrative": "你不慎觸發了暗格裡的毒針，頭暈目眩，一無所獲。",
          "failEffects": "hp:-5|con:-1",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你在暗格中發現了沾著黑血的布帛，記錄了幾式殘缺劍法！",
            "effects": {
              "addTag": "tag_heirloom_secret",
              "int": 1
            },
            "next": null
          },
          "fail": {
            "narrative": "你不慎觸發了暗格裡的毒針，頭暈目眩，一無所獲。",
            "effects": {
              "hp": -5,
              "con": -1
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp13_martial",
          "order": 2,
          "text": "叩首思過",
          "desc": "專心認錯，穩固心境。",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你閉目養神，氣血漸趨平穩，心境澄明。",
          "directEffects": "con:1|wis:1",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你閉目養神，氣血漸趨平穩，心境澄明。",
          "effects": {
            "con": 1,
            "wis": 1
          },
          "next": null
        }
      ]
    },
    "lp14_martial": {
      "id": "lp14_martial",
      "type": "normal",
      "uiType": "",
      "badge": "世家歲月",
      "title": "家族大考",
      "text": "一年一度的族會大考上，平素跋扈的堂兄在擂台上公然挑釁你：「廢物，今天就讓你知道什麼叫真正的家傳武學！」",
      "speaker": "堂兄",
      "age": 14,
      "requireTags": "origin_martial_family",
      "forbidTags": "",
      "priority": 10,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp14_martial",
          "order": 1,
          "text": "正面迎戰",
          "desc": "以家傳武學硬碰硬。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "臂力檢定",
          "attr": "str",
          "dc": 12,
          "tags": "tag_martial_bloodline",
          "successNarrative": "雙拳相交，你成功將堂兄震退三步，驚艷四座！",
          "successEffects": "str:1|cha:1",
          "successNext": "",
          "failNarrative": "你力不如人，被堂兄一拳打得吐血，淪為笑柄。",
          "failEffects": "hp:-5|cha:-1",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "雙拳相交，你成功將堂兄震退三步，驚艷四座！",
            "effects": {
              "str": 1,
              "cha": 1
            },
            "next": null
          },
          "fail": {
            "narrative": "你力不如人，被堂兄一拳打得吐血，淪為笑柄。",
            "effects": {
              "hp": -5,
              "cha": -1
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp14_martial",
          "order": 2,
          "text": "暗施秘辛",
          "desc": "運用祠堂領悟的殘招反擊。",
          "type": "check",
          "requireTags": [
            "tag_heirloom_secret"
          ],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 10,
          "tags": "",
          "successNarrative": "你身形一變，一招便點中堂兄死穴，全場鴉雀無聲！",
          "successEffects": "int:1|cha:2",
          "successNext": "",
          "failNarrative": "你火候未到，招式變形，反而破綻百出。",
          "failEffects": "hp:-3|dex:-1",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你身形一變，一招便點中堂兄死穴，全場鴉雀無聲！",
            "effects": {
              "int": 1,
              "cha": 2
            },
            "next": null
          },
          "fail": {
            "narrative": "你火候未到，招式變形，反而破綻百出。",
            "effects": {
              "hp": -3,
              "dex": -1
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        }
      ]
    },
    "lp15_martial": {
      "id": "lp15_martial",
      "type": "normal",
      "uiType": "",
      "badge": "滅門之禍",
      "title": "世仇叩門",
      "text": "狂風呼嘯，大門被轟然撞碎！昔日仇家「斷魂刀」一脈殺上門來，一名蒙面刀客提著滴血的長刀，直撲你而來！",
      "speaker": "旁白",
      "age": 15,
      "requireTags": "origin_martial_family",
      "forbidTags": "",
      "priority": 10,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp15_martial",
          "order": 1,
          "text": "護衛家主",
          "desc": "拼死擋住刀客，保護父親。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "根骨檢定",
          "attr": "con",
          "dc": 14,
          "tags": "tag_martial_bloodline",
          "successNarrative": "你身中兩刀，硬撐著一口氣將刀客逼退，救下父親！",
          "successEffects": "con:2|hp:-10|cha:2",
          "successNext": "",
          "failNarrative": "你被刀客一腳踹飛，重傷嘔血，家族損失慘重。",
          "failEffects": "con:-1|hp:-15",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你身中兩刀，硬撐著一口氣將刀客逼退，救下父親！",
            "effects": {
              "con": 2,
              "hp": -10,
              "cha": 2
            },
            "next": null
          },
          "fail": {
            "narrative": "你被刀客一腳踹飛，重傷嘔血，家族損失慘重。",
            "effects": {
              "con": -1,
              "hp": -15
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp15_martial",
          "order": 2,
          "text": "祭出絕學",
          "desc": "領悟布帛真意，絕地反擊！",
          "type": "check",
          "requireTags": [
            "tag_heirloom_secret"
          ],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 13,
          "tags": "sword_master",
          "successNarrative": "生死之間，你腦中靈光閃現，以指代劍，竟刺穿了刀客咽喉！",
          "successEffects": "addMartialArt:b_canyang_sword|wis:2|cha:2",
          "successNext": "",
          "failNarrative": "劍招未老，已被對方看破，你胸口中刀，險些喪命！",
          "failEffects": "hp:-20",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "生死之間，你腦中靈光閃現，以指代劍，竟刺穿了刀客咽喉！",
            "effects": {
              "addMartialArt": "b_canyang_sword",
              "wis": 2,
              "cha": 2
            },
            "next": null
          },
          "fail": {
            "narrative": "劍招未老，已被對方看破，你胸口中刀，險些喪命！",
            "effects": {
              "hp": -20
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp15_martial",
          "order": 3,
          "text": "轉身逃跑",
          "desc": "留得青山在，不怕沒柴燒。",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你趁亂翻牆逃走。回頭望去，百年世家已化為一片火海……",
          "directEffects": "cha:-3",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你趁亂翻牆逃走。回頭望去，百年世家已化為一片火海……",
          "effects": {
            "cha": -3
          },
          "next": null
        }
      ]
    },
    "lp16_martial_start": {
      "id": "lp16_martial_start",
      "type": "normal",
      "uiType": "",
      "badge": "劫後餘波",
      "title": "劫後餘波",
      "text": "距離滅門之劫已過一年，長鯨幫派人送來拜帖。幫主名為切磋，實則想趁火打劫，吞併你家殘存的產業。你要如何應對？",
      "speaker": "旁白",
      "age": 16,
      "requireTags": "origin_martial_family",
      "forbidTags": "",
      "priority": 10,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp16_martial_start",
          "order": 1,
          "text": "設下擂台",
          "desc": "既然要打，就光明正大地打！",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你接下拜帖，命人在城西搭起擂台。",
          "directEffects": "",
          "directNext": "lp16_martial_brawl",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你接下拜帖，命人在城西搭起擂台。",
          "effects": null,
          "next": "lp16_martial_brawl"
        },
        {
          "eventId": "lp16_martial_start",
          "order": 2,
          "text": "擺下酒席",
          "desc": "先探探對方的虛實再說。",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你揚起笑臉，將長鯨幫一行人迎入大堂。",
          "directEffects": "",
          "directNext": "lp16_martial_banquet",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你揚起笑臉，將長鯨幫一行人迎入大堂。",
          "effects": null,
          "next": "lp16_martial_banquet"
        }
      ]
    },
    "lp16_martial_brawl": {
      "id": "lp16_martial_brawl",
      "type": "normal",
      "uiType": "",
      "badge": "劫後餘波",
      "title": "擂台血戰",
      "text": "你選擇以武立威，在城中心擺下擂台。長鯨幫派出了一名鐵塔般的橫練高手，滿臉獰笑地登上擂台。",
      "speaker": "旁白",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": 0,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp16_martial_brawl",
          "order": 1,
          "text": "硬碰硬",
          "desc": "以家傳武學正面硬撼對方！",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "臂力檢定",
          "attr": "str",
          "dc": 14,
          "tags": "tag_martial_bloodline",
          "successNarrative": "你雙臂青筋暴起，一拳將鐵塔大漢轟下擂台，全城震動！",
          "successEffects": "str:2|cha:3",
          "successNext": "",
          "failNarrative": "你力量不及對方，被一記重拳打斷肋骨，重傷倒地。",
          "failEffects": "hp:-15|cha:-2",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你雙臂青筋暴起，一拳將鐵塔大漢轟下擂台，全城震動！",
            "effects": {
              "str": 2,
              "cha": 3
            },
            "next": null
          },
          "fail": {
            "narrative": "你力量不及對方，被一記重拳打斷肋骨，重傷倒地。",
            "effects": {
              "hp": -15,
              "cha": -2
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp16_martial_brawl",
          "order": 2,
          "text": "殘陽出鞘",
          "desc": "使用祠堂領悟的殺招。",
          "type": "check",
          "requireTags": [
            "tag_heirloom_secret"
          ],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 12,
          "tags": "sword_master",
          "successNarrative": "劍光如血，一瞬封喉！對手甚至沒看清你是如何出劍的。",
          "successEffects": "int:2|cha:4|wis:1",
          "successNext": "",
          "failNarrative": "你招式未熟，強行出劍導致真氣逆流，當場嘔血。",
          "failEffects": "hp:-10|con:-2",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "劍光如血，一瞬封喉！對手甚至沒看清你是如何出劍的。",
            "effects": {
              "int": 2,
              "cha": 4,
              "wis": 1
            },
            "next": null
          },
          "fail": {
            "narrative": "你招式未熟，強行出劍導致真氣逆流，當場嘔血。",
            "effects": {
              "hp": -10,
              "con": -2
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        }
      ]
    },
    "lp16_martial_banquet": {
      "id": "lp16_martial_banquet",
      "type": "normal",
      "uiType": "",
      "badge": "劫後餘波",
      "title": "鴻門赴宴",
      "text": "你選擇設宴款待。酒過三巡，長鯨幫主舉起一杯酒遞給你，眼中閃過一絲陰狠：「喝了這杯，以後兩家就是兄弟。」",
      "speaker": "旁白",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": 0,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp16_martial_banquet",
          "order": 1,
          "text": "察言觀色",
          "desc": "觀察酒中是否有詐。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 13,
          "tags": "sharp_eye",
          "successNarrative": "你敏銳察覺酒色微變，故意失手打翻酒杯，藉機發作反將一軍！",
          "successEffects": "int:2|gold:200",
          "successNext": "",
          "failNarrative": "你毫無防備飲下毒酒，腹如刀絞，被迫簽下割讓產業的字據。",
          "failEffects": "hp:-20|con:-2|gold:-300",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你敏銳察覺酒色微變，故意失手打翻酒杯，藉機發作反將一軍！",
            "effects": {
              "int": 2,
              "gold": 200
            },
            "next": null
          },
          "fail": {
            "narrative": "你毫無防備飲下毒酒，腹如刀絞，被迫簽下割讓產業的字據。",
            "effects": {
              "hp": -20,
              "con": -2,
              "gold": -300
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp16_martial_banquet",
          "order": 2,
          "text": "隱忍周旋",
          "desc": "裝傻充愣，避開鋒芒。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "心法檢定",
          "attr": "wis",
          "dc": 12,
          "tags": "tag_martial_bloodline",
          "successNarrative": "你滴水不漏地與對方周旋，成功拖延了時間，保住家業。",
          "successEffects": "wis:2|cha:1",
          "successNext": "",
          "failNarrative": "對方步步緊逼，你應對失措，被對方氣勢完全壓倒。",
          "failEffects": "wis:-2|cha:-2",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你滴水不漏地與對方周旋，成功拖延了時間，保住家業。",
            "effects": {
              "wis": 2,
              "cha": 1
            },
            "next": null
          },
          "fail": {
            "narrative": "對方步步緊逼，你應對失措，被對方氣勢完全壓倒。",
            "effects": {
              "wis": -2,
              "cha": -2
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        }
      ]
    },
    "lp17_martial_start": {
      "id": "lp17_martial_start",
      "type": "normal",
      "uiType": "",
      "badge": "斷魂遺蹤",
      "title": "斷魂遺蹤",
      "text": "線人來報，當年參與襲擊你家的「斷魂刀」餘孽，藏身在城外廢棄古廟。古廟地勢險要，守衛森嚴。你打算如何行動？",
      "speaker": "旁白",
      "age": 17,
      "requireTags": "origin_martial_family",
      "forbidTags": "",
      "priority": 10,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp17_martial_start",
          "order": 1,
          "text": "趁夜潛伏",
          "desc": "從屋頂潛伏，逐一暗殺。",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你換上夜行衣，消失在無邊的夜色中。",
          "directEffects": "",
          "directNext": "lp17_martial_stealth",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你換上夜行衣，消失在無邊的夜色中。",
          "effects": null,
          "next": "lp17_martial_stealth"
        },
        {
          "eventId": "lp17_martial_start",
          "order": 2,
          "text": "正面強攻",
          "desc": "踹門而入，殺他個片甲不留！",
          "type": "direct",
          "requireTags": [],
          "forbidTags": [],
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
          "directNarrative": "你提起兵刃，大步流星走向古廟正門。",
          "directEffects": "",
          "directNext": "lp17_martial_assault",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "narrative": "你提起兵刃，大步流星走向古廟正門。",
          "effects": null,
          "next": "lp17_martial_assault"
        }
      ]
    },
    "lp17_martial_stealth": {
      "id": "lp17_martial_stealth",
      "type": "normal",
      "uiType": "",
      "badge": "斷魂遺蹤",
      "title": "古廟暗影",
      "text": "你趁著夜色翻過院牆，猶如一隻狸貓。前方大殿內，幾名山賊正在打瞌睡，而頭目似乎在內堂對帳。",
      "speaker": "旁白",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": 0,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp17_martial_stealth",
          "order": 1,
          "text": "盜取密信",
          "desc": "不戀戰，偷走頭目的帳本。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "身法檢定",
          "attr": "dex",
          "dc": 14,
          "tags": "sharp_eye",
          "successNarrative": "你悄無聲息摸走密信，赫然發現這群人背後還有黑手！",
          "successEffects": "dex:2|int:2|addTag:sharp_eye",
          "successNext": "",
          "failNarrative": "你不慎踢翻燭台驚醒賊眾，背部中刀狼狽逃竄。",
          "failEffects": "hp:-15|dex:-1",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你悄無聲息摸走密信，赫然發現這群人背後還有黑手！",
            "effects": {
              "dex": 2,
              "int": 2,
              "addTag": "sharp_eye"
            },
            "next": null
          },
          "fail": {
            "narrative": "你不慎踢翻燭台驚醒賊眾，背部中刀狼狽逃竄。",
            "effects": {
              "hp": -15,
              "dex": -1
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp17_martial_stealth",
          "order": 2,
          "text": "暗殺頭目",
          "desc": "擒賊先擒王，一擊必殺。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "悟性檢定",
          "attr": "int",
          "dc": 13,
          "tags": "sword_master",
          "successNarrative": "你精準找到對方真氣運行的破綻，一劍刺穿了頭目的心臟。",
          "successEffects": "int:2|cha:2|gold:150",
          "successNext": "",
          "failNarrative": "刺殺失敗，頭目驚醒後與你搏命，你負傷撤退。",
          "failEffects": "hp:-12|str:-1",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你精準找到對方真氣運行的破綻，一劍刺穿了頭目的心臟。",
            "effects": {
              "int": 2,
              "cha": 2,
              "gold": 150
            },
            "next": null
          },
          "fail": {
            "narrative": "刺殺失敗，頭目驚醒後與你搏命，你負傷撤退。",
            "effects": {
              "hp": -12,
              "str": -1
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        }
      ]
    },
    "lp17_martial_assault": {
      "id": "lp17_martial_assault",
      "type": "normal",
      "uiType": "",
      "badge": "斷魂遺蹤",
      "title": "破門而入",
      "text": "你一腳踹碎古廟大門，木屑橫飛！十幾名山賊瞬間拔出兵器將你團團包圍。退無可退，唯有一死戰！",
      "speaker": "旁白",
      "age": "",
      "requireTags": "",
      "forbidTags": "",
      "priority": 0,
      "weight": 10,
      "enemyName": "",
      "enemyHp": "",
      "enemyPos": "",
      "enemyQi": "",
      "enemyAc": "",
      "enemyArts": "",
      "enemyInner": "",
      "onVictory": "",
      "onDefeat": "",
      "endingVariant": "",
      "choices": [
        {
          "eventId": "lp17_martial_assault",
          "order": 1,
          "text": "血戰到底",
          "desc": "憑著一腔怒火，殺出一條血路！",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "根骨檢定",
          "attr": "con",
          "dc": 15,
          "tags": "vengeful",
          "successNarrative": "你宛如修羅附體，身中數刀卻越戰越勇，將山賊全數斬殺！",
          "successEffects": "con:3|hp:-10|addTag:vengeful",
          "successNext": "",
          "failNarrative": "雙拳難敵四手，你陷入苦戰，最終因失血過多昏死過去。",
          "failEffects": "hp:-25|con:-2",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你宛如修羅附體，身中數刀卻越戰越勇，將山賊全數斬殺！",
            "effects": {
              "con": 3,
              "hp": -10,
              "addTag": "vengeful"
            },
            "next": null
          },
          "fail": {
            "narrative": "雙拳難敵四手，你陷入苦戰，最終因失血過多昏死過去。",
            "effects": {
              "hp": -25,
              "con": -2
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        },
        {
          "eventId": "lp17_martial_assault",
          "order": 2,
          "text": "威懾賊眾",
          "desc": "亮出世家招牌，瓦解戰意。",
          "type": "check",
          "requireTags": [],
          "forbidTags": [],
          "checkName": "名望檢定",
          "attr": "cha",
          "dc": 14,
          "tags": "tag_martial_bloodline",
          "successNarrative": "你一聲暴喝，強大的氣場讓這群烏合之眾膽寒，紛紛棄械投降。",
          "successEffects": "cha:3|wis:2|gold:100",
          "successNext": "",
          "failNarrative": "賊眾根本不買帳：「什麼破落戶，兄弟們併肩子上！」你慘遭圍毆。",
          "failEffects": "hp:-15|cha:-2",
          "failNext": "",
          "failGameOver": "",
          "directNarrative": "",
          "directEffects": "",
          "directNext": "",
          "critSuccessNarrative": "",
          "critSuccessEffects": "",
          "critSuccessNext": "",
          "critFailNarrative": "",
          "critFailEffects": "",
          "critFailNext": "",
          "success": {
            "narrative": "你一聲暴喝，強大的氣場讓這群烏合之眾膽寒，紛紛棄械投降。",
            "effects": {
              "cha": 3,
              "wis": 2,
              "gold": 100
            },
            "next": null
          },
          "fail": {
            "narrative": "賊眾根本不買帳：「什麼破落戶，兄弟們併肩子上！」你慘遭圍毆。",
            "effects": {
              "hp": -15,
              "cha": -2
            },
            "next": null,
            "failGameOver": false
          },
          "critSuccess": {
            "narrative": "",
            "effects": null,
            "next": null
          },
          "critFail": {
            "narrative": "",
            "effects": null,
            "next": null
          }
        }
      ]
    }
  },
  "VERSION": 1793617261484
};