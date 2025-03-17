const gridSize = 6; // Размер сетки
let grid = [];      // Игровое поле
let selected = null; // Выбранная клетка
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
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[y][x];
            cell.addEventListener('click', () => onCellClick(x, y));
            gridElement.appendChild(cell);
        }
    }
}

// Обработка клика по клетке
function onCellClick(x, y) {
    if (selected === null) {
        // Выбор первой клетки
        selected = { x, y };
        highlightCell(x, y);
    } else {
        // Выбор второй клетки и попытка свапа
        if (areNeighbors(selected.x, selected.y, x, y)) {
            swapCells(selected.x, selected.y, x, y);
            checkMatches();
            selected = null;
            renderGrid();
        } else {
            // Сброс выбора, если клетки не соседние
            selected = null;
            renderGrid();
        }
    }
}

// Проверка, являются ли клетки соседями
function areNeighbors(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

// Перестановка клеток
function swapCells(x1, y1, x2, y2) {
    [grid[y1][x1], grid[y2][x2]] = [grid[y2][x2], grid[y1][x1]];
}

// Проверка на совпадения
function checkMatches() {
    // Логика проверки совпадений (например, 3 в ряд)
    // Упрощённая версия: просто увеличиваем счёт
    score += 10;
    updateScore();
}

// Обновление счёта
function updateScore() {
    document.getElementById('score').textContent = `Счёт: ${score}`;
}

// Подсветка выбранной клетки
function highlightCell(x, y) {
    const cells = document.querySelectorAll('.cell');
    cells[y * gridSize + x].classList.add('selected');
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Инициализация Telegram Web App
Telegram.WebApp.ready();

// Показать кнопку "Закрыть"
Telegram.WebApp.MainButton.setText('Закрыть');
Telegram.WebApp.MainButton.show();
Telegram.WebApp.MainButton.onClick(() => {
    Telegram.WebApp.close();
});