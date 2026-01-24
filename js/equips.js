// 稀有度定義：0:普通, 1:稀有, 2:史詩, 3:傳奇
const itemDatabase = {
// --- 武器類 ---
  "wooden_staff": {
    name: "古老木杖",type: "mainHand",rarity: 1,atk: 15,def: 0,hp: 0,
    icon: "🗡️",img: "images/equips/wooden_staff.png",
    desc: "充滿森林氣息的短杖。"
  },
  "dragon_slayer": {
    name: "屠龍大劍",type: "mainHand",rarity: 3,atk: 120,def: 20,hp: 50,
    icon: "🗡️",img: "images/equips/dragon_slayer.png",
    desc: "劍身依稀能聽見巨龍的哀鳴。"
  },

  // --- 防具類 ---
  "shadow_cloak": {
    name: "幽影斗篷",type: "top",rarity: 2,atk: 5,def: 35,hp: 100,
    icon: "🧥",img: "images/equips/shadow_cloak.png",
    desc: "穿上後彷彿遁入陰影之中。"
  },

  // --- 飾品類 ---
  "mana_ring": {
    name: "魔力源泉戒指",type: "ring1",rarity: 2,atk: 25,def: 5,hp: 0,
    icon: "💍",img: "images/equips/mana_ring.png",
    desc: "緩緩流動著純淨的魔力。"
  }
};

/**
 * 輔助函式：從數據庫生成一個實體裝備物件
 * @param {string} itemId - 數據庫中的 Key
 * @returns {Object} 完整的裝備實例
 */
function createEquipFromDB(itemId) {
    const template = itemDatabase[itemId];
    if (!template) return null;
    
    // 使用解構賦值確保資料不被污染，並加上唯一的 ID
    return {
        ...template,
        id: Date.now() + Math.random(),
        key: itemId // 保留 key 方便日後追蹤
    };
}