// js/bosses/boss_mandrake_1.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_mandrake_1"] = {
    id: "boss_mandrake_1",
    name: "腹黑曼德拉草",
    isBoss: true,

    lv: 15,
    hp: 4500,
    maxHp: 4500,
    def: 45,

    atkRange: [35, 60],

    stats: {
      atk: 48,
      def: 45,
      critRate: 2,
      critMulti: 1.5,
      dodgeRate: 1
    },

    ai: {
      aggression: 0.6,
      skillBias: "random",
      phaseAware: false
    },

    phases: [],
    resistances: {},
    state: {},

    img: "images/4SqKRuaqPjZlQHLEhZkmBK.jpg",
    dropMat: "曼德拉葉片",
    rewardMana: 5000,

    onDeath: function (currentMonster) {
      let drops = [];

      if (Math.random() < 0.3) {
        const equip = createUniqueItem("mandrake_talisman", currentMonster.lv);
        if (equip) drops.push(equip);
      }

      if (Math.random() < 0.1) {
        const randomEquip = generateRandomEquip(currentMonster.lv);
        if (randomEquip) {
          drops.push(randomEquip);
        }
      }

      return drops;
    },

    skills: [
      {
        name: "曼德拉搗蛋",
        chance: 0.2,
        color: "#e67e22",
        onEffect: (mBaseAtk, stats) => {
          const power = 1.5;
          let skillAtk = mBaseAtk * power;
          let dmg = Math.max(
            1,
            Math.floor((skillAtk * skillAtk) / (skillAtk + (stats.def || 0)))
          );
          return {
            dmg,
            heal: 0,
            log: `使用了<span style="color:#e67e22">【曼德拉搗蛋】</span>，造成 <span style="color:#e74c3c">${dmg}</span> 傷害！`
          };
        }
      },
      {
        name: "曼德拉遁地",
        chance: 0.1,
        color: "#2ecc71",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          let healAmt = Math.floor(currentMonster.maxHp * 0.1);
          return {
            dmg: 0,
            heal: healAmt,
            log: `使用了<span style="color:#2ecc71">【曼德拉遁地】</span>，回復 <span style="color:#2ecc71">${healAmt}</span> HP！`
          };
        }
      }
    ]
  };
})();
