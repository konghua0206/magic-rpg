// 技能數據庫
const allSkills = [
  { 
    id: "fireball", name: "火球術", desc: "造成 150% 傷害", 
    chance: 0.25, multiplier: 1.5, cost: 500, 
    color: "#ff4d4d", glowColor: "rgba(255, 77, 77, 0.8)", icon: "images/skill/icon_skill_huoqiu.png",
    learnCost: 50000, requireMat: "古老鹿角" 
  },
  { 
    id: "heal", name: "治癒術", desc: "回復 20% 已損生命", 
    chance: 0.15, type: "heal", ratio: 0.2, cost: 800, 
    color: "#2ecc71", glowColor: "rgba(46, 204, 113, 0.8)", icon: "images/skill/icon_skill_zhiliaoshu.png",
    learnCost: 150000, requireMat: "守護者核心" 
  },
  { 
    id: "shield", name: "奧術護盾", desc: "減免 50% 傷害", 
    chance: 0.2, type: "shield", ratio: 0.5, cost: 600, 
    color: "#3498db", glowColor: "rgba(52, 152, 219, 0.8)", icon: "images/skill/icon_weapon_skill_quanjinshu.png",
    learnCost: 500000, requireMat: "深淵靈魂" 
  }
];