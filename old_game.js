// フィールドの大きさ
const FIELD_SIZE = 5;

// 各アイテムに対する上位アイテムを表すマッピング
const ITEM_UPGRADE_MAP = {
  wood1: "wood2",
  wood2: "wood3",
  wood3: "wood4",
  wood4: "house1",
  house1: "house2",
  house2: "building1",
  building1: "building2",
  building2: "building3",
  building3: "building4",
  building4: "building5",
  building5: "building6",
  stone1: "stone2",
  stone2: "stone3",
  stone3: "treasure",
};

// アイテムのリスト
const ITEMS = [
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood1",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood2",
  "wood3",
  "wood3",
  "wood4",
  "house1",
  "stone1",
  "stone2",
];
const RARE_ITEMS = ["house2"];

// 探索するための4つの方向（上、下、左、右）
const DIRECTIONS = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
];

// フィールドの初期化
let field = Array.from({ length: FIELD_SIZE }, () =>
  Array(FIELD_SIZE).fill(null)
);

// アイテムバックの初期化
let itemBack = [null, null];

// ターン数の初期化
let turn = 0;

// フィールドを表示する
function displayField() {
  let container = document.getElementById("grid-container");
  if (container.children.length === 0) {
    // 初回描画時のみマスを作成
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        let gridItem = document.createElement("div");
        gridItem.className = "grid-item";
        gridItem.onclick = function () {
          placeItem(i, j);
        };
        container.appendChild(gridItem);
      }
    }
  }
  // マスの内容とonclickイベントを更新
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      let gridItem = container.children[i * field.length + j];
      gridItem.innerText = field[i][j] ? field[i][j] : "";
      gridItem.onclick = function () {
        placeItem(i, j);
      };
    }
  }
}

// ランダムなアイテムを生成する関数
function generateItem() {
  let randomIndex;
  if (turn > 300 && Math.random() < 0.01) {
    // 1%の確率でwood5を生成
    randomIndex = Math.floor(Math.random() * RARE_ITEMS.length);
    return RARE_ITEMS[randomIndex];
  } else {
    randomIndex = Math.floor(Math.random() * ITEMS.length);
    return ITEMS[randomIndex];
  }
}

// ランダムに生成されたアイテムを任意の場所に配置する関数
let currentItem = generateItem();
let nextItem = generateItem();
function updateItems() {
  currentItem = nextItem;
  nextItem = generateItem();
  document.getElementById("current-item").innerText =
    "Current Item: " + currentItem;
  document.getElementById("next-item").innerText = "Next Item: " + nextItem;
}

// アイテムをフィールドに配置する関数
function placeItem(i, j) {
  if (currentItem && field[i][j] === null) {
    field[i][j] = currentItem;
    currentItem = null;
    displayField();
    updateItems();
    turn++;

    checkAndMerge();
  }
}

// マージ対象となるアイテムを一つにまとめる
function mergeItems(matchingCells) {
  let lastIndex = matchingCells.length - 1;
  let [i, j] = matchingCells[lastIndex];
  let item = field[i][j];

  if (ITEM_UPGRADE_MAP[item]) {
    field[i][j] = ITEM_UPGRADE_MAP[item];
  }

  for (let k = 0; k < lastIndex; k++) {
    field[matchingCells[k][0]][matchingCells[k][1]] = null;
  }

  displayField();
}

// 指定した座標から始まる同じアイテムが連続している部分を探し、それらの座標を返す関数
function checkMatching(i, j, currentItem, visited, matchingCells) {
  if (
    i < 0 ||
    j < 0 ||
    i >= FIELD_SIZE ||
    j >= FIELD_SIZE ||
    visited[i][j] ||
    field[i][j] !== currentItem
  ) {
    return false;
  }

  visited[i][j] = true;
  matchingCells.push([i, j]);

  for (let dir of DIRECTIONS) {
    checkMatching(i + dir[0], j + dir[1], currentItem, visited, matchingCells);
  }

  return true;
}

// 同じアイテムが連続するところを探してマージする
function checkAndMerge() {
  let visited = Array.from({ length: FIELD_SIZE }, () =>
    Array(FIELD_SIZE).fill(false)
  );
  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (field[i][j] !== null && !visited[i][j]) {
        let matchingCells = [];
        let isMatching = checkMatching(
          i,
          j,
          field[i][j],
          visited,
          matchingCells
        );
        if (isMatching && matchingCells.length >= 3) {
          mergeItems(matchingCells);
        }
      }
    }
  }
}

// 初期表示
displayField();
updateItems();
