// js/maps/index.js
// 這裡只維護「要載入的檔案清單」
// 規則：先 monsters，再 maps（因為 maps 可能會依賴怪物資料）

(function () {
  window.MAPS_MANIFEST = window.MAPS_MANIFEST || {};

  window.MAPS_MANIFEST.scripts = [
    // --- monsters packs ---
    "js/maps/wusui_sanctuary_monsters.js",
    "js/maps/mist_ruins_monsters.js",

    // --- maps (registerMap 會在這些檔案內被呼叫) ---
    "js/maps/wusui_sanctuary.js",
    "js/maps/mist_ruins.js",
  ];
})();
