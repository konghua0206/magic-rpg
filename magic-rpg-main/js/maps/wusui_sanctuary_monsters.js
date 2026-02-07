// js/maps/wusui_sanctuary_monsters.js
(function () {
  // ------------------------------------------------------------
  // Registry（先用 window.mapMonsterRegistry 存，未來你要接 map.js 或 encounter 都方便）
  // ------------------------------------------------------------
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

  // 提供外部取用（之後 getMapEncounter / 地圖戰鬥會用得到）
  window.getMapMonster = function getMapMonster(mapId, monsterId) {
    return window.mapMonsterRegistry?.[mapId]?.[monsterId] || null;
  };

  window.getMapMonsterPool = function getMapMonsterPool(mapId) {
    const bag = window.mapMonsterRegistry?.[mapId] || {};
    return Object.values(bag);
  };

  // ------------------------------------------------------------
  // 小工具：讀取玩家 Buff（不改全域，只讀 battleContext）
  // ------------------------------------------------------------
  function getPlayerBuff(id) {
    const ctx = window.battleContext;
    if (!ctx) return null;

    // 你的 buff 容器有時候是 ctx.buffs.player / ctx.buffs["player"]
    const buffs = ctx.buffs?.player || ctx.buffs?.["player"] || [];
    if (!Array.isArray(buffs)) return null;
    return buffs.find(b => b && b.id === id) || null;
  }

  function hasPlayerBuff(id) {
    return !!getPlayerBuff(id);
  }

  function clampInt(n, min, max) {
    n = Math.floor(Number(n) || 0);
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  // ------------------------------------------------------------
  // 核心狀態（全圖共通）
  // - mark：童詠印記（疊層）
  // - bell_burn：聖鈴灼心（DOT）
  // ------------------------------------------------------------
  function res_applyMark(sourceName, stacks, duration) {
    return {
      type: "buff",
      target: "player",
      buff: {
        id: "mark",
        name: "童詠印記",
        icon: "🎶",
        duration: clampInt(duration, 1, 6),
        stacks: clampInt(stacks, 1, 3),
        maxStacks: 3
      },
      log: `🎶 <b>【${sourceName}｜童詠印記】</b> 你的腦海被刻下印記。`
    };
  }

  function res_applyBellBurn(sourceName, baseDot, duration) {
    const dot = clampInt(baseDot, 1, 999999);
    return {
      type: "buff",
      target: "player",
      buff: {
        id: "bell_burn",
        name: "聖鈴灼心",
        icon: "🔔",
        duration: clampInt(duration, 1, 6),
        stacks: 1,
        maxStacks: 3,
        onTick: (ctx, buff) => {
          const s = clampInt(buff?.stacks || 1, 1, 3);
          const dmg = dot * s;
          return [{
            type: "damage",
            target: "player",
            value: dmg,
            log: `🔔 聖鈴灼心（${s}層）發作，造成 ${dmg} 傷害`
          }];
        }
      },
      log: `🔔 <b>【${sourceName}｜聖鈴灼心】</b> 鈴聲震盪，你的心口一陣灼痛。`
    };
  }

  // ------------------------------------------------------------
  // 技能：全部都用 onEffect(mBaseAtk, stats, monster) -> BattleResults[]
  // ------------------------------------------------------------

  // 1) 五歲教教眾（Minion 1 技能 / Elite 2 技能）
  function skill_whisper(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.85);
    const apply = Math.random() < 0.55; // 55% 上印記
    const results = [
      { type: "log", text: `🎶 <b>【${name}｜童詠低語】</b> 低聲哼唱的童詠鑽入你耳膜。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
    if (apply) results.push(res_applyMark(name, 1, 2));
    return results;
  }

  function skill_shrillBell(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const mult = marked ? 1.55 : 1.05;
    const dmg = Math.floor(mBaseAtk * mult);
    return [
      { type: "log", text: `🔔 <b>【${name}｜鈴聲刺耳】</b> 你腦中的童詠被鈴聲放大，痛得發麻！` },
      { type: "damage", target: "player", value: dmg, log: marked ? `（共鳴）你受到 ${dmg} 傷害` : `你受到 ${dmg} 傷害` }
    ];
  }

  // 2) 信徒（Minion / Elite）
  function skill_fanaticCharge(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.15);
    return [
      { type: "log", text: `🛐 <b>【${name}｜狂熱衝撞】</b> 他雙眼發紅，毫不猶豫地撞上來！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_kneelPrayer(mBaseAtk, stats, monster) {
    const name = monster.name;
    // 你目前 buff 系統不支援 statMods，所以先做「壓力型」：回合內小回魔給玩家扣掉（當成干擾）
    const drain = 18;
    return [
      { type: "log", text: `🙏 <b>【${name}｜跪拜祈禱】</b> 他高聲祈禱，讓你的思緒變得混亂。` },
      { type: "mana", target: "player", value: -drain, log: `你的魔力被干擾（-${drain}）` }
    ];
  }

  // 3) 祭司（Elite / Champion）
  function skill_incenseBless(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.75);
    return [
      { type: "log", text: `🕯️ <b>【${name}｜施香祝禱】</b> 煙霧纏上你的呼吸，胸口發悶。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      res_applyMark(name, 1, 2)
    ];
  }

  function skill_bellBurn(mBaseAtk, stats, monster) {
    const name = monster.name;
    const baseDot = 420; // 80~100 等：DOT 壓力要看得出來
    return [
      res_applyBellBurn(name, baseDot, 3)
    ];
  }

  function skill_chantHeal(mBaseAtk, stats, monster) {
    const name = monster.name;
    const heal = 26000; // 精英頭目才有的續航
    return [
      { type: "log", text: `✨ <b>【${name}｜淨化詠唱】</b> 他閉眼誦念，傷口以肉眼可見的速度癒合。` },
      { type: "healMonster", value: heal, log: `${name} 回復 ${heal} HP` }
    ];
  }

  // 4) 戰鬥人員（Elite）
  function skill_formationRush(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.05);
    return [
      { type: "log", text: `🗡️ <b>【${name}｜隊列突擊】</b> 他踩著整齊步伐逼近，刀光一閃！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_breakLine(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const dmg = Math.floor(mBaseAtk * (marked ? 1.70 : 1.20));
    return [
      { type: "log", text: marked
          ? `💥 <b>【${name}｜破陣槌】</b> 他抓準你印記共鳴的破綻，重擊直落！`
          : `💥 <b>【${name}｜破陣槌】</b> 他蓄力重擊，震得你手臂發麻！`
      },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  // 5) 後勤人員（Minion）
  function skill_throwSand(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 0.65);
    return [
      { type: "log", text: `🧺 <b>【${name}｜撒沙退敵】</b> 他狼狽地抓起砂土猛撒，你視線一瞬間模糊！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      // 用 mana 當作「干擾」：先做可用效果，未來你想改成命中率 debuff 也好改
      { type: "mana", target: "player", value: -12, log: `你被干擾（魔力 -12）` }
    ];
  }

  // 6) 主教（Champion）
  function skill_bishopDecree(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const burned = hasPlayerBuff("bell_burn");
    const mult = (marked && burned) ? 2.05 : (marked ? 1.55 : 1.20);
    const dmg = Math.floor(mBaseAtk * mult);
    return [
      { type: "log", text: (marked && burned)
          ? `⚡ <b>【${name}｜宣告裁決】</b> 鈴聲與童詠同時共鳴——裁決如雷落下！`
          : `⚡ <b>【${name}｜宣告裁決】</b> 他冷冷一指，裁決降臨。`
      },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  // 7) 狂信者（Elite）
  function skill_bloodFervor(mBaseAtk, stats, monster) {
    const name = monster.name;
    // 不做 stat buff（目前 buff 系統不支援），改成「自殘換爆發」：立刻更痛 + 上印記
    const dmg = Math.floor(mBaseAtk * 1.35);
    return [
      { type: "log", text: `🩸 <b>【${name}｜自殘狂熱】</b> 他咬破舌尖，把血抹在額頭，笑得扭曲。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      res_applyMark(name, 1, 2)
    ];
  }

  function skill_bloodBurst(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const dmg = Math.floor(mBaseAtk * (marked ? 1.90 : 1.45));
    return [
      { type: "log", text: marked
          ? `💣 <b>【${name}｜血祭爆裂】</b> 童詠印記被血祭點燃，你痛得幾乎站不穩！`
          : `💣 <b>【${name}｜血祭爆裂】</b> 他猛地撲上來，爆裂的血氣衝擊全身！`
      },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  // 8) 苦行僧（Elite）
  function skill_disciplineStrike(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.00);
    return [
      { type: "log", text: `🪵 <b>【${name}｜戒律之擊】</b> 他面無表情，木杖落下，力道扎實得可怕。` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_vowSilence(mBaseAtk, stats, monster) {
    const name = monster.name;
    const drain = 55; // 80~100 等：封口感要明顯
    return [
      { type: "log", text: `🤫 <b>【${name}｜封口戒律】</b> 他抬手一按，你喉頭像被無形的線勒住。` },
      { type: "mana", target: "player", value: -drain, log: `你的魔力被封鎖（-${drain}）` }
    ];
  }

  // 9) 護法（Champion）
  function skill_guardPalm(mBaseAtk, stats, monster) {
    const name = monster.name;
    const dmg = Math.floor(mBaseAtk * 1.25);
    return [
      { type: "log", text: `🛡️ <b>【${name}｜擊退掌】</b> 護法一步踏前，掌勁像牆一樣推來！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_resonantSuppression(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const dmg = Math.floor(mBaseAtk * (marked ? 2.00 : 1.35));
    return [
      { type: "log", text: marked
          ? `⛓️ <b>【${name}｜共鳴鎮壓】</b> 他抓住印記共鳴的節拍，鎮壓之力直灌心口！`
          : `⛓️ <b>【${name}｜共鳴鎮壓】</b> 鎮壓的掌印拍落，你胸口一沉。`
      },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_barrierShow(mBaseAtk, stats, monster) {
    const name = monster.name;
    // 目前不做真正護盾（系統還沒 shield），先做「儀式拖回合」：上灼心增加壓力
    return [
      { type: "log", text: `🌀 <b>【${name}｜護法壁障】</b> 他展開壁障，鈴聲在其中反覆回響。` },
      res_applyBellBurn(name, 520, 3)
    ];
  }

  // 10) 教主（Boss）
  function skill_cultMasterMark(mBaseAtk, stats, monster) {
    const name = monster.name;
    return [
      { type: "log", text: `👑 <b>【${name}｜童詠印記】</b> 教主輕聲一笑，你的意識像被釘在祭壇上。` },
      res_applyMark(name, 2, 3)
    ];
  }

  function skill_cultMasterBurn(mBaseAtk, stats, monster) {
    const name = monster.name;
    return [
      res_applyBellBurn(name, 680, 4)
    ];
  }

  function skill_cultMasterJudgement(mBaseAtk, stats, monster) {
    const name = monster.name;
    const marked = hasPlayerBuff("mark");
    const burned = hasPlayerBuff("bell_burn");
    const mult = (marked && burned) ? 2.45 : (marked ? 1.85 : 1.35);
    const dmg = Math.floor(mBaseAtk * mult);
    return [
      { type: "log", text: (marked && burned)
          ? `⚡ <b>【${name}｜共鳴審判】</b> 童詠與鈴聲同頻，你的骨頭都在震！`
          : `⚡ <b>【${name}｜共鳴審判】</b> 教主抬手一點，審判落在你身上。`
      },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` }
    ];
  }

  function skill_cultMasterPurge(mBaseAtk, stats, monster) {
    const name = monster.name;
    // 收尾：高傷 + 抽魔（清場感）
    const dmg = Math.floor(mBaseAtk * 2.05);
    const drain = 95;
    return [
      { type: "log", text: `🌑 <b>【${name}｜聖地清場】</b> 教主張開雙臂，整個聖地的鈴聲像海嘯般壓來！` },
      { type: "damage", target: "player", value: dmg, log: `你受到 ${dmg} 傷害` },
      { type: "mana", target: "player", value: -drain, log: `你的魔力被席捲（-${drain}）` }
    ];
  }

  // ------------------------------------------------------------
  // 數值：80~100 等，血量從小怪 50 萬起，階級遞增
  // （你之後如果想套 boss備忘錄曲線，也能在這裡一次調整）
  // ------------------------------------------------------------
  const MAP_ID = "wusui_sanctuary";


  // ------------------------------------------------------------
  // ✅ 兼容 BOSS_1 格式：補齊戰鬥引擎會用到的欄位（特別是 maxHp）
  // 你之後新增怪物，只要維持最少欄位：id/name/img/lv/hp/def/atkRange/skills（可空）就行
  // ------------------------------------------------------------
  function normalizeMonster(m) {
    if (!m || !m.id) return m;

    const atkRange = Array.isArray(m.atkRange) && m.atkRange.length >= 2
      ? [Number(m.atkRange[0]) || 1, Number(m.atkRange[1]) || 2]
      : [1, 2];

    const avgAtk = Math.max(1, Math.floor((atkRange[0] + atkRange[1]) / 2));

    const isBoss = m.isBoss === true || m.id === "ws_master";

    return {
      // --- BOSS_1 標準欄位 ---
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

      // 技能沿用你原本格式：{id,name,icon,color,onEffect}
      skills: Array.isArray(m.skills) ? m.skills : [],

      // 圖 / 掉落（winBattle 會用 dropMat；rewardMana 目前用不到，但留著以後可用）
      img: m.img || "",
      dropMat: m.dropMat || (isBoss ? "聖鈴核心" : "聖地殘片"),
      rewardMana: Number(m.rewardMana) || 0,

      // 你原本有在普攻 fallback 用 attackLog，所以保留（可留空）
      attackLog: m.attackLog || ""
    };
  }
  const monsters = [
    // Minion（約 50 萬）
    {
      id: "ws_follower_basic",
      name: "五歲教教眾",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 80,
      hp: 500000,
      def: 820,
      atkRange: [2400, 3200],
      attackLog: "👊 五歲教教眾揮出混亂的一擊",
      skills: [
        { id: "whisper", name: "童詠低語", icon: "🎶", color: "#b39ddb", onEffect: skill_whisper }
      ]
    },
    {
      id: "ws_believer",
      name: "信徒",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 82,
      hp: 540000,
      def: 860,
      atkRange: [2550, 3350],
      attackLog: "🛐 信徒帶著狂熱撲上來",
      skills: [
        { id: "charge", name: "狂熱衝撞", icon: "🛐", color: "#ce93d8", onEffect: skill_fanaticCharge }
      ]
    },
    {
      id: "ws_support",
      name: "後勤人員",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 81,
      hp: 520000,
      def: 780,
      atkRange: [2200, 3000],
      attackLog: "🧺 後勤人員慌亂地亂打",
      skills: [
        { id: "sand", name: "撒沙退敵", icon: "🧺", color: "#b39ddb", onEffect: skill_throwSand }
      ]
    },

    // Elite（約 90~120 萬）
    {
      id: "ws_follower_elite",
      name: "五歲教教眾（精英）",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 86,
      hp: 920000,
      def: 1100,
      atkRange: [3200, 4300],
      attackLog: "🎶 精英教眾的步伐帶著詭異節奏",
      skills: [
        { id: "whisper", name: "童詠低語", icon: "🎶", color: "#b39ddb", onEffect: skill_whisper },
        { id: "shrill", name: "鈴聲刺耳", icon: "🔔", color: "#ce93d8", onEffect: skill_shrillBell }
      ]
    },
    {
      id: "ws_believer_elite",
      name: "信徒（精英）",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 87,
      hp: 980000,
      def: 1180,
      atkRange: [3400, 4600],
      attackLog: "🛐 精英信徒咆哮著逼近",
      skills: [
        { id: "charge", name: "狂熱衝撞", icon: "🛐", color: "#ce93d8", onEffect: skill_fanaticCharge },
        { id: "pray", name: "跪拜祈禱", icon: "🙏", color: "#b39ddb", onEffect: skill_kneelPrayer }
      ]
    },
    {
      id: "ws_priest",
      name: "祭司",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 88,
      hp: 1050000,
      def: 1260,
      atkRange: [3200, 4500],
      attackLog: "🕯️ 祭司舉起香爐，煙霧瀰漫",
      skills: [
        { id: "incense", name: "施香祝禱", icon: "🕯️", color: "#b39ddb", onEffect: skill_incenseBless },
        { id: "burn", name: "聖鈴灼心", icon: "🔔", color: "#ce93d8", onEffect: skill_bellBurn }
      ]
    },
    {
      id: "ws_fighter",
      name: "戰鬥人員",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 90,
      hp: 1150000,
      def: 1320,
      atkRange: [3700, 5200],
      attackLog: "🗡️ 戰鬥人員沉默地出刀",
      skills: [
        { id: "rush", name: "隊列突擊", icon: "🗡️", color: "#b39ddb", onEffect: skill_formationRush },
        { id: "break", name: "破陣槌", icon: "💥", color: "#ce93d8", onEffect: skill_breakLine }
      ]
    },
    {
      id: "ws_zealot",
      name: "狂信者",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 92,
      hp: 1100000,
      def: 1200,
      atkRange: [4200, 6100],
      attackLog: "🩸 狂信者的笑聲令人發寒",
      skills: [
        { id: "fervor", name: "自殘狂熱", icon: "🩸", color: "#f48fb1", onEffect: skill_bloodFervor },
        { id: "burst", name: "血祭爆裂", icon: "💣", color: "#f48fb1", onEffect: skill_bloodBurst }
      ]
    },
    {
      id: "ws_ascetic",
      name: "苦行僧",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 91,
      hp: 1200000,
      def: 1450,
      atkRange: [3300, 4700],
      attackLog: "🪵 苦行僧沉默地舉杖",
      skills: [
        { id: "strike", name: "戒律之擊", icon: "🪵", color: "#b39ddb", onEffect: skill_disciplineStrike },
        { id: "silence", name: "封口戒律", icon: "🤫", color: "#ce93d8", onEffect: skill_vowSilence }
      ]
    },

    // Champion（約 180~260 萬）
    {
      id: "ws_bishop",
      name: "主教",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 96,
      hp: 2200000,
      def: 1850,
      atkRange: [5200, 7500],
      attackLog: "⚡ 主教的目光像冰一樣冷",
      skills: [
        { id: "incense", name: "施香祝禱", icon: "🕯️", color: "#b39ddb", onEffect: skill_incenseBless },
        { id: "burn", name: "聖鈴灼心", icon: "🔔", color: "#ce93d8", onEffect: skill_bellBurn },
        { id: "decree", name: "宣告裁決", icon: "⚡", color: "#f1c40f", onEffect: skill_bishopDecree }
      ]
    },
    {
      id: "ws_guardian",
      name: "護法",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 97,
      hp: 2600000,
      def: 2100,
      atkRange: [5600, 8200],
      attackLog: "🛡️ 護法一步踏前，壓迫感撲面而來",
      skills: [
        { id: "barrier", name: "護法壁障", icon: "🌀", color: "#b39ddb", onEffect: skill_barrierShow },
        { id: "palm", name: "擊退掌", icon: "🛡️", color: "#ce93d8", onEffect: skill_guardPalm },
        { id: "supp", name: "共鳴鎮壓", icon: "⛓️", color: "#f1c40f", onEffect: skill_resonantSuppression }
      ]
    },

    // Boss（教主，約 450~600 萬）
    {
      id: "ws_master",
      name: "教主",
      img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
      lv: 100,
      hp: 5600000,
      def: 2650,
      atkRange: [7800, 11200],
      attackLog: "👑 教主抬手，空氣像凝固了一樣",
      skills: [
        { id: "m_mark", name: "童詠印記", icon: "🎶", color: "#f1c40f", onEffect: skill_cultMasterMark },
        { id: "m_burn", name: "聖鈴灼心", icon: "🔔", color: "#ce93d8", onEffect: skill_cultMasterBurn },
        { id: "m_judge", name: "共鳴審判", icon: "⚡", color: "#f1c40f", onEffect: skill_cultMasterJudgement },
        { id: "m_purge", name: "聖地清場", icon: "🌑", color: "#e57373", onEffect: skill_cultMasterPurge }
      ]
    }
  ];

  registerMapMonsters(MAP_ID, monsters.map(normalizeMonster));
})();
