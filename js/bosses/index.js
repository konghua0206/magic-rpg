// js/bosses/index.js
(function () {
  // Registry
  window.bossRegistry = window.bossRegistry || {};

  // === BOSS 清單（維護區） ===
  const bossFiles = [
    "boss_1.js",
    "boss_mandrake_1.js",
    "boss_2.js",
    "boss_3.js",
    "boss_4.js",
    "boss_5.js",
    "boss_6.js",
    "boss_7.js",
    "boss_mandrake_ascended.js",
    "boss_shark_liver.js",
    "boss_final_1.js"
  ];

  // === 動態載入 ===
  bossFiles.forEach(file => {
    const script = document.createElement("script");
    script.src = "js/bosses/" + file;
    script.defer = true;
    document.head.appendChild(script);
  });

  // === 舊系統相容：bossData ===
  Object.defineProperty(window, "bossData", {
    get() {
      return Object.values(window.bossRegistry);
    }
  });
})();
