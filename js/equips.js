const uniqueItemTemplates = {
  "mandrake_talisman": {
    type: "necklace",
    rarity: 2, 
    name: "曼德拉的尖叫護身符",
    ranges: {
      hp: [150, 250],
      vit: [10, 15],
      med: [8, 12]
    },
    skills: ["靈魂尖叫"],
    passive: "受攻擊時有機率使敵人防禦下降 10%",
    icon: "images/equip/CHS_it_eq_hayate_acce.png", 
    description: "如果你仔細聽，還能聽到這片葉子發出的細微尖叫聲..."
  },

  "divine_crown": {
    type: "head",
    rarity: 3, // 0:普通, 1:稀有, 2:史詩, 3:傳奇
    name: "諸神的冠冕",
    // 數值浮動範圍 [最小值, 最大值]
    ranges: {
      hp: [300, 450],
      int: [12, 20],
      med: [5, 10]
      // atk, def 等未設定則生成時自動為 0
    },
    // 特殊功能擴充
    skills: ["神聖治癒"], // 裝備附帶的主動技能
    passive: "每回合恢復 2% 魔力", // 裝備被動描述
    icon: "images/equip/divine_crown.png", 
    description: "傳說中眾神集會時所戴的冠冕，散發著微弱的神光。"
  },

  "dragon_slayer_sword": {
    type: "mainHand",
    rarity: 3,
    name: "屠龍大劍",
    ranges: {
      atk: [180, 240],
      str: [15, 25],
      luk: [5, 10]
    },
    skills: ["龍威震懾"],
    passive: "對龍族敵人傷害提升 50%",
    icon: "images/equip/divine_crown.png", 
    description: "劍身由巨龍肋骨打造，對龍族具有致命的殺傷力。"
  },

  "shadow_cloak": {
    type: "top",
    rarity: 2,
    name: "幽影披風",
    ranges: {
      def: [40, 60],
      agi: [20, 35]
    },
    skills: [],
    passive: "增加 10% 閃避率",
    icon: "images/equip/divine_crown.png", 
    description: "由影獸的皮毛編織而成，能讓穿戴者融入陰影之中。"
  }
};