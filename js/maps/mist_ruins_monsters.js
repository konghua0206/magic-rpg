// js/maps/mist_ruins_monsters.js
(function () {
  window.mapMonsterRegistry = window.mapMonsterRegistry || {};

  function registerMapMonsters(mapId, monsters) {
    if (!mapId) return;
    if (!Array.isArray(monsters)) return;
    window.mapMonsterRegistry[mapId] = window.mapMonsterRegistry[mapId] || {};
    for (const m of monsters) {
      if (!m || !m.id) continue;
      window.mapMonsterRegistry[mapId][m.id] = m;
    }
  }

  window.getMapMonster = function getMapMonster(mapId, monsterId) {
    return window.mapMonsterRegistry?.[mapId]?.[monsterId] || null;
  };

  window.getMapMonsterPool = function getMapMonsterPool(mapId) {
    const bag = window.mapMonsterRegistry?.[mapId] || {};
    return Object.values(bag);
  };

  function clampInt(n, min, max) {
    n = Math.floor(Number(n) || 0);
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  // ------------------------------------------------------------
  // 技能
  // ------------------------------------------------------------
  function skill_mistSlash(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.9);
    return [
      { type: "log", text: `🌫️ <b>【${name}｜霧刃斬】</b> 霧氣凝成刀刃劃過你身旁。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_sporeBurst(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.75);
    const drain = 14;
    return [
      { type: "log", text: `🍄 <b>【${name}｜孢霧噴發】</b> 刺鼻孢霧擴散，讓你呼吸困難。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      { type: "mana", target: "player", value: -drain, log: `你被孢霧干擾（-${drain} 魔力）` }
    ];
  }

  function skill_howl(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.1);
    return [
      { type: "log", text: `🐺 <b>【${name}｜迷霧嚎叫】</b> 回音刺入耳膜，讓你頭昏眼花。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_relicPulse(mBaseAtk, stats, monster) {
    const name = monster.name;
    const heal = 22000;
    return [
      { type: "log", text: `🗿 <b>【${name}｜遺跡回響】</b> 古老符文亮起，護住它的身形。` },
      { type: "healMonster", value: heal, log: `${name} 回復 ${heal} HP` }
    ];
  }

  function skill_hunterStrike(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.25);
    return [
      { type: "log", text: `🏹 <b>【${name}｜獵霧突刺】</b> 霧中一閃，利刃直指要害！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_sentinelCrash(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.35);
    const drain = 24;
    return [
      { type: "log", text: `🛡️ <b>【${name}｜守衛重擊】</b> 石甲撞擊掀起一陣震盪。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      { type: "mana", target: "player", value: -drain, log: `你被震得失去專注（-${drain} 魔力）` }
    ];
  }

  function skill_wardenFog(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.95);
    return [
      { type: "log", text: `🌫️ <b>【${name}｜封鎖迷霧】</b> 霧牆壓迫而來，讓你難以站穩。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_overseerJudgement(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.65);
    const drain = 40;
    return [
      { type: "log", text: `👁️ <b>【${name}｜遺跡審視】</b> 霧林監察者的視線像鎖鏈纏住你。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      { type: "mana", target: "player", value: -drain, log: `你被壓迫（-${drain} 魔力）` }
    ];
  }

  // ------------------------------------------------------------
  // 數值：65~90 等，讓新區域可以接在五歲教聖地之後
  // ------------------------------------------------------------
  const MAP_ID = "mist_ruins";

  function normalizeMonster(m) {
    if (!m || !m.id) return m;

    const atkRange = Array.isArray(m.atkRange) && m.atkRange.length >= 2
      ? [Number(m.atkRange[0]) || 1, Number(m.atkRange[1]) || 2]
      : [1, 2];

    const avgAtk = Math.max(1, Math.floor((atkRange[0] + atkRange[1]) / 2));
    const isBoss = m.isBoss === true || m.id === "mr_overseer";

    return {
      id: m.id,
      name: m.name || m.id,
      isBoss,

      lv: Number(m.lv) || 1,
      hp: Number(m.hp) || 1,
      maxHp: Number(m.maxHp) || Number(m.hp) || 1,
      def: Number(m.def) || 0,

      atkRange,

      stats: {
        atk: Number(m.stats?.atk) || avgAtk,
        def: Number(m.stats?.def) || (Number(m.def) || 0),
        critRate: Number(m.stats?.critRate) || 0,
        critMulti: Number(m.stats?.critMulti) || 1.5,
        dodgeRate: Number(m.stats?.dodgeRate) || 0
      },

      ai: {
        aggression: Number(m.ai?.aggression) || 0.5,
        skillBias: m.ai?.skillBias || "random",
        phaseAware: !!m.ai?.phaseAware
      },

      phases: Array.isArray(m.phases) ? m.phases : [],
      resistances: (m.resistances && typeof m.resistances === "object") ? m.resistances : {},
      state: (m.state && typeof m.state === "object") ? m.state : {},

      skills: Array.isArray(m.skills) ? m.skills : [],

      img: m.img || "",
      dropMat: m.dropMat || (isBoss ? "霧林晶核" : "霧林殘晶"),
      rewardMana: Number(m.rewardMana) || 0,

      attackLog: m.attackLog || ""
    };
  }

  const monsters = [
    {
      id: "mr_scout",
      name: "霧林斥候",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 65,
      hp: 420000,
      def: 720,
      atkRange: [2000, 2800],
      attackLog: "🌫️ 霧林斥候貼地滑行",
      skills: [
        { id: "slash", name: "霧刃斬", icon: "🌫️", color: "#90caf9", onEffect: skill_mistSlash }
      ]
    },
    {
      id: "mr_spore",
      name: "孢霧小妖",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 66,
      hp: 460000,
      def: 700,
      atkRange: [1900, 2600],
      attackLog: "🍄 孢霧小妖甩動觸鬚",
      skills: [
        { id: "spore", name: "孢霧噴發", icon: "🍄", color: "#a5d6a7", onEffect: skill_sporeBurst }
      ]
    },
    {
      id: "mr_howler",
      name: "迷霧嚎者",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 68,
      hp: 520000,
      def: 760,
      atkRange: [2300, 3100],
      attackLog: "🐺 迷霧嚎者在霧中低吼",
      skills: [
        { id: "howl", name: "迷霧嚎叫", icon: "🐺", color: "#b39ddb", onEffect: skill_howl }
      ]
    },
    {
      id: "mr_relic",
      name: "遺跡護像",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 72,
      hp: 780000,
      def: 980,
      atkRange: [2600, 3600],
      attackLog: "🗿 遺跡護像移動時地面顫動",
      skills: [
        { id: "pulse", name: "遺跡回響", icon: "🗿", color: "#ffe082", onEffect: skill_relicPulse },
        { id: "slash", name: "霧刃斬", icon: "🌫️", color: "#90caf9", onEffect: skill_mistSlash }
      ]
    },
    {
      id: "mr_hunter",
      name: "霧林獵影",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 75,
      hp: 840000,
      def: 1050,
      atkRange: [3100, 4200],
      attackLog: "🏹 霧林獵影從陰影中現身",
      skills: [
        { id: "strike", name: "獵霧突刺", icon: "🏹", color: "#ffcc80", onEffect: skill_hunterStrike }
      ]
    },
    {
      id: "mr_sentinel",
      name: "遺跡守衛",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 80,
      hp: 1100000,
      def: 1320,
      atkRange: [3800, 5200],
      attackLog: "🛡️ 遺跡守衛扛起巨盾",
      skills: [
        { id: "crash", name: "守衛重擊", icon: "🛡️", color: "#ce93d8", onEffect: skill_sentinelCrash },
        { id: "howl", name: "迷霧嚎叫", icon: "🐺", color: "#b39ddb", onEffect: skill_howl }
      ]
    },
    {
      id: "mr_warden",
      name: "霧林守誓者",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 84,
      hp: 1300000,
      def: 1480,
      atkRange: [4200, 5800],
      attackLog: "🌫️ 霧林守誓者揮動刻紋長槍",
      skills: [
        { id: "fog", name: "封鎖迷霧", icon: "🌫️", color: "#80deea", onEffect: skill_wardenFog },
        { id: "strike", name: "獵霧突刺", icon: "🏹", color: "#ffcc80", onEffect: skill_hunterStrike }
      ]
    },
    {
      id: "mr_overseer",
      name: "霧林監察者",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 90,
      hp: 2200000,
      def: 1820,
      atkRange: [5200, 7600],
      attackLog: "👁️ 霧林監察者在迷霧中緩步而來",
      skills: [
        { id: "judge", name: "遺跡審視", icon: "👁️", color: "#f48fb1", onEffect: skill_overseerJudgement },
        { id: "crash", name: "守衛重擊", icon: "🛡️", color: "#ce93d8", onEffect: skill_sentinelCrash },
        { id: "fog", name: "封鎖迷霧", icon: "🌫️", color: "#80deea", onEffect: skill_wardenFog }
      ],
      isBoss: true
    }
  ];

  registerMapMonsters(MAP_ID, monsters.map(normalizeMonster));
})();
