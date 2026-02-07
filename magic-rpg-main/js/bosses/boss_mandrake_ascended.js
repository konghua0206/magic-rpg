// js/bosses/boss_mandrake_ascended.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_mandrake_ascended"] = {
    id: "boss_mandrake_ascended",
    name: "次元歸來 · 腹黑曼德拉皇",
    isBoss: true,

    lv: 90,
    hp: 25000000,
    maxHp: 25000000,
    def: 8500,

    atkRange: [45000, 72000],

    stats: {
      atk: 58500,
      def: 8500,
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
      void: 60,
      poison: 80
    },
    state: {},

    img: "images/4SqKRuaqPjZlQHLEhZkmBK.jpg",
    dropMat: "時空曼德拉根鬚",
    rewardMana: 15000000,

    onDeath: function (currentMonster) {
      let drops = [];

      if (Math.random() < 0.3) {
        const equip = createUniqueItem(
          "mandrake_talisman_ascended",
          currentMonster.lv
        );
        if (equip) drops.push(equip);
      }

      if (Math.random() < 0.15) {
        const randomEquip = generateRandomEquip(currentMonster.lv);
        if (randomEquip) {
          drops.push(randomEquip);
        }
      }

      return drops;
    },

    skills: [
      {
        name: "因果律搗蛋",
        chance: 0.25,
        color: "#9b59b6",
        onEffect: (mBaseAtk, stats) => {
          const power = 3.0;
          let skillAtk = mBaseAtk * power;
          let baseDmg = Math.max(
            1,
            Math.floor((skillAtk * skillAtk) / (skillAtk + (stats.def || 0)))
          );
          let piercingDmg = Math.floor(skillAtk * 0.2);
          let totalDmg = baseDmg + piercingDmg;

          return {
            dmg: totalDmg,
            log: `發動<span style="color:#9b59b6">【因果律搗蛋】</span>，扭曲現實造成 <span style="color:#e74c3c">${totalDmg}</span> 傷害！`
          };
        }
      },
      {
        name: "次元裂縫遁走",
        chance: 0.15,
        color: "#34495e",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          let healAmt = Math.floor(currentMonster.maxHp * 0.15);
          return {
            dmg: 0,
            heal: healAmt,
            log: `遁入<span style="color:#34495e">【次元裂縫】</span>，恢復 <span style="color:#2ecc71">${healAmt}</span> HP！`
          };
        }
      },
      {
        name: "萬根歸宗",
        chance: 0.05,
        color: "#e74c3c",
        onEffect: (mBaseAtk, stats, currentMonster, playerCurrentHp) => {
          let gravityDmg = Math.max(
            mBaseAtk * 2,
            Math.floor((playerCurrentHp || 0) * 0.5)
          );
          return {
            dmg: gravityDmg,
            log: `禁術<span style="color:#e74c3c">【萬根歸宗】</span>撕裂世界線，造成 <span style="color:#c0392b">${gravityDmg}</span> 點絕對傷害！`
          };
        }
      }
    ]
  };
})();
