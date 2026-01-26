// js/bosses/boss_final_1.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_final_1"] = {
    id: "boss_final_1",
    name: "埋まるです",
    isBoss: true,

    lv: 100,
    hp: 5000000,
    maxHp: 5000000,
    def: 8000,

    atkRange: [12000, 18000],

    stats: {
      atk: 15000,
      def: 8000,
      critRate: 10,
      critMulti: 2.5,
      dodgeRate: 5
    },

    ai: {
      aggression: 0.9,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      holy: 50
    },
    state: {},

    img: "images/p1nVQhClPae02nucYwaa4.jpg",
    dropMat: "神聖遺物",
    rewardMana: 10000000,

    onDeath: function (currentMonster) {
      let drops = [];

      if (Math.random() < 0.3) {
        const equip = createUniqueItem(
          "umaru_god_slayer_2",
          currentMonster.lv
        );
        if (equip) drops.push(equip);
      }

      if (Math.random() < 0.15) {
        const randomEquip = generateRandomEquip(currentMonster.lv);
        if (randomEquip) {
          if (randomEquip.rarity < 2) randomEquip.rarity = 2;
          drops.push(randomEquip);
        }
      }

      return drops;
    },

    skills: [
      {
        name: "懶散光束",
        chance: 0.2,
        color: "#ff7675",
        onEffect: (mBaseAtk, stats) => {
          const power = 1.5;
          let skillAtk = mBaseAtk * power;
          let dmg = Math.max(
            1,
            Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def))
          );
          return {
            dmg,
            log: `發動<span style="color:#ff7675">【懶散光束】</span>，造成 <span style="color:#ff4d4d">${dmg}</span> 傷害！`
          };
        }
      },
      {
        name: "可樂噴射",
        chance: 0.15,
        color: "#fab1a0",
        onEffect: (mBaseAtk, stats) => {
          const power = 2.5;
          let skillAtk = mBaseAtk * power;
          let dmg = Math.max(
            1,
            Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def))
          );
          return {
            dmg,
            log: `啟動<span style="color:#fab1a0">【可樂噴射】</span>，造成 <span style="color:#ff4d4d">${dmg}</span> 傷害！`
          };
        }
      },
      {
        name: "深夜零食時間",
        chance: 0.1,
        color: "#55efc4",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          let healAmt = Math.floor(currentMonster.hp * 0.2);
          return {
            heal: healAmt,
            log: `進入<span style="color:#55efc4">【深夜零食時間】</span>，回復 <span style="color:#2ecc71">${healAmt.toLocaleString()}</span> HP！`
          };
        }
      }
    ]
  };
})();
