// js/bosses/index.js
(function () {
  window.bossRegistry = window.bossRegistry || {};
  window.bossesLoaded = false;

  // 你只要維護這份清單（檔名大小寫要與 GitHub 上完全一致）
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
    "boss_final_1.js"
  ];

  // ✅ 用 index.js 自己的位置當 base（GitHub Pages / repo 子路徑都不會炸）
  const thisUrl = new URL(document.currentScript.src);
  const baseDir = new URL("./", thisUrl); // => .../js/bosses/

  function loadScript(url) {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = false;

      s.onload = () => resolve({ ok: true, url });
      s.onerror = () => resolve({ ok: false, url });

      document.head.appendChild(s);
    });
  }

  // ✅ bossData：直接從 registry 組合（不猜 id）
  // 若你想要固定順序，後面我給你 bossIdList 版本
  Object.defineProperty(window, "bossData", {
    get() {
      return Object.values(window.bossRegistry || {});
    }
  });

  (async function () {
    const results = [];

    for (const file of bossFiles) {
      const url = new URL(file, baseDir).href;
      const r = await loadScript(url);
      results.push(r);
      if (!r.ok) console.error("[bosses] failed:", r.url);
    }

    // ✅ 無論中途是否有失敗，都宣告載入流程完成（避免 UI 永遠等不到）
    window.bossesLoaded = true;

    const okCount = results.filter(x => x.ok).length;
    const regCount = Object.keys(window.bossRegistry).length;
    console.log(`[bosses] load done. files ok=${okCount}/${bossFiles.length}, registry=${regCount}`);

    window.dispatchEvent(new Event("bosses:loaded"));
  })();
})();
