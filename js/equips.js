const uniqueItemTemplates = {
  "mandrake_talisman": {
    type: "necklace",
    rarity: 2, // 史詩
    name: "曼德拉的尖叫護身符",
    // 總預算約 48 (隨機史詩為 39.6)
    ranges: {
      hp: [40, 60],    
      vit: [12, 18],   
      med: [12, 16]    
    },
    skills: ["靈魂尖叫"],
    passive: "受攻擊時有機率使敵人防禦下降 10%",
    icon: "images/equip/CHS_it_eq_hayate_acce.png", 
    description: "如果你仔細聽，還能聽到這片葉子發出的細微尖叫聲..."
  },

  "mandrake_talisman_ascended": {
    type: "necklace",
    rarity: 3, // 傳奇
    name: "曼德拉皇的末日鳴響",
    // 總預算約 415 (隨機傳奇為 345.6)
    ranges: {
      hp: [300, 450],  
      str: [80, 100],  
      int: [80, 120],  
      med: [80, 100]   
    },
    skills: ["靈魂尖叫"],    
    passive: "【次元壓制】受攻擊時 15% 機率使敵人防禦下降 25%", 
    icon: "images/equip/CHS_it_eq_hayate_acce.png", 
    description: "這片葉子不再發出尖叫，而是低沉的次元回響，那是萬物終焉的旋律。"
  },

  "umaru_god_slayer": {
    type: "mainHand",
    rarity: 3, // 傳奇
    name: "懶惰者的終焉爆裂",
    // 總預算約 552 (隨機傳奇 Lv.100 為 384 * 1.2 = 460)
    ranges: {
      atk: [520, 550],  
      hp: [350, 400],   
      agi: [120, 150],  
      luk: [90, 110]   
    },
    skills: ["可樂噴射", "深夜零食時間", "懶散光束"], 
    passive: "【廢人領域】受攻擊時 20% 機率恢復生命，並使敵人進入 3 回合的「懶散」狀態 (攻擊力下降 25%)。",
    icon: "images/equip/CHS_it_eq_cri_hammer.png", 
    description: "這把槌子裝滿了閃爍的碳酸液體，揮動時發出清脆的開罐聲，據說只有領悟懶惰真諦的人才能揮動它。"
  },

  "umaru_god_slayer_2": {
    type: "mainHand",
    rarity: 3, // 傳奇
    name: "懶惰者的終焉爆裂·偽",
    ranges: {
      atk: [420, 450],  
      hp: [300, 300],   
      agi: [60, 70],  
      luk: [50, 60]   
    },
    skills: ["深夜零食時間"], 
    passive: "【廢人領域】受攻擊時 20% 機率恢復生命，並使敵人進入 3 回合的「懶散」狀態 (攻擊力下降 25%)。",
    icon: "images/equip/CHS_it_eq_cri_hammer.png", 
    description: "這把槌子裝滿了閃爍的碳酸液體，揮動時發出清脆的開罐聲，據說只有領悟懶惰真諦的人才能揮動它。"
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