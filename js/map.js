// js/map.js
(function () {
  "use strict";

  // ------------------------------------------------------------
  // 1) Map Registry
  // ------------------------------------------------------------
  const registry = new Map(); // mapId -> mapDef
  let mapsLoaded = false;

  // 你目前沒有自動掃資料夾的機制（純前端很難列目錄）
  // 所以用「清單」管理：之後你新增地圖檔，就加一行即可。
  function getManifestScripts() {
  const list = window.MAPS_MANIFEST?.scripts;
  return Array.isArray(list) ? list : [];
  }


  // 給地圖檔呼叫：registerMap({ id, name, order, depths, getEncounter })
  window.registerMap = function registerMap(def) {
    if (!def || !def.id) return;
    registry.set(def.id, def);
  };

  function getMapsSorted() {
    return Array.from(registry.values()).sort((a, b) => (a.order || 9999) - (b.order || 9999));
  }

  const loadedScripts = new Set();
  const loadingScripts = new Map();

  function loadScriptOnce(src) {
    if (loadedScripts.has(src)) return Promise.resolve();
    if (loadingScripts.has(src)) return loadingScripts.get(src);

    const promise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        loadedScripts.add(src);
        loadingScripts.delete(src);
        resolve();
      };
      s.onerror = () => {
        loadingScripts.delete(src);
        reject(new Error("無法載入腳本: " + src));
      };
      document.head.appendChild(s);
    });

    loadingScripts.set(src, promise);
    return promise;
  }


  async function ensureMapScriptsLoaded() {
    if (mapsLoaded) return;

    const scripts = getManifestScripts();
    if (!scripts.length) {
      console.warn("MAPS_MANIFEST.scripts 是空的：請檢查 js/maps/index.js 是否有載入且順序在 map.js 之前");
      return;
    }

    try {
      for (const src of scripts) {
        await loadScriptOnce(src);
      }
      mapsLoaded = true;
    } catch (err) {
      mapsLoaded = false;
      throw err;
    }
  }


  // ------------------------------------------------------------
  // 2) UI State (你在 index.html 已經有 mapState 這個全域)
  //    我們不破壞它：直接沿用 window.mapState
  // ------------------------------------------------------------
  function getMapState() {
    // index.html 內已有預設值：mapId/depth（你目前是 wusui_sanctuary / outer）:contentReference[oaicite:5]{index=5}
    window.mapState = window.mapState || { mapId: null, depth: "outer" };
    return window.mapState;
  }

  // ------------------------------------------------------------
  // 3) Render Controls (mapSelect / depth buttons / mapInfo)
  // ------------------------------------------------------------
  window.renderMapControls = async function renderMapControls() {
    await ensureMapScriptsLoaded();

    const sel = document.getElementById("mapSelect");
    if (!sel) return;

    const state = getMapState();
    const maps = getMapsSorted();

    // 建下拉選單
    sel.innerHTML = "";
    for (const m of maps) {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.name || m.id;
      sel.appendChild(opt);
    }

    // 若 state.mapId 還沒設定，選第一張
    if (!state.mapId && maps.length) state.mapId = maps[0].id;

    // 套用選擇
    sel.value = state.mapId || (maps[0] ? maps[0].id : "");
    refreshDepthButtons();
    updateMapInfoText();
  };

  window.changeMap = function changeMap(mapId) {
    const state = getMapState();
    state.mapId = mapId;

    // 切地圖時深度回外圍（你也可改成保留）
    state.depth = "outer";

    refreshDepthButtons();
    updateMapInfoText();
  };

  window.selectMapDepth = function selectMapDepth(depth) {
    const state = getMapState();
    state.depth = depth;
    refreshDepthButtons();
    updateMapInfoText();
  };

  function refreshDepthButtons() {
    const state = getMapState();
    const btnOuter = document.getElementById("btnDepthOuter");
    const btnInner = document.getElementById("btnDepthInner");
    const btnCore  = document.getElementById("btnDepthCore");

    const setOn = (btn, on) => {
      if (!btn) return;
      btn.style.background = on ? "" : "#444";
    };

    setOn(btnOuter, state.depth === "outer");
    setOn(btnInner, state.depth === "inner");
    setOn(btnCore,  state.depth === "core");
  }

  function updateMapInfoText(extraLine) {
    const state = getMapState();
    const infoEl = document.getElementById("mapInfo");
    if (!infoEl) return;

    const mapDef = registry.get(state.mapId);
    if (!mapDef) {
      infoEl.textContent = "尚未載入地圖資料...";
      return;
    }

    const d = mapDef.depths?.[state.depth];
    if (!d) {
      infoEl.textContent = "深度資料不存在";
      return;
    }

    const base = `${d.label}：預期遭遇 ${d.min}~${d.max} 隻怪`;
    infoEl.innerHTML = extraLine ? `${base}<br>${extraLine}` : base;
  }

  // ------------------------------------------------------------
  // 4) 地圖探索：專用戰鬥入口（一次遭遇=範圍隨機複數怪）
  //    - 你現有戰鬥系統是單一 currentMonster
  //    - 所以我們用 queue：一次遭遇抽 N 隻，逐隻接力
  // ------------------------------------------------------------
  const mapBattle = {
    queue: [],
    encounterMeta: null,
    ignoreAutoRestartUntil: 0, // 用來吃掉「勝利後 setTimeout(startBattle)」的最後一次自動呼叫
  };
  window.__mapBattle = mapBattle; // 除錯用

  // 給 index.html 的 startBattle(map mode) 呼叫
  window.startMapBattle = async function startMapBattle() {
    // 安全檢查：如果正在戰鬥，不要重開（避免亂掉）
    if (typeof battleInterval !== "undefined" && battleInterval) return;

    await ensureMapScriptsLoaded();

    const state = getMapState();
    const mapDef = registry.get(state.mapId);
    if (!mapDef) {
      updateMapInfoText("❌ 找不到地圖定義，請確認有載入對應 js/maps 檔案");
      return;
    }

    // 產生一次遭遇（抽複數怪）
    const context = {
      // 你之後想用玩家等級影響抽怪，也能放這裡
      charLv: window.game?.charLv || 1,
    };

    let encounter;
    try {
      encounter = await mapDef.getEncounter(state.depth, context);
    } catch (e) {
      updateMapInfoText(`❌ 產生遭遇失敗：${e.message || e}`);
      return;
    }

    // encounter 期望長得像：{ count, monsterIds, mapId, depth } :contentReference[oaicite:6]{index=6}
    const ids = Array.isArray(encounter?.monsterIds) ? encounter.monsterIds : [];
    if (!ids.length) {
      updateMapInfoText("❌ 本次遭遇沒有抽到怪物（monsterIds 空）");
      return;
    }

    mapBattle.encounterMeta = encounter;
    mapBattle.queue = ids.map((id) => ({ mapId: encounter.mapId, monsterId: id }));
    updateMapInfoText(`✅ 遭遇成立：共 ${mapBattle.queue.length} 隻，開始接戰…`);

    // 開始第一隻
    startNextMapMonster();
  };

  // 給 index.html 的 startBattle(map mode, 勝利後自動呼叫) 用
  window.mapBattleStartNext = function mapBattleStartNext() {
    startNextMapMonster();
  };

  function startNextMapMonster() {
    // 吃掉「本次探索結束後」最後那一下自動 startBattle()
    if (Date.now() < mapBattle.ignoreAutoRestartUntil) return;

    if (!mapBattle.queue.length) {
      // 本次遭遇結束：停止戰鬥、回到可按「開始搜尋對手」
      mapBattle.encounterMeta = null;
      mapBattle.ignoreAutoRestartUntil = Date.now() + 2000; // 2 秒內忽略自動遞迴那一下
      if (typeof window.stopBattle === "function") {
        window.stopBattle("🗺️ 本次地圖探索結束");
      }
      updateMapInfoText("🧭 你可以再次點擊「開始搜尋對手」來觸發下一次探索。");
      return;
    }

    const next = mapBattle.queue.shift();
    const m = window.getMapMonster?.(next.mapId, next.monsterId); // 由你的 monsters 檔提供 :contentReference[oaicite:7]{index=7}
    if (!m) {
      // 找不到怪就跳過，繼續下一隻
      updateMapInfoText(`⚠️ 找不到怪物資料：${next.monsterId}（已跳過）`);
      return startNextMapMonster();
    }

    // 把 map 怪物轉成你現有戰鬥系統可吃的 currentMonster 格式
    // （你原本一般怪：{...selected, maxHp, curHp}；BOSS 額外 isBoss）:contentReference[oaicite:8]{index=8} :contentReference[oaicite:9]{index=9}
    const isBossLike = (next.monsterId === "ws_master") || m.isBoss;

    currentMonster = {
      ...m,
      maxHp: m.maxHp ?? m.hp,
      curHp: m.curHp ?? (m.maxHp ?? m.hp),
      isBoss: !!isBossLike,
      __fromMap: true,
      __mapId: next.mapId,
      __monsterId: next.monsterId,
    };

    // 進入戰鬥 UI（沿用你原本 startBattle/startBossBattle 的顯示邏輯）
    document.getElementById("battlePlayerImg").src = document.getElementById("avatarImg").src;
    document.getElementById("playerSideName").innerText = `【${document.getElementById("nameDisplay").innerText}】`;
    document.getElementById("bossImg").src = m.img || "";
    const left = mapBattle.queue.length;
    document.getElementById("mName").innerText =
      `🗺️ ${m.name} (Lv.${m.lv}) 　剩餘：${left} 隻`;

    document.getElementById("playerBattleArea").style.display = "block";
    document.getElementById("monsterArea").style.display = "block";
    document.getElementById("vsTitle").style.display = "block";
    document.getElementById("startBattleBtn").style.display = "none";
    document.getElementById("stopBattleBtn").style.display = "block";

    if (typeof window.updateBattleUI === "function") window.updateBattleUI();
    if (typeof window.updateBattleBuffs === "function") window.updateBattleBuffs();

    // 啟動 tick
    if (!battleInterval && typeof battleTick === "function") {
      battleInterval = setInterval(battleTick, 1000);
    }
  }

  // ------------------------------------------------------------
  // 5) 開頁初始化：如果玩家切到 map 模式會呼叫 renderMapControls()
  //    但保險起見也先預載一次（不會做任何 UI）
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    // 不強迫渲染，只預載地圖檔，避免第一次切換 map 模式卡住
    ensureMapScriptsLoaded().catch(console.error);
  });

})();
