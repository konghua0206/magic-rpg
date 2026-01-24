// BOSS數據庫
const bossData = [
  { 
    id: "boss_1", name: "森林之王 · 巨角鹿", lv: 10, hp: 2500, def: 30, 
    atkRange: [25, 45], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "古老鹿角", rewardMana: 3000 
  },
{
  id: "boss_mandrake_1",
  name: "腹黑曼德拉草",
  isBoss: true,
  lv: 15,
  hp: 4500,
  maxHp: 4500,
  def: 45,
  atkRange: [35, 60],
  img: "images/4SqKRuaqPjZlQHLEhZkmBK.jpg",
  dropMat: "曼德拉葉片",
  rewardMana: 5000,

  // --- 死亡結算邏輯 ---
  onDeath: function(currentMonster) {
    let drops = [];
    
    // 1. 專屬裝備 (30%)
    if (Math.random() < 0.3) {
      const equip = createUniqueItem("mandrake_talisman", currentMonster.lv);
      if (equip) {
        drops.push(equip);
      } else {
        console.error("❌ 專屬裝備生成失敗：請檢查 uniqueItemTemplates 中是否有 'mandrake_talisman' 這個 ID");
      }
    }

    // 2. 隨機裝備 (10%)
    if (Math.random() < 0.1) {
      const randomEquip = generateRandomEquip(currentMonster.lv);
      if (randomEquip) {
        // Boss 掉落保底：至少為稀有度 1
        if (randomEquip.rarity < 1) randomEquip.rarity = 1;
        drops.push(randomEquip);
      }
    }

    return drops;
  },

  // --- 戰鬥技能數據 ---
  skills: [
    {
      name: "曼德拉搗蛋",
      chance: 0.2,
      color: "#e67e22",
      onEffect: (mBaseAtk, stats) => {
        const power = 1.5;
        let skillAtk = mBaseAtk * power;
        // 考慮防禦的傷害計算
        let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + (stats.def || 0))));
        return { 
          dmg: dmg, 
          heal: 0, 
          log: `使用了<span style="color:#e67e22">【曼德拉搗蛋】</span>，造成了 <span style="color:#e74c3c">${dmg}</span> 傷害！` 
        };
      }
    },
    {
      name: "曼德拉遁地",
      chance: 0.1,
      color: "#2ecc71",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 回復 BOSS 最大血量的 10%
        let healAmt = Math.floor((currentMonster.maxHp || 4500) * 0.1);
        return { 
          dmg: 0, 
          heal: healAmt, 
          log: `使用了<span style="color:#2ecc71">【曼德拉遁地】</span>，回復了 <span style="color:#2ecc71">${healAmt}</span> HP！` 
        };
      }
    }
  ]
},
  { 
    id: "boss_2", name: "遺蹟守護者", lv: 20, hp: 8000, def: 65, 
    atkRange: [50, 80], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "守護者核心", rewardMana: 8000 
  },
  { 
    id: "boss_3", name: "深淵恐懼 · 納迦", lv: 35, hp: 28000, def: 130, 
    atkRange: [130, 210], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "深淵靈魂", rewardMana: 25000 
  },
  { 
    id: "boss_4", name: "烈焰巨龍 · 阿格尼", lv: 45, hp: 65000, def: 220, 
    atkRange: [250, 400], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "不滅火種", rewardMana: 60000 
  },
  { 
    id: "boss_5", name: "極北霜狼 · 芬里爾", lv: 60, hp: 150000, def: 450, 
    atkRange: [550, 800], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "冰封王冠", rewardMana: 150000 
  },
  { 
    id: "boss_6", name: "天空主宰 · 獅鷲獸", lv: 75, hp: 450000, def: 900, 
    atkRange: [1200, 1800], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "風暴羽翼", rewardMana: 500000 
  },
  { 
    id: "boss_7", name: "墮落神官 · 墨菲斯托", lv: 80, hp: 1200000, def: 2500, 
    atkRange: [3500, 5000], img: "images/dKH0NvpuvTolvO8P2rypx.jpg",
    dropMat: "墮落碎片", rewardMana: 2000000 
  }, 
  { 
  id: "boss_mandrake_ascended", 
  name: "次元歸來 · 腹黑曼德拉皇", 
  lv: 90, 
  hp: 25000000, // 兩千五百萬 HP，符合後期 BOSS 門檻
  def: 8500, 
  atkRange: [45000, 72000], 
  img: "images/4SqKRuaqPjZlQHLEhZkmBK.jpg", 
  dropMat: "時空曼德拉根鬚", 
  rewardMana: 15000000, // 1500萬魔力獎勵
  // BOSS 專屬技能程序化
  skills: [
    { 
      name: "因果律搗蛋", 
      chance: 0.25, 
      color: "#9b59b6", // 紫色，象徵時空能量
      onEffect: (mBaseAtk, stats) => {
        // 穿越歸來的力量：3 倍攻擊，並附加無視防禦的因果傷害
        const power = 3.0;
        let skillAtk = mBaseAtk * power;
        let baseDmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def)));
        let piercingDmg = Math.floor(skillAtk * 0.2); // 附加 20% 攻擊力的無視防禦傷害
        let totalDmg = baseDmg + piercingDmg;
        return { 
          dmg: totalDmg, 
          heal: 0,
          log: `發動時空打擊<span style="color:#9b59b6">【因果律搗蛋】</span>，扭曲現實造成 <span style="color:#e74c3c">${totalDmg}</span> 傷害！` 
        };
      }
    },
    { 
      name: "次元裂縫遁走", 
      chance: 0.15, 
      color: "#34495e",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 穿越者的恢復：回復最大血量的 15%，並隨等級成長
        let healAmt = Math.floor(currentMonster.hp * 0.15);
        return { 
          dmg: 0, 
          heal: healAmt,
          log: `遁入<span style="color:#34495e">【次元裂縫】</span>避開了因果，瞬間恢復 <span style="color:#2ecc71">${healAmt}</span> HP！` 
        };
      }
    },
    {
      name: "萬根歸宗", 
      chance: 0.05, 
      color: "#e74c3c",
      onEffect: (mBaseAtk, stats, currentMonster, playerCurrentHp) => {
        // 奧義：造成玩家當前血量 50% 的真實傷害（最少不低於 BOSS 基礎攻擊）
        let gravityDmg = Math.max(mBaseAtk * 2, Math.floor(playerCurrentHp * 0.5));
        return { 
          dmg: gravityDmg, 
          heal: 0,
          log: `釋放穿越禁術<span style="color:#e74c3c">【萬根歸宗】</span>，抽取世界線力量造成 <span style="color:#c0392b">${gravityDmg}</span> 點絕對衝擊！` 
        };
      }
    }
  ]
},
{ 
  id: "boss_shark_liver", 
  name: "公鯊小心肝", 
  lv: 95, 
  hp: 3800000, 
  def: 6500, 
  atkRange: [9000, 14000], 
  img: "images/2Q.png", 
  dropMat: "小心肝的精華", 
  rewardMana: 5000000,
  // 內部狀態追蹤：是否已幻化
  isTransformed: false,
  skills: [
    { 
      name: "巨鯊幻化", 
      chance: 0.2, 
      color: "#3498db",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 設定幻化狀態
        currentMonster.isTransformed = true; 
        return { 
          dmg: 0, 
          log: `<span style="color:#3498db">幻化成鯊魚，攻擊力大幅提升了！</span> (接下來的攻擊將更致命)` 
        };
      }
    },
    { 
      name: "心肝撞擊", 
      chance: 0.2, 
      color: "#e74c3c",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 判定：若已幻化傷害 2.5 倍，否則只有 1.2 倍
        const power = currentMonster.isTransformed ? 2.5 : 1.2;
        let skillAtk = mBaseAtk * power;
        let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def)));
        
        // 攻擊後解除幻化狀態（或者你可以移除這一行讓它一直強下去）
        currentMonster.isTransformed = false;

        return { 
          dmg: dmg, 
          log: `針對肝臟進行撞擊！造成了 <span style="color:#ff4d4d">${dmg}</span> 傷害！${power > 2 ? '<b>(幻化加成！)</b>' : ''}` 
        };
      }
    },
    { 
      name: "狗鯊召喚", 
      chance: 0.1, 
      color: "#95a5a6",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 混合型技能：造成 1.0 倍傷害並回復 5% 生命
        let dmg = Math.max(1, Math.floor((mBaseAtk * mBaseAtk) / (mBaseAtk + stats.def)));
        let healAmt = Math.floor(currentMonster.hp * 0.05);
        return { 
          dmg: dmg,
          heal: healAmt,
          log: `召喚了大量狗鯊助陣！造成 ${dmg} 傷害並共同分食回復了 <span style="color:#2ecc71">${healAmt.toLocaleString()}</span> HP！` 
        };
      }
    }
  ]
},
{ 
  id: "boss_final_1", 
  name: "埋まるです", 
  lv: 100, 
  hp: 5000000, 
  def: 8000, 
  atkRange: [12000, 18000], 
  img: "images/p1nVQhClPae02nucYwaa4.jpg", 
  dropMat: "神聖遺物", 
  rewardMana: 10000000,
  // BOSS 專屬技能程序化版本
  skills: [
    { 
      name: "懶散光束", 
      chance: 0.2, 
      color: "#ff7675",
      onEffect: (mBaseAtk, stats) => {
        const power = 1.5;
        let skillAtk = mBaseAtk * power;
        let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def)));
        return { 
          dmg: dmg, 
          log: `使用了<span style="color:#ff7675">【懶散光束】</span>，雖然看起來很懶散但威力驚人，造成了 <span style="color:#ff4d4d">${dmg}</span> 傷害！` 
        };
      }
    },
    { 
      name: "可樂噴射", 
      chance: 0.15, 
      color: "#fab1a0",
      onEffect: (mBaseAtk, stats) => {
        const power = 2.5;
        let skillAtk = mBaseAtk * power;
        let dmg = Math.max(1, Math.floor((skillAtk * skillAtk) / (skillAtk + stats.def)));
        return { 
          dmg: dmg, 
          log: `瘋狂搖晃可樂瓶後發動<span style="color:#fab1a0">【可樂噴射】</span>！氣體爆發造成了 <span style="color:#ff4d4d">${dmg}</span> 傷害！` 
        };
      }
    },
    { 
      name: "深夜零食時間", 
      chance: 0.1, 
      color: "#55efc4",
      onEffect: (mBaseAtk, stats, currentMonster) => {
        // 回復 20% 生命值
        let healAmt = Math.floor(currentMonster.hp * 0.2);
        return { 
          heal: healAmt, 
          log: `進入了<span style="color:#55efc4">【深夜零食時間】</span>，大口吃起洋芋片回復了 <span style="color:#2ecc71">${healAmt.toLocaleString()}</span> HP！` 
        };
      }
    }
  ]
}

];
