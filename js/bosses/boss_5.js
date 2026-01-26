// js/bosses/boss_5.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_5"] = {
    id: "boss_5",
    name: "極北霜狼 · 芬里爾",
    isBoss: true,

    lv: 60,
    hp: 150000,
    maxHp: 150000,
    def: 450,

    atkRange: [550, 800],

    stats: {
      atk: 675,
      def: 450,
      critRate: 5,
      critMulti: 1.9,
      dodgeRate: 3
    },

    ai: {
      aggression: 0.75,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      ice: 60
    },
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "冰封王冠",
    rewardMana: 150000
  };
})();
