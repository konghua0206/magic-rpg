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