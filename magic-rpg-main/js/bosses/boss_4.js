// js/bosses/boss_4.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_4"] = {
    id: "boss_4",
    name: "烈焰巨龍 · 阿格尼",
    isBoss: true,

    lv: 45,
    hp: 65000,
    maxHp: 65000,
    def: 220,

    atkRange: [250, 400],

    stats: {
      atk: 325,
      def: 220,
      critRate: 4,
      critMulti: 1.8,
      dodgeRate: 2
    },

    ai: {
      aggression: 0.7,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      fire: 50
    },
    state: {},

    skills: [],

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "不滅火種",
    rewardMana: 60000
  };
})();
