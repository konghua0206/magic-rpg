const equipSkillsDB = {
  "靈魂尖叫": {
    name: "靈魂尖調",
    desc: "裝備特效：攻擊時有機率發出靈魂尖叫，造成基於智力 250% 的無視防禦傷害。",
    chance: 0.15, 
    color: "#a29bfe", 
    glowColor: "rgba(162, 155, 254, 0.8)", 
    icon: "images/equip/CHS_it_eq_hayate_acce.png", 
    
    // 技能效果邏輯
    onEffect: (stats, monster) => {
      const currentInt = typeof getTotalStat === 'function' ? getTotalStat('int') : (game.int || 0);
      
      const multiplier = 2.5;
      const dmg = Math.max(1, Math.floor(currentInt * multiplier)); 
      
      return { 
        dmg: dmg, 
        log: `發出刺耳的靈魂尖叫，震懾了怪物的精神，造成 <span style="color:#a29bfe">${dmg}</span> 點無視防禦傷害！` 
      };
    }
  },

  "可樂噴射": {
    name: "可樂噴射",
    desc: "裝備特效：攻擊時 15% 機率引發氣體爆發，造成基於 (智力+幸運) 500% 的混合傷害。",
    chance: 0.15,
    color: "#fab1a0",
    glowColor: "rgba(250, 177, 160, 0.8)",
    icon: "images/equip/CHS_it_eq_cri_hammer.png", 
    onEffect: (stats, monster) => {
      // 遵循備忘錄 1 & 2：數值來源優先級與 || 0 保路
      const pInt = (stats && stats.int) || (typeof getTotalStat === 'function' ? getTotalStat('int') : 0) || 0;
      const pLuk = (stats && stats.luk) || (typeof getTotalStat === 'function' ? getTotalStat('luk') : 0) || 0;
      const mDef = (monster && monster.def) || 0;

      const multiplier = 5.0;
      let skillAtk = (pInt + pLuk) * multiplier;
      
      // 遵循備忘錄 6：正常減傷公式
      const effectiveDef = mDef * 0.7;
      let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + effectiveDef + 1)));
      
      return { 
        dmg: dmg, 
        log: `🥤 <span style="color:#fab1a0">【可樂噴射】</span>！氣體爆裂造成了 <span style="color:#ff4d4d">${dmg}</span> 點傷害！` 
      };
    }
  },
  
  "深夜零食時間": {
    name: "深夜零食時間",
    desc: "裝備特效：攻擊時 10% 機率恢復 10% 最大生命值，並固定增加魔力。",
    chance: 0.10,
    color: "#55efc4",
    glowColor: "rgba(85, 239, 196, 0.8)",
    icon: "images/equip/CHS_it_eq_cri_hammer.png", 
    onEffect: (stats, monster) => {
      // 1. 取得最大血量，確保絕對有數字
      const maxHp = (typeof getTotalStat === 'function' ? getTotalStat('hp') : (game.hp || 100)) || 100;
      
      // 2. 改為簡單的固定比例：最大血量的 10% + 等級加成
      const healAmt = Math.floor(maxHp * 0.10) + ((game.lv || 1) * 5); 
      
      // 3. 固定魔力回報 (不依賴複雜屬性)
      const manaGain = 100 + ((game.lv || 1) * 10);
      
      return { 
        dmg: 0, 
        heal: healAmt, 
        manaGain: manaGain, 
        log: `🍟 <span style="color:#55efc4">【深夜零食時間】</span>！恢復了 <span style="color:#2ecc71">${healAmt}</span> HP！` 
      };
    }
  },
  
  "懶散光束": {
    name: "懶散光束",
    desc: "裝備特效：12% 機率造成智力 300% 以上的無視防禦傷害。",
    chance: 0.12,
    color: "#ff7675",
    glowColor: "rgba(255, 118, 117, 0.8)",
    icon: "images/equip/CHS_it_eq_cri_hammer.png", 
    onEffect: (stats, monster) => {
      const pInt = (stats && stats.int) || (typeof getTotalStat === 'function' ? getTotalStat('int') : 0) || 0;
      const pVit = (stats && stats.vit) || (typeof getTotalStat === 'function' ? getTotalStat('vit') : 0) || 0;
      
      const multiplier = 3.0 + (pVit / 200);
      
      // 遵循備忘錄 6：無視防禦計算
      let dmg = Math.max(1, Math.floor(pInt * multiplier * 1.5));
      
      return { 
        dmg: dmg, 
        log: `💤 <span style="color:#ff7675">【懶散光束】</span>！造成了 <span style="color:#ff4d4d">${dmg}</span> 點真理傷害！` 
      };
    }
  },

  "重擊": {
    name: "重擊",
    desc: "裝備特效：攻擊時有機率發動重擊，造成 140% 的物理傷害。",
    chance: 0.2,
    color: "#e67e22",
    glowColor: "rgba(230, 126, 34, 0.8)",
    icon: "images/skill/heavy_strike.png",
    onEffect: (stats, monster) => {
      const multiplier = 1.4;
      // 參考火球術的防禦減傷公式
      let dmg = Math.max(1, Math.floor((stats.atk * multiplier * stats.atk * multiplier) / (stats.atk * multiplier + monster.def)));
      return { 
        dmg: dmg, 
        log: `武器發出沉重的一擊，造成了 <span style="color:#e67e22">${dmg}</span> 傷害！` 
      };
    }
  }
};

