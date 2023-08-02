// アイテムのリスト
let allItems = [
  "wood1",
  "wood2",
  "wood3",
  "wood4",
  "house1",
  "house2",
  "building1",
  "building2",
  "building3",
  "building4",
  "building5",
  "building6",
  "stone1",
  "stone2",
  "stone3",
  "treasure",
];

// アイテムのリスト
let items = [
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
let rareItems = ["house2"];

// フィールドの初期化
let field = Array.from({ length: 5 }, () => Array(5).fill(null));

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
    randomIndex = Math.floor(Math.random() * rareItems.length);
    return rareItems[randomIndex];
  } else {
    randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
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
  }
}

// ゲームオーバーの条件をチェックする関数
function checkGameOver() {
  // フィールド上に空きがない場合、ゲームオーバー
  if (!field.includes(null)) {
    alert("Game Over");
    // ゲームをリセット
    field.fill(null);
    itemBack = [null, null];
    displayField();
  }
}

// アイテムをマージする関数
function mergeItems(position) {
  let item = field[position];
  if (item !== null) {
    if (item.includes("wood")) {
      let level = parseInt(item.slice(4));
      if (level < 7) {
        field[position] = "wood" + (level + 1).toString();
      }
    } else if (item.includes("stone")) {
      let level = parseInt(item.slice(5));
      if (level < 3) {
        field[position] = "stone" + (level + 1).toString();
      } else {
        field[position] = "treasure";
      }
    }
  }
}

// アイテムをアイテムバックに保持する関数
function holdItem(position) {
  if (field[position] !== null && itemBack[0] === null) {
    itemBack[0] = field[position];
    field[position] = null;
    displayField();
  } else if (field[position] !== null && itemBack[1] === null) {
    itemBack[1] = field[position];
    field[position] = null;
    displayField();
  } else {
    alert("Cannot hold item");
  }
}

// アイテムバックのアイテムをフィールドに配置する関数
function placeItemFromBack(position) {
  if (field[position] === null && itemBack[0] !== null) {
    field[position] = itemBack[0];
    itemBack[0] = null;
    displayField();
  } else if (field[position] === null && itemBack[1] !== null) {
    field[position] = itemBack[1];
    itemBack[1] = null;
    displayField();
  } else {
    alert("Cannot place item from back");
  }
}

// アイテムをスワップする関数
function swapItems(position1, position2) {
  let temp = field[position1];
  field[position1] = field[position2];
  field[position2] = temp;
  displayField();
}

// アイテムを破壊する関数
function destroyItem(position) {
  if (field[position] !== null) {
    field[position] = null;
    displayField();
  }
}

// クレーンを使用する関数
function useCrane(position) {
  // ここでは、クレーンが指定した位置とその隣接する位置のアイテムをマージすると仮定します。
  mergeItems(position);
  if (position > 0) {
    mergeItems(position - 1);
  }
  if (position < field.length - 1) {
    mergeItems(position + 1);
  }
  displayField();
}

// ランダムに生成されたアイテムとアイテムバックに保持しているアイテムを交換してマスに置く関数
function exchangeAndPlace(position) {
  if (field[position] !== null && itemBack[0] !== null) {
    let temp = field[position];
    field[position] = itemBack[0];
    itemBack[0] = temp;
    displayField();
  } else if (field[position] !== null && itemBack[1] !== null) {
    let temp = field[position];
    field[position] = itemBack[1];
    itemBack[1] = temp;
    displayField();
  }
}

// 3つが連続で連なったかどうかの判定ロジック
function checkThreeInARow() {
  for (let i = 0; i < field.length - 2; i++) {
    if (
      field[i] !== null &&
      field[i] === field[i + 1] &&
      field[i] === field[i + 2]
    ) {
      return true;
    }
  }
  return false;
}

// 初期表示
displayField();
updateItems();
