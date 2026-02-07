// js/bosses/boss_1.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_1"] = {
    id: "boss_1",
    name: "森林之王 · 巨角鹿",
    isBoss: true,

    lv: 10,
    hp: 2500,
    maxHp: 2500,
    def: 30,

    atkRange: [25, 45],

    stats: {
      atk: 35,
      def: 30,
      critRate: 2,
      critMulti: 1.5,
      dodgeRate: 1
    },

    ai: {
      aggression: 0.5,
      skillBias: "random",
      phaseAware: false
    },

    phases: [],
    resistances: {},
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "古老鹿角",
    rewardMana: 3000
  };
})();
