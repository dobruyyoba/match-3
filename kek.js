const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const colors = ['color-1', 'color-2', 'color-3', 'color-4'];
let cells = [];
let selectedCell = null;
let isDragging = false;
let isAnimating = false;
let initialCell = null;
let lastTargetCell = null;
let isSwapped = false;
let score = 0;

// Проверяем, запущен ли код внутри Telegram Mini App
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.expand();

  // Создание игрового поля (для Telegram Mini Apps)
  for (let i = 0; i < 36; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', getRandomColor());
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleTouchStart(cell));
    board.appendChild(cell);
    cells.push(cell);
  }
} else {
  // Создание игрового поля (для браузера)
  for (let i = 0; i < 36; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', getRandomColor());
    cell.dataset.index = i;
    cell.addEventListener('mousedown', handleMouseDown);
    cell.addEventListener('mousemove', handleMouseMove);
    cell.addEventListener('mouseup', handleMouseUp);
    board.appendChild(cell);
    cells.push(cell);
  }
}

// ... (остальные функции без изменений)

function handleTouchStart(cell) {
  selectedCell = cell;
  initialCell = cell;
  isDragging = true;
  isSwapped = false;
}

// ... (остальные функции без изменений)


// Получение случайного цвета
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Обработчик касания (touchstart)
function handleTouchStart(event) {
  event.preventDefault(); // Предотвращаем стандартное поведение браузера
  selectedCell = event.target;
  initialCell = event.target;
  isDragging = true;
  isSwapped = false;
}

// Обработчик движения пальца (touchmove)
function handleTouchMove(event) {
  if (!isDragging || !selectedCell || isAnimating) return;
  const touch = event.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!target || !target.classList.contains('cell')) return;
  const targetCell = target;
  if (targetCell !== selectedCell && targetCell.classList.contains('cell') && isNeighborInCross(initialCell, targetCell)) {
    if (isCursorNearBorder(event, selectedCell, targetCell)) {
      if (targetCell === initialCell && isSwapped) {
        swapCellsWithAnimation(selectedCell, initialCell);
        selectedCell = initialCell;
        isSwapped = false;
      } else if (targetCell !== initialCell && !isSwapped) {
        swapCellsWithAnimation(selectedCell, targetCell);
        selectedCell = targetCell;
        lastTargetCell = targetCell;
        isSwapped = true;
      }
    }
  }
}

// Обработчик отпускания пальца (touchend)
function handleTouchEnd() {
  isDragging = false;
  selectedCell = null;
  initialCell = null;
  lastTargetCell = null;
}
// Обработчик нажатия кнопки мыши
function handleMouseDown(event) {
  selectedCell = event.target;
  initialCell = event.target;
  isDragging = true;
  isSwapped = false;
}

// Обработчик движения мыши
function handleMouseMove(event) {
  if (!isDragging || !selectedCell || isAnimating) return;
  const targetCell = event.target;
  if (targetCell !== selectedCell && targetCell.classList.contains('cell') && isNeighborInCross(initialCell, targetCell)) {
    if (isCursorNearBorder(event, selectedCell, targetCell)) {
      if (targetCell === initialCell && isSwapped) {
        swapCellsWithAnimation(selectedCell, initialCell);
        selectedCell = initialCell;
        isSwapped = false;
      } else if (targetCell !== initialCell && !isSwapped) {
        swapCellsWithAnimation(selectedCell, targetCell);
        selectedCell = targetCell;
        lastTargetCell = targetCell;
        isSwapped = true;
      }
    }
  }
}

// Обработчик отпускания кнопки мыши
function handleMouseUp() {
  isDragging = false;
  selectedCell = null;
  initialCell = null;
  lastTargetCell = null;
}

// Функция для свапа клеток с анимацией
function swapCellsWithAnimation(cell1, cell2) {
  isAnimating = true;
  const rect1 = cell1.getBoundingClientRect();
  const rect2 = cell2.getBoundingClientRect();
  const dx = rect2.left - rect1.left;
  const dy = rect2.top - rect1.top;

  cell1.style.transform = `translate(${dx}px, ${dy}px)`;
  cell2.style.transform = `translate(${-dx}px, ${-dy}px)`;
  cell1.style.transition = 'transform 0.3s ease-in-out';
  cell2.style.transition = 'transform 0.3s ease-in-out';

  setTimeout(() => {
    swapColors(cell1, cell2);
    cell1.style.transform = '';
    cell2.style.transform = '';
    cell1.style.transition = '';
    cell2.style.transition = '';
    isAnimating = false;
    checkMatches();
  }, 300);
}

// Функция для свапа цветов
function swapColors(cell1, cell2) {
  const color1 = cell1.classList[1];
  const color2 = cell2.classList[1];
  cell1.classList.remove(color1);
  cell1.classList.add(color2);
  cell2.classList.remove(color2);
  cell2.classList.add(color1);
}

// Функция для проверки соседства в "крестике"
function isNeighborInCross(cell1, cell2) {
  const index1 = parseInt(cell1.dataset.index);
  const index2 = parseInt(cell2.dataset.index);
  const row1 = Math.floor(index1 / 6);
  const col1 = index1 % 6;
  const row2 = Math.floor(index2 / 6);
  const col2 = index2 % 6;

  return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1);
}

// Функция для проверки нахождения курсора около границы клетки
function isCursorNearBorder(event, cell1, cell2) {
  const rect2 = cell2.getBoundingClientRect();
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (mouseX > rect2.left && mouseX < rect2.right && mouseY > rect2.top && mouseY < rect2.bottom) {
    return true;
  }
  return false;
}

// Функция для проверки совпадений
function checkMatches() {
  const rows = [];
  const cols = [];

  for (let i = 0; i < 6; i++) {
    rows.push(cells.slice(i * 6, (i + 1) * 6));
    cols.push(cells.filter((_, j) => j % 6 === i));
  }

  rows.forEach(checkLine);
  cols.forEach(checkLine);
}

// Функция для проверки линии (строки или столбца)
function checkLine(line) {
  for (let i = 0; i <= line.length - 3; i++) {
    const color1 = line[i].classList[1];
    const color2 = line[i + 1].classList[1];
    const color3 = line[i + 2].classList[1];
    const color4 = line[i + 3] ? line[i + 3].classList[1] : null;
    const color5 = line[i + 4] ? line[i + 4].classList[1] : null;
    const color6 = line[i + 5] ? line[i + 5].classList[1] : null;

    if (color1 === color2 && color2 === color3) {
      let count = 3;
      if (color4 && color3 === color4) {
        count = 4;
        if (color5 && color4 === color5) {
          count = 5;
          if (color6 && color5 === color6) {
            count = 6;
          }
        }
      }
      replaceCells(line, i, count);
      score += getScore(count);
      scoreDisplay.textContent = `Счет: ${score}`;
      checkMatches();
      break;
    }
  }
}

// Функция для замены клеток
function replaceCells(line, startIndex, count) {
  for (let i = startIndex; i < startIndex + count; i++) {
    line[i].classList.remove(line[i].classList[1]);
    line[i].classList.add(getRandomColor(), 'new');
  }

  setTimeout(() => {
    line.forEach(cell => cell.classList.remove('new'));
  }, 300);
}

// Функция для получения очков
function getScore(count) {
  switch (count) {
    case 3:
      return 3;
    case 4:
      return 5;
    case 5:
      return 9;
    case 6:
      return 17;
    default:
      return 0;
  }
}