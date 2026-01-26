// js/bosses/boss_tide_priestess.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  window.bossRegistry["boss_tide_priestess"] = {
    id: "boss_tide_priestess",
    name: "潮聲女祭司",
    isBoss: true,

    lv: 98,
    hp: 4400000,
    maxHp: 4400000,
    def: 7200,

    atkRange: [11000, 16000],

    stats: {
      atk: 13500,
      def: 7200,
      critRate: 9,
      critMulti: 2.4,
      dodgeRate: 5
    },

    ai: {
      aggression: 0.9,
      skillBias: "random",
      phaseAware: false
    },

    resistances: {
      water: 60,
      dark: 20
    },

    img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "潮聲聖痕",
    rewardMana: 7500000,

    onDeath: function (currentMonster) {
      let drops = [];

      // ✅ 保底史詩以上
      const equip = generateRandomEquip(currentMonster.lv);
      if (equip) {
        if (equip.rarity < 2) equip.rarity = 2;
        drops.push(equip);
      }

      // 🎲 30% 再掉一件
      if (Math.random() < 0.3) {
        const extra = generateRandomEquip(currentMonster.lv);
        if (extra) {
          if (extra.rarity < 2) extra.rarity = 2;
          drops.push(extra);
        }
      }

      return drops;
    },

    skills: [
      {
        name: "潮聲低語",
        chance: 0.25,
        color: "#74b9ff",
        onEffect: (mBaseAtk, stats) => {
          return [
            {
              type: "buff",
              target: "player",
              log: "潮聲纏繞著你，侵蝕生命。",
              buff: {
                id: "tide_corrosion",
                name: "潮蝕",
                icon: "🌊",
                duration: 3,
                stacks: 1,
                maxStacks: 3,
                onTick: (ctx, b) => [
                  {
                    type: "damage",
                    target: "player",
                    value: 120 * (b.stacks || 1),
                    log: "🌊 潮蝕造成傷害"
                  }
                ]
              }
            }
          ];
        }
      },

      {
        name: "深海祈禱",
        chance: 0.2,
        color: "#0984e3",
        onEffect: () => {
          return [
            {
              type: "buff",
              target: "player",
              log: "女祭司的祈禱削弱了你的防禦。",
              buff: {
                id: "deep_prayer",
                name: "深海祈禱",
                icon: "🔱",
                duration: 3,
                stacks: 1,
                maxStacks: 1,
                onApply: (ctx, b) => {
                  ctx.player.def = Math.floor(ctx.player.def * 0.85);
                }
              }
            }
          ];
        }
      },

      {
        name: "海嘯裁決",
        chance: 0.15,
        color: "#00cec9",
        onEffect: (mBaseAtk, stats, currentMonster, ctx) => {
          const hasDebuff =
            ctx.playerBuffs &&
            ctx.playerBuffs.some(b => b.id === "tide_corrosion");

          const power = hasDebuff ? 2.2 : 1.4;
          const atk = mBaseAtk * power;
          const dmg = Math.max(
            1,
            Math.floor((atk * atk) / (atk + stats.def))
          );

          return [
            {
              type: "damage",
              target: "player",
              value: dmg,
              log: hasDebuff
                ? "🌊 海嘯裁決爆發！(潮蝕加成)"
                : "🌊 海嘯裁決襲來！"
            }
          ];
        }
      }
    ]
  };
})();
