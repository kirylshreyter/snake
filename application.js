var stepInterval;
var foodCreationInterval;
var defaultWidth = 5;
var defaultHeight = 5;
var defaultSpeed = 1500;
var allGridCells;
var currentHeadPosition;
var foodPosition;
var direction = 'right';
var foodCounter = 0;
var fullSnake = [];
var score;


function createEat() {
    if (foodCounter != 1) {
        foodPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
        for (var fullSnakeIndexer = 0; fullSnakeIndexer < fullSnake.length; fullSnakeIndexer++) {
            while (fullSnake[fullSnakeIndexer][0] == foodPosition[0] && fullSnake[fullSnakeIndexer][1] == foodPosition[1]) {
                foodPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
            }
        }
        findCellAndPaintOver(foodPosition, 'FF7F50');
        foodCounter = 1;
    }
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
            cell.setAttribute('x', widthIterator.toString());
            cell.setAttribute('y', heightIterator.toString());
        }
    }
    return result;
}

function appendChild(parent, appenderStyle) {
    var child = parent.appendChild(createDiv());
    child.setAttribute('class', appenderStyle);
    return child;
}

function createNewGrid() {
    if (document.getElementById('width').value) {
        defaultWidth = document.getElementById('width').value;
    }
    if (document.getElementById('height').value) {
        defaultHeight = document.getElementById('height').value;
    }
    if (document.getElementById('moveSpeed').value != 'Please, select speed') {
        defaultSpeed = document.getElementById('moveSpeed').value * 500;
    }
    document.getElementById('grid').appendChild(createGrid(defaultWidth, defaultHeight));
    currentHeadPosition = [generate(0, defaultWidth), generate(0, defaultHeight)];
    fullSnake.unshift(currentHeadPosition);
    setStyleDisplayToElement('grid', 'block');
    setStyleDisplayToElement('dialog', 'none');
    allGridCells = getElementsByClassName('cell');
    document.addEventListener('keydown', changeDirection);
    setTimeout(start, 2000);
}

function getElementsByClassName(className) {
    return document.getElementsByClassName(className);
}

function setStyleDisplayToElement(elementId, value) {
    document.getElementById(elementId).style.display = value;

}

function findCellByCoordinates(position) {
    for (var staticCellsIndexer = 0; staticCellsIndexer < allGridCells.length; staticCellsIndexer++) {
        var curCell = allGridCells[staticCellsIndexer];
        if ((curCell.getAttribute('x') == position[0] & curCell.getAttribute('y') == position[1])) {
            return curCell;
        }
    }
}

function start() {
    foodCreationInterval = setInterval(createEat, 500);
    stepInterval = setInterval(getNextDefaultPosition, defaultSpeed);
}

function compareTwoPositions(firstPosition, secondPosition) {
    return firstPosition.length == secondPosition.length && firstPosition.every(function (element, index) {
        return element === secondPosition[index];
    });
}

function checkIfBrake(position) {
    for (var fullSnakeIndexer = 0; fullSnakeIndexer < fullSnake.length; fullSnakeIndexer++) {
        if (fullSnake[fullSnakeIndexer][0] == position[0] && fullSnake[fullSnakeIndexer][1] == position[1]) {
            clearInterval(foodCreationInterval);
            clearInterval(stepInterval);
            score = fullSnake.length;
            alert('GAME OVER, YOUR SCORE ' + score);
        }
    }
}


function getNextDefaultPosition() {
    var position = currentHeadPosition;

    function increaseSnakeLength() {
        if (compareTwoPositions(position, foodPosition)) {
            fullSnake.unshift(foodPosition);
            foodCounter = 0;
        }
    }

    function stepLeft() {
        if (currentHeadPosition[0] - 1 >= 0) {
            currentHeadPosition = [currentHeadPosition[0] - 1, currentHeadPosition[1]];
            increaseSnakeLength();
        } else {
            currentHeadPosition = [defaultWidth - 1, currentHeadPosition[1]];
            increaseSnakeLength();
        }
        move(currentHeadPosition);
    }

    function stepTop() {
        if (currentHeadPosition[1] - 1 >= 0) {
            currentHeadPosition = [currentHeadPosition[0], currentHeadPosition[1] - 1];
            increaseSnakeLength();
        } else {
            currentHeadPosition = [currentHeadPosition[0], defaultHeight - 1];
            increaseSnakeLength();
        }
        move(currentHeadPosition);
    }

    function stepRight() {
        if (currentHeadPosition[0] + 1 < defaultWidth) {
            currentHeadPosition = [currentHeadPosition[0] + 1, currentHeadPosition[1]];
            increaseSnakeLength();
        } else {
            currentHeadPosition = [0, currentHeadPosition[1]];
            increaseSnakeLength();
        }
        move(currentHeadPosition);
    }

    function stepDown() {
        if (currentHeadPosition[1] + 1 < defaultHeight) {
            currentHeadPosition = [currentHeadPosition[0], currentHeadPosition[1] + 1];
            increaseSnakeLength();
        } else {
            currentHeadPosition = [currentHeadPosition[0], 0];
            increaseSnakeLength();
        }
        move(currentHeadPosition);
    }

    switch (direction) {
        case 'left':
            stepLeft();
            break;
        case 'top':
            stepTop();
            break;
        case 'right':
            stepRight();
            break;
        case 'down':
            stepDown();
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
    findCellAndPaintOver(fullSnake.pop(), '#708090');
    checkIfBrake(position);
    fullSnake.unshift(position);
    paintCells(fullSnake);
}

function findCellAndPaintOver(position, color) {
    var cell = findCellByCoordinates(position);
    cell.style.backgroundColor = color;
}

function paintCells(snake) {
    findCellAndPaintOver(snake[0], 'red');
    for (var snakeIndexer = 1; snakeIndexer < snake.length; snakeIndexer++) {
        findCellAndPaintOver(snake[snakeIndexer], '00008b');
    }
}

