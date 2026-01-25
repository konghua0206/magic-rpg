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
    
    // 受擊時執行的效果
    onBeingHit: (monster) => {
      // 1. 玩家端：生命恢復 (基礎 5% + 體質補正)
      const maxHp = typeof getTotalStat === 'function' ? getTotalStat('hp') : (game.hp || 100);
      const currentVit = typeof getTotalStat === 'function' ? getTotalStat('vit') : (game.vit || 0);
      let healAmt = Math.floor(maxHp * 0.05 + (currentVit * 0.5));
      
      if (typeof game !== 'undefined') {
        game.currentHp = Math.min(maxHp, (game.currentHp || 0) + healAmt);
      }

      // 2. 怪獸端：設置持續時間與狀態
      // 儲存原始攻擊力（如果尚未儲存）
      if (!monster.originalAtkRange) {
        monster.originalAtkRange = [...monster.atkRange];
      }

      // 設置 Debuff 屬性
      monster.lazyStatus = {
        duration: 3, // 持續 3 回合
        reduction: 0.75 // 剩餘 75% 攻擊力
      };

      // 立即套用效果 (防止攻擊歸零：始終基於原始值計算)
      monster.atkRange = [
        Math.floor(monster.originalAtkRange[0] * monster.lazyStatus.reduction),
        Math.floor(monster.originalAtkRange[1] * monster.lazyStatus.reduction)
      ];

      return { 
        success: true, 
        log: `<span style="color:#74b9ff">【廢人領域】觸發！回復 ${healAmt} HP，${monster.name} 陷入了懶散狀態 (持續 3 回合)！</span>` 
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