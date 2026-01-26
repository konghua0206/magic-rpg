// js/bosses/boss_2.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_2"] = {
    id: "boss_2",
    name: "遺蹟守護者",
    isBoss: true,

    lv: 20,
    hp: 8000,
    maxHp: 8000,
    def: 65,

    atkRange: [50, 80],

    stats: {
      atk: 65,
      def: 65,
      critRate: 2,
      critMulti: 1.5,
      dodgeRate: 1
    },

    ai: {
      aggression: 0.55,
      skillBias: "random",
      phaseAware: false
    },

    phases: [],
    resistances: {},
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "守護者核心",
    rewardMana: 8000
  };
})();
