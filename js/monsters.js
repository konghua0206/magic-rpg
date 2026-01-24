// 區域怪物數據庫
const regions = {
  "新手森林": {
    minLv: 1,
    monsters: [
      { name: "史萊姆", lv: 3, hp: 200, def: 1, atkRange: [3, 6], dropMat: "黏液" },
      { name: "森林灰狼", lv: 5, hp: 450, def: 3, atkRange: [6, 12], dropMat: "狼皮" },
      { name: "憤怒小鳥", lv: 7, hp: 600, def: 5, atkRange: [10, 15], dropMat: "羽毛" },
      { name: "森林守護者", lv: 10, hp: 1000, def: 10, atkRange: [15, 25], dropMat: "古老原木" }
    ]
  },
  "墮落遺蹟": {
    minLv: 10,
    monsters: [
      { name: "墮落學徒", lv: 12, hp: 1500, def: 15, atkRange: [25, 40], dropMat: "殘破書頁" },
      { name: "石像鬼", lv: 15, hp: 2500, def: 30, atkRange: [35, 55], dropMat: "岩石核心" },
      { name: "遺蹟守衛", lv: 18, hp: 3500, def: 45, atkRange: [50, 75], dropMat: "鏽蝕齒輪" },
      { name: "幽靈法師", lv: 22, hp: 4200, def: 35, atkRange: [80, 110], dropMat: "靈魂精華" }
    ]
  },
  "幽影深淵": {
    minLv: 25,
    monsters: [
      { name: "幽影蛛", lv: 25, hp: 6000, def: 50, atkRange: [120, 160], dropMat: "劇毒蛛絲" },
      { name: "深淵潛行者", lv: 28, hp: 8000, def: 65, atkRange: [150, 210], dropMat: "黑暗碎片" },
      { name: "小惡魔", lv: 30, hp: 12000, def: 100, atkRange: [180, 250], dropMat: "惡魔之角" },
      { name: "深淵領主", lv: 35, hp: 18000, def: 130, atkRange: [250, 350], dropMat: "領主披風" }
    ]
  },
  "灼熱熔岩區": {
    minLv: 35,
    monsters: [
      { name: "熔岩火精", lv: 38, hp: 25000, def: 160, atkRange: [400, 550], dropMat: "火元素粉末" },
      { name: "地獄犬", lv: 42, hp: 35000, def: 200, atkRange: [500, 700], dropMat: "焦黑皮革" },
      { name: "烈焰巨人", lv: 45, hp: 55000, def: 280, atkRange: [700, 950], dropMat: "熔岩結晶" },
      { name: "熔岩飛龍", lv: 50, hp: 85000, def: 350, atkRange: [1000, 1400], dropMat: "飛龍逆鱗" }
    ]
  },
  "極北凍原": {
    minLv: 50,
    monsters: [
      { name: "冰原雪兔", lv: 52, hp: 100000, def: 400, atkRange: [1500, 2000], dropMat: "純淨白毛" },
      { name: "凍土魔像", lv: 56, hp: 150000, def: 600, atkRange: [2200, 3000], dropMat: "萬年不化冰" },
      { name: "寒霜巨魔", lv: 60, hp: 220000, def: 550, atkRange: [3000, 4200], dropMat: "巨魔之血" },
      { name: "冰霜女妖", lv: 65, hp: 300000, def: 500, atkRange: [4500, 6000], dropMat: "冰晶淚滴" }
    ]
  },
  "天空島嶼": {
    minLv: 65,
    monsters: [
      { name: "雲端獵鷹", lv: 68, hp: 450000, def: 800, atkRange: [7000, 9000], dropMat: "疾風之羽" },
      { name: "雷鳴怪鳥", lv: 72, hp: 600000, def: 950, atkRange: [9000, 12000], dropMat: "帶電之爪" },
      { name: "天空神像", lv: 75, hp: 850000, def: 1500, atkRange: [11000, 15000], dropMat: "神聖之石" },
      { name: "風暴龍王", lv: 80, hp: 1500000, def: 2000, atkRange: [18000, 25000], dropMat: "龍王之冠" }
    ]
  }
};