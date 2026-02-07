// js/bosses/boss_shark_liver.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_shark_liver"] = {
    id: "boss_shark_liver",
    name: "公鯊小心肝",
    isBoss: true,

    lv: 95,
    hp: 3800000,
    maxHp: 3800000,
    def: 6500,

    atkRange: [9000, 14000],

    stats: {
      atk: 11500,
      def: 6500,
      critRate: 9,
      critMulti: 2.3,
      dodgeRate: 4
    },

    ai: {
      aggression: 0.85,
      skillBias: "random",
      phaseAware: true
    },

    phases: [],
    resistances: {
      water: 70
    },

    state: {
      isTransformed: false
    },

    img: "images/2Q.png",
    dropMat: "小心肝的精華",
    rewardMana: 5000000,

    skills: [
      {
        name: "巨鯊幻化",
        chance: 0.2,
        color: "#3498db",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          currentMonster.state.isTransformed = true;
          return {
            dmg: 0,
            log: `<span style="color:#3498db">幻化成巨鯊，攻擊力大幅提升！</span>`
          };
        }
      },
      {
        name: "心肝撞擊",
        chance: 0.2,
        color: "#e74c3c",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          const power = currentMonster.state.isTransformed ? 2.5 : 1.2;
          let skillAtk = mBaseAtk * power;
          let dmg = Math.max(
            1,
            Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def))
          );

          currentMonster.state.isTransformed = false;

          return {
            dmg,
            log: `心肝撞擊造成 <span style="color:#ff4d4d">${dmg}</span> 傷害！${
              power > 2 ? "<b>(幻化加成)</b>" : ""
            }`
          };
        }
      },
      {
        name: "狗鯊召喚",
        chance: 0.1,
        color: "#95a5a6",
        onEffect: (mBaseAtk, stats, currentMonster) => {
          let dmg = Math.max(
            1,
            Math.floor((mBaseAtk * mBaseAtk) / (mBaseAtk + stats.def))
          );
          let healAmt = Math.floor(currentMonster.hp * 0.05);
          return {
            dmg,
            heal: healAmt,
            log: `召喚狗鯊群造成 ${dmg} 傷害，並回復 <span style="color:#2ecc71">${healAmt.toLocaleString()}</span> HP！`
          };
        }
      }
    ]
  };
})();