/**
 * ⚔️ 技能設計與數值調用開發備忘錄 (Skill Design Memo)
 * -----------------------------------------------------------
 * 目的：避免戰鬥中出現 NaN (Not a Number) 或數值丟失。
 */

/* 1. 【數值來源優先級】
     在技能的 onEffect(stats, monster) 中，優先級如下：
     A. 直接調用：getTotalStat('int') -> 最安全，包含角色與裝備基礎值。
     B. 戰鬥包：stats.int -> 包含戰鬥中「臨時加成」（如百分比 Buff）。
     
     建議寫法：
     const playerInt = (stats && stats.int) || getTotalStat('int') || 0;
*/

/* 2. 【預防 NaN 的金律】
     JavaScript 中：undefined * 數字 = NaN。
     當你無法保證某個屬性一定存在時，永遠加上 「|| 0」。
     
     ❌ 錯誤寫法：const dmg = stats.int * 2.5;
     ✅ 正確寫法：const dmg = (stats.int || 0) * 2.5;
*/

/* 3. 【維度屬性對照表】
     確保在調用時名稱完全一致（小寫）：
     - str: 力量 (Strength)
     - agi: 敏捷 (Agility)
     - int: 智力 (Intelligence)
     - vit: 體質 (Vitality)
     - luk: 幸運 (Luck)
     - med: 冥想 (Meditation)
*/

/* 4. 【裝備被動加成 (Passives) 注意事項】
     在計算 stats.int *= (1 + p.battleStats.intMulti) 時：
     - 必須確保 p.battleStats.intMulti 存在。
     - 如果某個裝備只加 atkMulti，則 intMulti 為 undefined。
     
     ✅ 建議邏輯：
     if (p.battleStats.intMulti) { 
         stats.int = (stats.int || 0) * (1 + p.battleStats.intMulti); 
     }
*/

/* 5. 【技能回傳格式規範】
     onEffect 必須回傳一個物件，包含：
     - dmg: 傷害數值 (Number)
     - log: 顯示在日誌的 HTML 字串 (String)
     - heal: (選填) 治療數值
     
     範例模板：
     onEffect: (stats, monster) => {
         const val = (stats.int || getTotalStat('int')) * 2.5;
         return {
             dmg: Math.floor(val),
             log: `造成了 ${Math.floor(val)} 點傷害`
         };
     }
*/

/* 6. 【無視防禦 vs 正常減傷】
     - 無視防禦：直接扣除 monster.curHp。
     - 正常減傷：Math.max(1, (playerAtk * playerAtk) / (playerAtk + monster.def))。
     設計技能時需明確選擇使用哪一種公式。
*/


console.log("✅ 技能系統備忘錄載入完成，開發時請遵循數值安全檢查。");

