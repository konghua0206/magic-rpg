// js/bosses/boss_3.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_3"] = {
    id: "boss_3",
    name: "深淵恐懼 · 納迦",
    isBoss: true,

    lv: 35,
    hp: 28000,
    maxHp: 28000,
    def: 130,

    atkRange: [130, 210],

    stats: {
      atk: 170,
      def: 130,
      critRate: 3,
      critMulti: 1.6,
      dodgeRate: 2
    },

    ai: {
      aggression: 0.65,
      skillBias: "random",
      phaseAware: false
    },

    phases: [],
    resistances: {},
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "深淵靈魂",
    rewardMana: 25000
  };
})();
