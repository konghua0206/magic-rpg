// js/bosses/boss_6.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_6"] = {
    id: "boss_6",
    name: "天空主宰 · 獅鷲獸",
    isBoss: true,

    lv: 75,
    hp: 450000,
    maxHp: 450000,
    def: 900,

    atkRange: [1200, 1800],

    stats: {
      atk: 1500,
      def: 900,
      critRate: 6,
      critMulti: 2.0,
      dodgeRate: 4
    },

    ai: {
      aggression: 0.8,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      wind: 50
    },
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "風暴羽翼",
    rewardMana: 500000
  };
})();
