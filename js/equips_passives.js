const equipPassivesDB = {
  "曼德拉": {  
    name: "曼德拉的共鳴",
    desc: "受攻擊時有機率使敵人防禦下降 10%",
    chance: 0.25, // 設定觸發機率為 25%
    color: "#a29bfe",
    // 新增：受擊時執行的效果
    onBeingHit: (monster) => {
      if (!monster.originalDef) {
        monster.originalDef = monster.def; // 紀錄原始防禦力
      }
      // 降低防禦 10%
      monster.def = Math.floor(monster.def * 0.9);
      return { 
        success: true, 
        log: `<span style="color:#a29bfe">【曼德拉的共鳴】觸發！${monster.name} 的防禦力下降了 10%！</span>` 
      };
    }
  },

  "懶惰者": {
  name: "廢人領域",
  desc: "裝備特效：受攻擊時 20% 機率恢復生命，並使敵人進入 3 回合的「懶散」狀態 (攻擊力下降 25%)。",
  chance: 0.2,
  color: "#74b9ff",

  onBeingHit: (monster) => {
    // 正確最大血量（關鍵修正）
    const maxHp = (typeof getMaxHp === "function")
      ? getMaxHp()
      : (typeof getCombatStats === "function" ? (getCombatStats().maxHp || 100) : (game.hp || 100));

    const currentVit = (typeof getTotalStat === "function")
      ? getTotalStat("vit")
      : (game.vit || 0);

    // 回血：基礎 5% + 體質補正
    const healAmt = Math.floor(maxHp * 0.05 + (currentVit * 0.5));

    // 只做「加血」，避免任何夾低行為
    const before = Math.floor(Number(game.currentHp) || 0);
    const next = before + healAmt;

    game.currentHp = Math.min(maxHp, next);

    // -------------------------
    // 怪物端：懶散 debuff（不改 battle logic 的前提下，維持你原本做法）
    // -------------------------
    if (monster) {
      // 儲存原始 atkRange（只存一次）
      if (!monster.originalAtkRange && Array.isArray(monster.atkRange)) {
        monster.originalAtkRange = [...monster.atkRange];
      }

      monster.lazyStatus = {
        duration: 3,
        reduction: 0.75
      };

      // 立即套用（基於 originalAtkRange，不會越疊越低）
      if (monster.originalAtkRange && Array.isArray(monster.originalAtkRange)) {
        monster.atkRange = [
          Math.max(1, Math.floor(monster.originalAtkRange[0] * monster.lazyStatus.reduction)),
          Math.max(1, Math.floor(monster.originalAtkRange[1] * monster.lazyStatus.reduction))
        ];
      }
    }

    return {
      success: true,
      log: `<span style="color:#74b9ff">【廢人領域】觸發！回復 ${healAmt} HP，${monster?.name || "敵人"} 陷入了懶散狀態 (持續 3 回合)！</span>`
    };
  }
},

  "龍鱗": {
    name: "龍血護體",
    battleStats: { defMulti: 0.25 },
    color: "#e67e22"
  },
  "吸血鬼": {
    name: "生命偷取",
    chance: 0.2,
    color: "#ff0000",
    onEffect: (stats, monster) => {
        const dmg = Math.floor(stats.atk * 0.5);
        const heal = Math.floor(dmg * 0.3); // 吸取傷害的 30%
        game.currentHp = Math.min(game.maxHp, game.currentHp + heal); // 執行治療
        return { dmg: dmg, log: `吸取了 ${heal} 點生命！` };
    }
  },
  "荊棘": {
    name: "荊棘反彈",
    chance: 1.0, // 100% 反彈
    color: "#2ecc71",
    onBeingHit: (monster) => {
        const reflectDmg = 50; 
        monster.curHp -= reflectDmg;
        return { success: true, log: `反彈了 ${reflectDmg} 點傷害！` };
    }
  }

};
