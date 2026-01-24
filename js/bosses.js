// BOSS數據庫
const bossData = [
  { 
    id: "boss_1", name: "森林之王 · 巨角鹿", lv: 10, hp: 2500, def: 30, 
    atkRange: [25, 45], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "古老鹿角", rewardMana: 3000 
  },
  { 
    id: "boss_mandrake_1", name: "腹黑曼德拉草", lv: 15, hp: 4500, def: 45, 
    atkRange: [35, 60], img: "images/4SqKRuaqPjZlQHLEhZkmBK.jpg", 
    dropMat: "曼德拉葉片", rewardMana: 5000,
    skills: [
      { name: "曼德拉搗蛋", chance: 0.2, power: 1.5, msg: "使用了【曼德拉搗蛋】，造成了大量傷害！" },
      { name: "曼德拉遁地", chance: 0.1, heal: 0.1, msg: "使用了【曼德拉遁地】，回復了大量血量！" }
    ]
  },
  { 
    id: "boss_2", name: "遺蹟守護者", lv: 20, hp: 8000, def: 65, 
    atkRange: [50, 80], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "守護者核心", rewardMana: 8000 
  },
  { 
    id: "boss_3", name: "深淵恐懼 · 納迦", lv: 35, hp: 28000, def: 130, 
    atkRange: [130, 210], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "深淵靈魂", rewardMana: 25000 
  },
  { 
    id: "boss_4", name: "烈焰巨龍 · 阿格尼", lv: 45, hp: 65000, def: 220, 
    atkRange: [250, 400], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "不滅火種", rewardMana: 60000 
  },
  { 
    id: "boss_5", name: "極北霜狼 · 芬里爾", lv: 60, hp: 150000, def: 450, 
    atkRange: [550, 800], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "冰封王冠", rewardMana: 150000 
  },
  { 
    id: "boss_6", name: "天空主宰 · 獅鷲獸", lv: 75, hp: 450000, def: 900, 
    atkRange: [1200, 1800], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "風暴羽翼", rewardMana: 500000 
  },
  { 
    id: "boss_7", name: "墮落神官 · 墨菲斯托", lv: 80, hp: 1200000, def: 2500, 
    atkRange: [3500, 5000], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "墮落碎片", rewardMana: 2000000 
  }, 
  { 
    id: "boss_final_1", name: "埋まるです", lv: 100, hp: 5000000, def: 8000, 
    atkRange: [12000, 18000], img: "images/p1nVQhClPae02nucYwaa4.jpg", 
    dropMat: "神聖遺物", rewardMana: 10000000,
    skills: [
      { name: "懶散光束", chance: 0.2, power: 1.5, msg: "使用了【懶散光束】，造成大量傷害！" },
      { name: "可樂噴射", chance: 0.15, power: 2.5, msg: "瘋狂搖晃可樂瓶後噴射！爆發性傷害！" },
      { name: "深夜零食時間", chance: 0.1, heal: 0.2, msg: "開始吃起零食，回復了 20% 的生命值！" }
    ]
  }
];