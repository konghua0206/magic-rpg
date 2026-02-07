const exchangeCodesDB = {
  "UMARU_GIFT": {
    name: "懶散神的見面禮",
    cost: { "曼德拉葉片": 10 }, // 消耗背包素材
    reward: { type: "mana", value: 100000 }, // 獲得魔力
    desc: "消耗 10 個曼德拉葉片，換取大量魔力。"
  },
  "GOD_SLAER_BETA": {
    name: "v0.5.0通關恭喜!",
    cost: { "神聖遺物": 1 },
    reward: { type: "uniqueEquip", id: "umaru_god_slayer", lv: 100 },
    desc: "提交 1 個神聖遺物，換取終極武器。"
  },
  "REMEDY_PACK": {
    name: "補給包",
    cost: { "古老鹿角": 5 },
    reward: { type: "mana", value: 5000 },
    desc: "將鹿角加工成魔力補給。"
  }
};