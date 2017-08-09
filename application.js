var MAIN_SNAKE_COLOR = '7FFFD4';
var SNAKE_HEAD_COLOR = '1E90FF';
var CELL_COLOR = '#708090';
var FOOD_COLOR = 'FF7F50';
var stepInterval;
var foodCreationInterval;
var defaultWidth = 5;
var defaultHeight = 5;
var defaultSpeed = 1500;
var allGridCells = [];
var allGridCellsIndexes = [];
var currentHeadPosition;
var foodPosition;
var direction = 'right';
var foodCounter = 0;
var fullSnake = [];

function createEat() {
    if (foodCounter == 0) {
        foodPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
        while (fullSnake.some(isContains)) {
            foodPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
        }
        findCellAndPaintOver(foodPosition, FOOD_COLOR);
        foodCounter = 1;
    }
}

function isContains(element, index, array, pos) {
    return compareTwoPositions(element, foodPosition);
}

function generate(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createDiv() {
    return document.createElement('div');
}

function createGrid(width, height) {
    var result = createDiv();
    for (var heightIterator = 0; heightIterator < height; heightIterator++) {
        var row = appendChild(result, 'row');
        for (var widthIterator = 0; widthIterator < width; widthIterator++) {
            var cell = appendChild(row, 'cell');
            allGridCells.push(cell);
            allGridCellsIndexes.push([widthIterator, heightIterator]);
        }
    }
    return result;
}

function appendChild(parent, appenderStyle) {
    var child = parent.appendChild(createDiv());
    child.setAttribute('class', appenderStyle);
    return child;
}

function widthExists() {
    if (document.getElementById('width').value) return true;
}

function heightExists() {
    if (document.getElementById('height').value) return true;
}

function setWidthAndHeight() {
    defaultWidth = document.getElementById('width').value;
    defaultHeight = document.getElementById('height').value;
}

function setSpeedIfExists() {
    if (document.getElementById('speed').value != 'Please, select speed') {
        defaultSpeed = document.getElementById('speed').value * 500;
    }
}

function play() {
    if (widthExists() && heightExists()) setWidthAndHeight();
    setSpeedIfExists();
    document.getElementById('grid').appendChild(createGrid(defaultWidth, defaultHeight));
    currentHeadPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
    fullSnake.unshift(currentHeadPosition);
    setStyleDisplayToElement('grid', 'block');
    setStyleDisplayToElement('dialog', 'none');
    document.addEventListener('keydown', changeDirection);
    setTimeout(start, 2000);
}

function setStyleDisplayToElement(elementId, value) {
    document.getElementById(elementId).style.display = value;
}

function start() {
    foodCreationInterval = setInterval(createEat, defaultSpeed);
    stepInterval = setInterval(nextSnakeStep, defaultSpeed);
}

function compareTwoPositions(firstPosition, secondPosition) {
    return firstPosition.length == secondPosition.length && firstPosition.every(function (element, index) {
        return element === secondPosition[index];
    });
}

function setScore(score) {
    document.getElementById('score').innerText = score;
}

function checkIfBrake(position) {
    fullSnake.forEach(function (element, index, array) {
        if (compareTwoPositions(element, position)) {
            clearInterval(foodCreationInterval);
            clearInterval(stepInterval);
            alert('GAME OVER, YOUR SCORE ' + fullSnake.length);
            return;
        }
    });
}

function increaseSnakeLength(position) {
    setScore(fullSnake.length);
    if (compareTwoPositions(position, foodPosition)) {
        fullSnake.unshift(foodPosition);
        foodCounter = 0;
    }
}

function stepLeft(position) {
    if (currentHeadPosition[0] - 1 >= 0) {
        currentHeadPosition = [currentHeadPosition[0] - 1, currentHeadPosition[1]];
    } else {
        currentHeadPosition = [defaultWidth - 1, currentHeadPosition[1]];
    }
    increaseSnakeLength(position);
    move(currentHeadPosition);
}

function stepTop(position) {
    if (currentHeadPosition[1] - 1 >= 0) {
        currentHeadPosition = [currentHeadPosition[0], currentHeadPosition[1] - 1];
    } else {
        currentHeadPosition = [currentHeadPosition[0], defaultHeight - 1];
    }
    increaseSnakeLength(position);
    move(currentHeadPosition);
}

function stepRight(position) {
    if (currentHeadPosition[0] + 1 < defaultWidth) {
        currentHeadPosition = [currentHeadPosition[0] + 1, currentHeadPosition[1]];
    } else {
        currentHeadPosition = [0, currentHeadPosition[1]];
    }
    increaseSnakeLength(position);
    move(currentHeadPosition);
}

function stepDown(position) {
    if (currentHeadPosition[1] + 1 < defaultHeight) {
        currentHeadPosition = [currentHeadPosition[0], currentHeadPosition[1] + 1];
    } else {
        currentHeadPosition = [currentHeadPosition[0], 0];
    }
    increaseSnakeLength(position);
    move(currentHeadPosition);
}

function nextSnakeStep() {
    var position = currentHeadPosition;
    switch (direction) {
        case 'left':
            stepLeft(position);
            break;
        case 'top':
            stepTop(position);
            break;
        case 'right':
            stepRight(position);
            break;
        case 'down':
            stepDown(position);
            break;
    }
}

function changeDirection(e) {
    switch (e.keyCode) {
        case 37:
            direction = 'left';
            break;
        case 38:
            direction = 'top';
            break;
        case 39:
            direction = 'right';
            break;
        case 40:
            direction = 'down';
            break;
    }
}

function move(position) {
    findCellAndPaintOver(fullSnake.pop(), CELL_COLOR);
    checkIfBrake(position);
    fullSnake.unshift(position);
    paintCells(fullSnake);
}

function findCellAndPaintOver(position, color) {
    allGridCellsIndexes.forEach(function (element, index, array) {
        if (compareTwoPositions(element, position)) {
            allGridCells[index].style.backgroundColor = color;
            return;
        }
    });
}

function paintCell(element, index, array) {
    findCellAndPaintOver(element, MAIN_SNAKE_COLOR);
}

function paintCells(snake) {
    snake.forEach(paintCell);
    findCellAndPaintOver(snake[0], SNAKE_HEAD_COLOR);
}

