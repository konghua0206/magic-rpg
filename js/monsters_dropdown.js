// 地區資料數據庫
const regionData = [
    { name: "新手森林 (Lv.1+)", value: "新手森林" },
    { name: "墮落遺蹟 (Lv.10+)", value: "墮落遺蹟" },
    { name: "幽影深淵 (Lv.25+)", value: "幽影深淵" },
    { name: "灼熱熔岩區 (Lv.35+)", value: "灼熱熔岩區" },
    { name: "極北凍原 (Lv.50+)", value: "極北凍原" },
    { name: "天空島嶼 (Lv.65+)", value: "天空島嶼" }
];

// 渲染選單的函式
function renderRegionDropdown() {
    const select = document.getElementById('regionSelect');
    if (!select) return;
    
    // 清空舊內容並重新生成
    select.innerHTML = regionData.map(reg => 
        `<option value="${reg.value}">${reg.name}</option>`
    ).join('');
}