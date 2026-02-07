// js/maps/wusui_sanctuary.js
(function () {
  "use strict";

  // ----------------------------
  // 怪物池（固定 id）
  // ----------------------------
  const poolOuter = [
    "ws_follower_basic", // 五歲教教眾
    "ws_believer",       // 信徒
    "ws_support"         // 後勤人員
  ];

  const poolInner = [
    "ws_follower_basic",
    "ws_believer",
    "ws_support",
    "ws_follower_elite", // 精英教眾
    "ws_believer_elite", // 精英信徒
    "ws_priest",         // 祭司
    "ws_fighter",        // 戰鬥人員
    "ws_zealot",         // 狂信者
    "ws_ascetic"         // 苦行僧
  ];

  const poolCore = [
    "ws_follower_elite",
    "ws_believer_elite",
    "ws_priest",
    "ws_fighter",
    "ws_zealot",
    "ws_ascetic",
    "ws_bishop",   // 主教
    "ws_guardian"  // 護法
    // 教主 ws_master 用機率塞入
  ];

  function randInt(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (max < min) max = min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // （可選）保險：如果 monsters 檔沒載到，嘗試補載
  let monstersLoaded = false;
  async function ensureMonstersLoaded() {
    if (monstersLoaded) return;
    monstersLoaded = true;

    // 如果已經有 registry 就算載好了
    if (window.mapMonsterRegistry?.["wusui_sanctuary"]) return;

    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "js/maps/wusui_sanctuary_monsters.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("無法載入五歲教聖地怪物檔"));
      document.head.appendChild(s);
    });
  }

  registerMap({
    id: "wusui_sanctuary",
    name: "五歲教聖地",
    order: 1,

    depths: {
      outer: { label: "外圍", min: 1, max: 2 },
      inner: { label: "深入", min: 3, max: 4 },
      core:  { label: "核心", min: 4, max: 6 } // 建議先封頂 6，避免一次抽到 999 隻爆掉
    },

    async getEncounter(depth, context) {
      await ensureMonstersLoaded();

      const d = this.depths[depth] || this.depths.outer;
      const count = randInt(d.min, d.max);

      let pool = poolOuter;
      if (depth === "inner") pool = poolInner;
      if (depth === "core")  pool = poolCore;

      const monsterIds = [];
      for (let i = 0; i < count; i++) {
        monsterIds.push(pool[randInt(0, pool.length - 1)]);
      }

      // 核心：小機率替換其中一隻為教主
      if (depth === "core" && monsterIds.length) {
        const bossChance = 0.08;
        if (Math.random() < bossChance) {
          const idx = randInt(0, monsterIds.length - 1);
          monsterIds[idx] = "ws_master";
        }
      }

      return { count, monsterIds, mapId: this.id, depth };
    }
  });

})();
