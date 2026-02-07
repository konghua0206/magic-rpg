// js/maps/mist_ruins.js
(function () {
  "use strict";

  // ----------------------------
  // 怪物池（固定 id）
  // ----------------------------
  const poolOuter = [
    "mr_scout",   // 霧林斥候
    "mr_spore",   // 孢霧小妖
    "mr_howler"   // 迷霧嚎者
  ];

  const poolInner = [
    "mr_scout",
    "mr_spore",
    "mr_howler",
    "mr_relic",
    "mr_hunter"
  ];

  const poolCore = [
    "mr_relic",
    "mr_hunter",
    "mr_sentinel",
    "mr_warden"
    // 監察者 mr_overseer 以小機率插入
  ];

  function randInt(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (max < min) max = min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let monstersLoaded = false;
  async function ensureMonstersLoaded() {
    if (monstersLoaded) return;
    monstersLoaded = true;

    if (window.mapMonsterRegistry?.["mist_ruins"]) return;

    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "js/maps/mist_ruins_monsters.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("無法載入霧林遺跡怪物檔"));
      document.head.appendChild(s);
    });
  }

  registerMap({
    id: "mist_ruins",
    name: "霧林遺跡",
    order: 2,

    depths: {
      outer: { label: "外圍", min: 1, max: 2 },
      inner: { label: "深入", min: 2, max: 4 },
      core:  { label: "核心", min: 3, max: 5 }
    },

    async getEncounter(depth) {
      await ensureMonstersLoaded();

      const d = this.depths[depth] || this.depths.outer;
      const count = randInt(d.min, d.max);

      let pool = poolOuter;
      if (depth === "inner") pool = poolInner;
      if (depth === "core") pool = poolCore;

      const monsterIds = [];
      for (let i = 0; i < count; i++) {
        monsterIds.push(pool[randInt(0, pool.length - 1)]);
      }

      if (depth === "core" && monsterIds.length) {
        const bossChance = 0.1;
        if (Math.random() < bossChance) {
          const idx = randInt(0, monsterIds.length - 1);
          monsterIds[idx] = "mr_overseer";
        }
      }

      return { count, monsterIds, mapId: this.id, depth };
    }
  });
})();
