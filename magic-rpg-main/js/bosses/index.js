// js/bosses/index.js
(function () {
  window.bossRegistry = window.bossRegistry || {};

  // 1) 你只要維護這份清單（檔名大小寫要完全一致）
  const bossFiles = [
    "boss_1.js",
    "boss_2.js",
    "boss_3.js",
    "boss_4.js",
    "boss_5.js",
    "boss_6.js",
    "boss_7.js",
    "boss_mandrake_1.js",
    "boss_mandrake_ascended.js",
    "boss_shark_liver.js",
    "boss_final_1.js",
    "boss_tide_priestess.js"
  ];

  // 2) 取得目前這支 index.js 的資料夾當 base（GitHub Pages 不會炸）
  const thisScriptUrl = new URL(document.currentScript.src);
  const baseDir = new URL("./", thisScriptUrl); // => .../js/bosses/

  // 3) 順序載入（避免 async 造成 bossRegistry 還沒填完就被用）
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = false; // 關鍵：不要 async
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load: " + url));
      document.head.appendChild(s);
    });
  }

  // 4) 舊系統相容：bossData（永遠從 registry 即時組合）
  Object.defineProperty(window, "bossData", {
    get() {
      return bossFiles
        .map(f => f.replace(/\.js$/i, ""))     // 這裡如果你的 id != 檔名，改成 bossIdList 方式
        .map(id => window.bossRegistry[id])
        .filter(Boolean);
    }
  });

  // 5) 對外提供一個 ready 旗標 + 事件（需要等載入完再 render dropdown）
  window.bossesLoaded = false;

  (async function () {
    try {
      for (const file of bossFiles) {
        const url = new URL(file, baseDir).href;
        await loadScript(url);
      }
      window.bossesLoaded = true;
      window.dispatchEvent(new Event("bosses:loaded"));
    } catch (e) {
      console.error("[bosses] load error:", e);
    }
  })();
})();