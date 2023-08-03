// Constants
const FIELD_SIZE = 5;
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
const ITEMS = [
  ...Array(14).fill("wood1"),
  ...Array(12).fill("wood2"),
  "wood3",
  "wood3",
  "wood4",
  "house1",
  "stone1",
  "stone2",
];
const RARE_ITEMS = ["house2"];
const DIRECTIONS = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
];

// Helper Functions
const generateRandomIndex = (items) => Math.floor(Math.random() * items.length);
const isRareItem = (turn) => turn > 300 && Math.random() < 0.01;

// Field Operations
const generateField = (size) =>
  Array.from({ length: size }, () => Array(size).fill(null));
const isFieldCellEmpty = (field, i, j) => field[i][j] === null;

// Items Operations
const generateItem = (turn) => {
  const items = isRareItem(turn) ? RARE_ITEMS : ITEMS;
  const randomIndex = generateRandomIndex(items);
  return items[randomIndex];
};
class Game {
  constructor() {
    this.field = generateField(FIELD_SIZE);
    this.turn = 0;
    this.currentItem = generateItem(this.turn);
    this.nextItem = generateItem(this.turn);
    this.displayField();
    this.updateItems();
  }

  // フィールドを表示する
  displayField() {
    let container = document.getElementById("grid-container");
    if (container.children.length === 0) {
      // 初回描画時のみマスを作成
      for (let i = 0; i < this.field.length; i++) {
        for (let j = 0; j < this.field[i].length; j++) {
          let gridItem = document.createElement("div");
          gridItem.className = "grid-item";
          gridItem.onclick = () => {
            this.placeItem(i, j);
          };
          container.appendChild(gridItem);
        }
      }
    }
    // マスの内容とonclickイベントを更新
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        let gridItem = container.children[i * this.field.length + j];
        gridItem.innerText = this.field[i][j] ? this.field[i][j] : "";
        gridItem.onclick = () => {
          this.placeItem(i, j);
        };
      }
    }
  }

  // マージ対象となるアイテムを一つにまとめる
  mergeItems(matchingCells) {
    let lastIndex = matchingCells.length - 1;
    let [i, j] = matchingCells[lastIndex];
    let item = this.field[i][j];

    if (ITEM_UPGRADE_MAP[item]) {
      this.field[i][j] = ITEM_UPGRADE_MAP[item];
    }

    for (let k = 0; k < lastIndex; k++) {
      this.field[matchingCells[k][0]][matchingCells[k][1]] = null;
    }

    this.displayField();
  }

  // 指定した座標から始まる同じアイテムが連続している部分を探し、それらの座標を返す関数
  checkMatching(i, j, currentItem, visited, matchingCells) {
    if (
      i < 0 ||
      j < 0 ||
      i >= FIELD_SIZE ||
      j >= FIELD_SIZE ||
      visited[i][j] ||
      this.field[i][j] !== currentItem
    ) {
      return false;
    }

    visited[i][j] = true;
    matchingCells.push([i, j]);

    for (let dir of DIRECTIONS) {
      this.checkMatching(
        i + dir[0],
        j + dir[1],
        currentItem,
        visited,
        matchingCells
      );
    }

    return true;
  }

  // 同じアイテムが連続するところを探してマージする
  checkAndMerge() {
    let visited = Array.from({ length: FIELD_SIZE }, () =>
      Array(FIELD_SIZE).fill(false)
    );
    for (let i = 0; i < FIELD_SIZE; i++) {
      for (let j = 0; j < FIELD_SIZE; j++) {
        if (this.field[i][j] !== null && !visited[i][j]) {
          let matchingCells = [];
          let isMatching = this.checkMatching(
            i,
            j,
            this.field[i][j],
            visited,
            matchingCells
          );
          if (isMatching && matchingCells.length >= 3) {
            this.mergeItems(matchingCells);
          }
        }
      }
    }
  }

  // アイテムを更新する関数
  updateItems() {
    this.currentItem = this.nextItem;
    this.nextItem = generateItem(this.turn);
    document.getElementById("current-item").innerText =
      "Current Item: " + this.currentItem;
    document.getElementById("next-item").innerText =
      "Next Item: " + this.nextItem;
  }

  // アイテムをフィールドに配置する関数
  placeItem(i, j) {
    if (this.currentItem && isFieldCellEmpty(this.field, i, j)) {
      this.field[i][j] = this.currentItem;
      this.currentItem = null;
      this.displayField();
      this.updateItems();
      this.turn++;

      this.checkAndMerge();
    }
  }
}

// インスタンスを作成
const game = new Game();

// 初期表示
game.displayField();
game.updateItems();
