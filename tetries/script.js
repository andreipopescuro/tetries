// const boxes = document.querySelectorAll(".box");
const gameTable = document.querySelector(".game-table");
let boxes = [...document.querySelectorAll(".box")];
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");

const width = 10;
let timerId = false;
let start = false;
let score = 0;

const lTetromino = [
  [2, width + 2, width * 2 + 2, width * 2 + 1],
  [width, width + 1, width + 2, 2],
  [1, width + 1, width + 2, width],
  [0, width, width * 2, width + 1],
];

const cTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [0, 1, 2],
  [0, width, width * 2],
  [0, 1, 2],
  [0, width, width * 2],
];

const zTetromino = [
  [0, 1, width + 1, width + 2],
  [0, width, width + 1, width * 2 + 1],
  [width * 2, width * 2 + 1, width * 2 + 2, width + 1],
  [1, width + 1, width, width * 2],
];

const pTetromino = [[1], [1], [1], [1]];
let count = 1;
const totalTetrominos = [
  lTetromino,
  cTetromino,
  iTetromino,
  zTetromino,
  pTetromino,
];

let currentPosition = 4;
let currentRotation = 0;

let randomNumberFigure = Math.floor(Math.random() * totalTetrominos.length);

let currentTetromino = totalTetrominos[randomNumberFigure][currentRotation];

function draw() {
  currentTetromino.forEach((index) => {
    boxes[currentPosition + index].classList.add("active");
  });
  count++;
  gameOver();
}

function deleteDraw() {
  currentTetromino.forEach((index) => {
    boxes[currentPosition + index].classList.remove("active");
  });
}

function moveDown() {
  deleteDraw();
  currentPosition += 10;
  draw();
  freeze();
}

function startGame() {
  // startBtn.removeEventListener("click", startGame);
  // if (scoreDisplay.in)
  if (scoreDisplay.innerText === "You lost") {
    restartGame();
  }
  document.activeElement.blur();
  if (timerId) {
    clearInterval(timerId);
    timerId = false;
    start = false;
  } else {
    draw();
    start = true;
    timerId = setInterval(moveDown, 1000);
  }
}

function freeze() {
  if (
    currentTetromino.some((index) =>
      boxes[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    currentTetromino.forEach((index) =>
      boxes[currentPosition + index].classList.add("taken")
    );
    currentPosition = 4;

    randomNumberFigure = Math.floor(Math.random() * totalTetrominos.length);
    randomNumberIndex = Math.floor(Math.random() * 4);

    currentTetromino = totalTetrominos[randomNumberFigure][randomNumberIndex];
    draw();
    addScore();
  }
}

function moveLeft() {
  deleteDraw();
  const isAtLeftEdge = currentTetromino.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) {
    currentPosition--;
  }

  if (
    currentTetromino.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition++;
  }
  draw();
}

function moveRight() {
  deleteDraw();
  const isAtRightEdge = currentTetromino.some(
    (index) => (currentPosition + index + 1) % width === 0
  );
  if (!isAtRightEdge) {
    currentPosition++;
  }
  if (
    currentTetromino.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition--;
  }

  draw();
}

function rotate() {
  const isAtLeftEdge = currentTetromino.some(
    (index) => (currentPosition + index) % width === 0
  );
  const isAtRightEdge = currentTetromino.some(
    (index) => (currentPosition + index + 1) % width === 0
  );

  if (isAtLeftEdge || isAtRightEdge) {
    return;
  } else {
    deleteDraw();
    currentRotation += 1;
    if (currentRotation === 4) {
      currentRotation = 0;
    }
    currentTetromino = totalTetrominos[randomNumberFigure][currentRotation];
    draw();
  }
}

function control(e) {
  if (start === true) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    } else if (e.keyCode === 32) {
      rotate();
    }
  }
}

function addScore() {
  for (let i = 0; i < 99; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];
    const state = row.every((box) => boxes[box].classList.contains("taken"));
    if (state) {
      score += 10;
      console.log(score);
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        boxes[index].classList.remove("taken");
        boxes[index].classList.remove("active");
      });
      let boxesRemoved = boxes.splice(i, width);
      boxes = boxesRemoved.concat(boxes);
      boxes.forEach((r) => gameTable.appendChild(r));
    }
  }
}

function gameOver() {
  if (
    currentTetromino.some((element) =>
      boxes[currentPosition + element].classList.contains("taken")
    )
  ) {
    scoreDisplay.innerHTML = "You lost";
    startBtn.innerText = "Play agian";
    score = 0;
    start = false;
    clearInterval(timerId);
    startBtn.addEventListener("click", startGame);
  }
}

const moveButtons = document.querySelectorAll(".controls div");

moveButtons.forEach((button) => {
  button.addEventListener("click", moveByButtons);
});
function moveByButtons(e) {
  const currentDirection = e.target.dataset.direction;
  if (scoreDisplay.innerText !== "You lost") {
    switch (currentDirection) {
      case "left":
        moveLeft();
        break;
      case "right":
        moveRight();
        break;
      case "down":
        moveDown();
        break;
      case "position":
        rotate();
        break;
    }
  }
}

function restartGame() {
  boxes.forEach((box) => {
    box.classList.remove("active");
    box.classList.remove("taken");
    if (box.classList.contains("plus")) {
      box.classList.add("taken");
    }
  });
  deleteDraw();
  draw();
  scoreDisplay.innerText = score;
  currentPosition = 4;
  start = true;
  startBtn.innerText = "Start game";
  timerId = false;
}
startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", control);
