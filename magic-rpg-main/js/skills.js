// 技能數據庫
const allSkills = [
  {
    id: "fireball",
    name: "火球術",
    chance: 0.25,
    cost: 500,
    cooldown: 5,
    color: "#ff4d4d",
    glowColor: "rgba(255, 77, 77, 0.8)",
    icon: "images/skill/icon_skill_huoqiu.png",
    learnCost: 50000,
    requireMat: "古老鹿角 x5",

    base: { mult: 1.80 },
    upgrade: (lv) => ({
      // 每級 +6% 倍率（你可調）
      mult: 1 + 0.06 * (lv - 1)
    }),
    getParams(lv) {
      const u = this.upgrade(lv);
      return { mult: this.base.mult * u.mult };
    },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `造成 ${Math.round(p.mult * 100)}% 的火焰傷害`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("fireball");
      const mult = allSkills.find(s => s.id === "fireball").getParams(lv).mult;
      const atk = stats.atk * mult;
      const dmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));
      return { dmg, log: `釋放火焰造成了 <span style="color:#ff4d4d">${dmg}</span> 傷害！` };
    }
  },

  {
    id: "heal",
    name: "治癒術",
    chance: 0.15,
    cost: 800,
    cooldown: 8,
    color: "#2ecc71",
    glowColor: "rgba(46, 204, 113, 0.8)",
    icon: "images/skill/icon_skill_zhiliaoshu.png",
    learnCost: 150000,
    requireMat: "守護者核心 x5",

    base: { healLostPct: 0.20, counterMult: 0.33 },
    upgrade: (lv) => ({
      // 每級：治療 +1%（已損血比例），反擊倍率 +2%
      healLostPct: Math.min(0.45, 0.20 + 0.01 * (lv - 1)),
      counterMult: 0.33 * (1 + 0.02 * (lv - 1))
    }),
    getParams(lv) {
      const u = this.upgrade(lv);
      return { healLostPct: u.healLostPct, counterMult: u.counterMult };
    },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `回復 ${fmtPct(p.healLostPct)} 已損生命，並反擊造成 ${Math.round(p.counterMult * 100)}% 傷害`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("heal");
      const p = allSkills.find(s => s.id === "heal").getParams(lv);

      const healAmt = Math.floor((stats.maxHp - game.currentHp) * p.healLostPct);
      game.currentHp = Math.min(stats.maxHp, game.currentHp + healAmt);

      const skillAtk = stats.atk * p.counterMult;
      const dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + monster.def)));

      return { dmg, log: `恢復了 <span style="color:#2ecc71">${healAmt}</span> HP，並反擊造成 ${dmg} 傷害！` };
    }
  },

  {
    id: "shield",
    name: "奧術護盾",
    chance: 0.2,
    cost: 600,
    cooldown: 6,
    color: "#3498db",
    glowColor: "rgba(52, 152, 219, 0.8)",
    icon: "images/skill/icon_weapon_skill_quanjinshu.png",
    learnCost: 500000,
    requireMat: "深淵靈魂 x5",

    base: { hitMult: 1.20, reduce: 0.30, durationMs: 4000 },
    upgrade: (lv) => ({
      // 每級：傷害 +3%，減傷 +1%（上限 55%），持續 +0.2秒（上限 8秒）
      hitMult: 1.20 * (1 + 0.03 * (lv - 1)),
      reduce: Math.min(0.55, 0.30 + 0.01 * (lv - 1)),
      durationMs: Math.min(8000, 4000 + 200 * (lv - 1))
    }),
    getParams(lv) {
      return this.upgrade(lv);
    },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `造成 ${Math.round(p.hitMult * 100)}% 傷害並展開護盾，${(p.durationMs / 1000).toFixed(1)} 秒內減免 ${fmtPct(p.reduce)} 受到的傷害`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("shield");
      const p = allSkills.find(s => s.id === "shield").getParams(lv);

      const atk = stats.atk * p.hitMult;
      const dmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));

      game.shieldTime = Date.now() + p.durationMs;
      game.shieldReduce = p.reduce;

      return { dmg, log: `奧術能量爆發，造成 <span style="color:#3498db">${dmg}</span> 傷害並展開護盾！` };
    }
  },

  {
    id: "quickCut",
    name: "迅捷閃擊",
    chance: 0.4,
    cost: 200,
    cooldown: 2,
    color: "#f1c40f",
    glowColor: "rgba(241, 196, 15, 0.8)",
    icon: "images/skill/icon_skill_gongjizitai.png",
    learnCost: 20000,
    requireMat: "狼皮 x10, 羽毛 x10",

    base: { mult: 1.20 },
    upgrade: (lv) => ({
      // 每級 +4% 倍率
      mult: 1.20 * (1 + 0.04 * (lv - 1))
    }),
    getParams(lv) { return this.upgrade(lv); },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `極速的一擊，造成 ${Math.round(p.mult * 100)}% 傷害，冷卻極短`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("quickCut");
      const p = allSkills.find(s => s.id === "quickCut").getParams(lv);

      const atk = stats.atk * p.mult;
      const dmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));
      return { dmg, log: `發動閃擊，造成了 <span style="color:#f1c40f">${dmg}</span> 傷害！` };
    }
  },

  {
    id: "doubleStrike",
    name: "二連斬",
    chance: 0.25,
    cost: 450,
    cooldown: 4,
    color: "#e67e22",
    glowColor: "rgba(230, 126, 34, 0.8)",
    icon: "images/skill/icon_skill_maishalianji.png",
    learnCost: 45000,
    requireMat: "鏽蝕齒輪 x6, 殘破書頁 x9",

    base: { hitMult: 0.80, hits: 2 },
    upgrade: (lv) => ({
      // 每級：每段 +3% 倍率（hits 不建議亂加，會爆炸）
      hitMult: 0.80 * (1 + 0.03 * (lv - 1)),
      hits: 2
    }),
    getParams(lv) { return this.upgrade(lv); },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `快速揮砍 ${p.hits} 次，每次造成 ${Math.round(p.hitMult * 100)}% 傷害`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("doubleStrike");
      const p = allSkills.find(s => s.id === "doubleStrike").getParams(lv);

      const atk = stats.atk * p.hitMult;
      const singleDmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));
      const totalDmg = singleDmg * p.hits;

      return { dmg: totalDmg, log: `施展連擊！造成 <span style="color:#e67e22">${singleDmg} x ${p.hits}</span> 點傷害！` };
    }
  },

  {
    id: "bloodSuck",
    name: "嗜血詛咒",
    chance: 0.2,
    cost: 1000,
    cooldown: 7,
    color: "#9b59b6",
    glowColor: "rgba(155, 89, 182, 0.8)",
    icon: "images/skill/icon_skill_stone_divinityskill03.png",
    learnCost: 120000,
    requireMat: "靈魂精華 x10, 黏液 x15",

    base: { mult: 1.20, lifeStealPct: 1.00 }, // 100% 吸血
    upgrade: (lv) => ({
      // 每級：傷害 +3%，吸血上限 130%
      mult: 1.20 * (1 + 0.03 * (lv - 1)),
      lifeStealPct: Math.min(1.30, 1.00 + 0.02 * (lv - 1))
    }),
    getParams(lv) { return this.upgrade(lv); },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `造成 ${Math.round(p.mult * 100)}% 傷害並將 ${fmtPct(p.lifeStealPct)} 傷害轉化為自身生命`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("bloodSuck");
      const p = allSkills.find(s => s.id === "bloodSuck").getParams(lv);

      const atk = stats.atk * p.mult;
      const dmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));

      const healAmt = Math.floor(dmg * p.lifeStealPct);
      game.currentHp = Math.min(stats.maxHp, game.currentHp + healAmt);

      return { dmg, log: `吸取了 <span style="color:#2ecc71">${healAmt}</span> 生命並造成 <span style="color:#9b59b6">${dmg}</span> 傷害！` };
    }
  },

  {
    id: "earthSmash",
    name: "大地重擊",
    chance: 0.15,
    cost: 1200,
    cooldown: 10,
    color: "#795548",
    glowColor: "rgba(121, 85, 72, 0.8)",
    icon: "images/skill/icon_skill_zhudingdehuimie.png",
    learnCost: 80000,
    requireMat: "岩石核心 x5, 古老原木 x10",

    base: { mult: 2.00 },
    upgrade: (lv) => ({
      // 每級 +5% 倍率（大招升級幅度可以大一點）
      mult: 2.00 * (1 + 0.05 * (lv - 1))
    }),
    getParams(lv) { return this.upgrade(lv); },
    getDesc(lv) {
      const p = this.getParams(lv);
      return `粉碎地面，造成 ${Math.round(p.mult * 100)}% 的沉重傷害`;
    },

    onEffect: (stats, monster) => {
      const lv = getSkillLevel("earthSmash");
      const p = allSkills.find(s => s.id === "earthSmash").getParams(lv);

      const atk = stats.atk * p.mult;
      const dmg = Math.max(1, Math.floor((atk * atk) / (atk + monster.def)));
      return { dmg, log: `大地在震動！造成了 <span style="color:#795548">${dmg}</span> 毀滅傷害！` };
    }
  }
];
