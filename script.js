const gridSize = 6; // Размер сетки
const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
let grid = [];      // Игровое поле
let selected = null; // Выбранная клетка
let isMouseDown = false; // Флаг для отслеживания нажатия мыши
let score = 0;      // Счёт

// Инициализация игры
function initGame() {
    createGrid();
    renderGrid();
    updateScore();
}

// Создание сетки
function createGrid() {
    const colors = ['🔴', '🟢', '🔵', '🟡']; // Эмодзи или цвета
    for (let y = 0; y < gridSize; y++) {
        grid[y] = [];
        for (let x = 0; x < gridSize; x++) {
            grid[y][x] = colors[Math.floor(Math.random() * colors.length)];
        }
    }
}

// Отрисовка сетки
function renderGrid() {
    gridElement.innerHTML = '';
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Обработчики событий
            cell.addEventListener('mousedown', () => onMouseDown(x, y));
            cell.addEventListener('mouseup', () => onMouseUp(x, y));
            cell.addEventListener('mouseover', () => onMouseOver(x, y));

            gridElement.appendChild(cell);
        }
    }
}

// Обработка нажатия мыши
function onMouseDown(x, y) {
    isMouseDown = true;
    selected = { x, y };
    highlightCell(x, y);
}

// Обработка отжатия мыши
function onMouseUp(x, y) {
    if (isMouseDown && selected) {
        if (areNeighbors(selected.x, selected.y, x, y)) {
            swapCells(selected.x, selected.y, x, y);
            checkMatches();
        }
        selected = null;
        isMouseDown = false;
        renderGrid();
    }
}

// Обработка перемещения мыши над клеткой
function onMouseOver(x, y) {
    if (isMouseDown && selected && areNeighbors(selected.x, selected.y, x, y)) {
        swapCells(selected.x, selected.y, x, y);
        selected = { x, y };
        checkMatches();
        renderGrid();
    }
}

// Проверка, являются ли клетки соседями
function areNeighbors(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

// Плавный свап клеток
function swapCells(x1, y1, x2, y2) {
    const cell1 = document.querySelector(`.cell[data-x="${x1}"][data-y="${y1}"]`);
    const cell2 = document.querySelector(`.cell[data-x="${x2}"][data-y="${y2}"]`);

    // Анимация перемещения
    cell1.style.transform = `translate(${(x2 - x1) * 55}px, ${(y2 - y1) * 55}px)`;
    cell2.style.transform = `translate(${(x1 - x2) * 55}px, ${(y1 - y2) * 55}px)`;

    // Ждём завершения анимации
    setTimeout(() => {
        // Меняем значения в сетке
        [grid[y1][x1], grid[y2][x2]] = [grid[y2][x2], grid[y1][x1]];

        // Сбрасываем трансформацию
        cell1.style.transform = '';
        cell2.style.transform = '';

        // Перерисовываем сетку
        renderGrid();
    }, 300); // Время анимации (300 мс)
}

// Проверка на три в ряд
function checkMatches() {
    let matches = [];

    // Проверка по строкам
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize - 2; x++) {
            if (grid[y][x] === grid[y][x + 1] && grid[y][x] === grid[y][x + 2]) {
                matches.push({ x, y });
                matches.push({ x: x + 1, y });
                matches.push({ x: x + 2, y });
            }
        }
    }

    // Проверка по столбцам
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize - 2; y++) {
            if (grid[y][x] === grid[y + 1][x] && grid[y][x] === grid[y + 2][x]) {
                matches.push({ x, y });
                matches.push({ x, y: y + 1 });
                matches.push({ x, y: y + 2 });
            }
        }
    }

    // Удаление совпадающих элементов
    if (matches.length > 0) {
        for (const match of matches) {
            grid[match.y][match.x] = null;
        }
        updateScore(matches.length);
        fillEmptyCells();
        renderGrid();
    }
}

// Заполнение пустых клеток
function fillEmptyCells() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = gridSize - 1; y >= 0; y--) {
            if (grid[y][x] === null) {
                for (let yy = y; yy >= 0; yy--) {
                    if (grid[yy][x] !== null) {
                        grid[y][x] = grid[yy][x];
                        grid[yy][x] = null;
                        break;
                    }
                }
                if (grid[y][x] === null) {
                    grid[y][x] = ['🔴', '🟢', '🔵', '🟡'][Math.floor(Math.random() * 4)];
                }
            }
        }
    }
}

// Обновление счёта
function updateScore(points = 0) {
    score += points;
    scoreElement.textContent = `Счёт: ${score}`;
}

// Подсветка выбранной клетки
function highlightCell(x, y) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('selected'));
    const selectedCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    selectedCell.classList.add('selected');
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);