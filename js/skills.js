// 技能數據庫
const allSkills = [
  { 
    id: "fireball", 
    name: "火球術", 
    desc: "造成 180% 的火焰傷害", 
    chance: 0.25, 
    cost: 500, 
    cooldown: 5, // 5秒冷卻
    color: "#ff4d4d", 
    glowColor: "rgba(255, 77, 77, 0.8)", 
    icon: "images/skill/icon_skill_huoqiu.png", 
    learnCost: 50000, 
    requireMat: "古老鹿角 x5",
    onEffect: (stats, monster) => {
      const multiplier = 1.8;
      let dmg = Math.max(1, Math.floor((stats.atk * multiplier * stats.atk * multiplier) / (stats.atk * multiplier + monster.def)));
      return { dmg: dmg, log: `釋放火焰造成了 <span style="color:#ff4d4d">${dmg}</span> 傷害！` };
    }
  },
  { 
    id: "heal", 
    name: "治癒術", 
    desc: "回復 20% 已損生命，並提供微量反擊", 
    chance: 0.15, 
    cost: 800, 
    cooldown: 8,
    color: "#2ecc71", 
    glowColor: "rgba(46, 204, 113, 0.8)", 
    icon: "images/skill/icon_skill_zhiliaoshu.png", 
    learnCost: 150000, 
    requireMat: "守護者核心 x5",
    onEffect: (stats, monster) => {
      let healAmt = Math.floor((stats.maxHp - game.currentHp) * 0.2);
      game.currentHp = Math.min(stats.maxHp, game.currentHp + healAmt);
      
      // 【大砍】傷害倍率從 1.0 降至 0.33 (約 1/3)
      const multiplier = 0.33;
      let skillAtk = stats.atk * multiplier;
      let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + monster.def)));
      
      return { dmg: dmg, log: `恢復了 <span style="color:#2ecc71">${healAmt}</span> HP，並反擊造成 ${dmg} 傷害！` };
    }
  },
  { 
    id: "shield", 
    name: "奧術護盾", 
    desc: "造成傷害並展開護盾，4秒內減免 30% 受到的傷害", 
    chance: 0.2, 
    cost: 600, 
    cooldown: 6, 
    color: "#3498db", 
    glowColor: "rgba(52, 152, 219, 0.8)", 
    icon: "images/skill/icon_weapon_skill_quanjinshu.png", 
    learnCost: 500000, 
    requireMat: "深淵靈魂 x5",
    onEffect: (stats, monster) => {
      // 1. 造成 120% 傷害
      let dmg = Math.max(1, Math.floor((stats.atk * 1.2 * stats.atk * 1.2) / (stats.atk * 1.2 + monster.def)));
      
      // 2. 觸發減傷 Buff 邏輯
      // 設定護盾結束時間為「當前時間 + 4秒」
      game.shieldTime = Date.now() + 4000; 
      game.shieldReduce = 0.3; // 30% 減傷
      
      return { dmg: dmg, log: `奧術能量爆發，造成 <span style="color:#3498db">${dmg}</span> 傷害並展開護盾 (4s)！` };
    }
  },
  { 
    id: "quickCut", 
    name: "迅捷閃擊", 
    desc: "極速的一擊，造成 120% 傷害，冷卻極短", 
    chance: 0.4, 
    cost: 200, 
    cooldown: 2, 
    color: "#f1c40f", 
    glowColor: "rgba(241, 196, 15, 0.8)", 
    icon: "images/skill/icon_skill_gongjizitai.png", 
    learnCost: 20000, 
    // 複數小怪素材要求
    requireMat: "狼皮 x50, 羽毛 x50", 
    onEffect: (stats, monster) => {
      let dmg = Math.max(1, Math.floor((stats.atk * 1.2 * stats.atk * 1.2) / (stats.atk * 1.2 + monster.def)));
      return { dmg: dmg, log: `發動閃擊，造成了 <span style="color:#f1c40f">${dmg}</span> 傷害！` };
    }
  },
  { 
    id: "doubleStrike", 
    name: "二連斬", 
    desc: "快速揮砍兩次，每次造成 80% 傷害", 
    chance: 0.25, 
    cost: 450, 
    cooldown: 4,
    color: "#e67e22", 
    glowColor: "rgba(230, 126, 34, 0.8)", 
    icon: "images/skill/icon_skill_maishalianji.png",
    learnCost: 45000, 
    requireMat: "鏽蝕齒輪 x80, 殘破書頁 x30",
    onEffect: (stats, monster) => {
      let singleDmg = Math.max(1, Math.floor((stats.atk * 0.8 * stats.atk * 0.8) / (stats.atk * 0.8 + monster.def)));
      let totalDmg = singleDmg * 2;
      return { dmg: totalDmg, log: `施展連擊！造成 <span style="color:#e67e22">${singleDmg} x 2</span> 點傷害！` };
    }
  },
  { 
    id: "bloodSuck", 
    name: "嗜血詛咒", 
    desc: "造成 120% 傷害並將 100% 轉化為自身生命", // 描述更新
    chance: 0.2, 
    cost: 1000, 
    cooldown: 7,
    color: "#9b59b6", 
    glowColor: "rgba(155, 89, 182, 0.8)", 
    icon: "images/skill/icon_skill_stone_divinityskill03.png",
    learnCost: 120000, 
    requireMat: "靈魂精華 x100, 黏液 x150",
    onEffect: (stats, monster) => {
      let dmg = Math.max(1, Math.floor((stats.atk * 1.2 * stats.atk * 1.2) / (stats.atk * 1.2 + monster.def)));
      // 【強化】回血量從 0.5 提升至 1.0 (100% 傷害轉化)
      let healAmt = Math.floor(dmg * 1.0); 
      game.currentHp = Math.min(stats.maxHp, game.currentHp + healAmt);
      return { dmg: dmg, log: `吸取了 <span style="color:#2ecc71">${healAmt}</span> 生命並造成 <span style="color:#9b59b6">${dmg}</span> 傷害！` };
    }
  },
  { 
    id: "earthSmash", 
    name: "大地重擊", 
    desc: "粉碎地面，造成 200% 的沉重傷害", 
    chance: 0.15, 
    cost: 1200, 
    cooldown: 10,
    color: "#795548", 
    glowColor: "rgba(121, 85, 72, 0.8)", 
    icon: "images/skill/icon_skill_zhudingdehuimie.png",
    learnCost: 80000, 
    requireMat: "岩石核心 x50, 古老原木 x100",
    onEffect: (stats, monster) => {
      let dmg = Math.max(1, Math.floor((stats.atk * 2.0 * stats.atk * 2.0) / (stats.atk * 2.0 + monster.def)));
      return { dmg: dmg, log: `大地在震動！造成了 <span style="color:#795548">${dmg}</span> 毀滅傷害！` };
    }
  }
];