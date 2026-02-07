// js/bosses/boss_7.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_7"] = {
    id: "boss_7",
    name: "墮落神官 · 墨菲斯托",
    isBoss: true,

    lv: 80,
    hp: 1200000,
    maxHp: 1200000,
    def: 2500,

    atkRange: [3500, 5000],

    stats: {
      atk: 4250,
      def: 2500,
      critRate: 8,
      critMulti: 2.2,
      dodgeRate: 4
    },

    ai: {
      aggression: 0.85,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      dark: 70
    },
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "墮落碎片",
    rewardMana: 2000000
  };
})();
