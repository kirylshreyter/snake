var mainInterval;
var eatInterval;
var staticWidth = 5;
var staticHeight = 5;
var staticMoveSpeed = 1500;
var staticCells;
var currentPosition;
var eatPosition;
var direction = 'right';
var eatCounter = 0;
var fullSnake = [];
var score;


function createEat() {
    if (eatCounter != 1) {
        eatPosition = [generate(0, staticWidth), generate(0, staticHeight)];
        for (var fullSnakeIndexer = 0; fullSnakeIndexer < fullSnake.length; fullSnakeIndexer++) {
            while (fullSnake[fullSnakeIndexer][0] == eatPosition[0] && fullSnake[fullSnakeIndexer][1] == eatPosition[1]) {
                eatPosition = [generate(0, staticWidth), generate(0, staticHeight)];
            }
        }
        findCellAndPaintOver(eatPosition, 'FF7F50');
        eatCounter = 1;
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
        staticWidth = document.getElementById('width').value;
    }
    if (document.getElementById('height').value) {
        staticHeight = document.getElementById('height').value;
    }
    if (document.getElementById('moveSpeed').value != 'Please, select speed') {
        staticMoveSpeed = document.getElementById('moveSpeed').value * 500;
    }
    document.getElementById('grid').appendChild(createGrid(staticWidth, staticHeight));
    currentPosition = [generate(0, staticWidth), generate(0, staticHeight)];
    fullSnake.unshift(currentPosition);
    setStyleDisplayToElement('grid', 'block');
    setStyleDisplayToElement('dialog', 'none');
    staticCells = getElementsByClassName('cell');
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
    for (var staticCellsIndexer = 0; staticCellsIndexer < staticCells.length; staticCellsIndexer++) {
        var curCell = staticCells[staticCellsIndexer];
        if ((curCell.getAttribute('x') == position[0] & curCell.getAttribute('y') == position[1])) {
            return curCell;
        }
    }
}

function start() {
    eatInterval = setInterval(createEat, 500);
    mainInterval = setInterval(getNextDefaultPosition, staticMoveSpeed);
}

function compareTwoArrays(firstArray, secondArray) {
    return firstArray.length == secondArray.length && firstArray.every(function (element, index) {
        return element === secondArray[index];
    });
}

function checkIfBrake(param1, param2) {
    for (var fullSnakeIndexer = 0; fullSnakeIndexer < fullSnake.length; fullSnakeIndexer++) {
        if (fullSnake[fullSnakeIndexer][0] == param1 && fullSnake[fullSnakeIndexer][1] == param2) {
            clearInterval(eatInterval);
            clearInterval(mainInterval);
            score = fullSnake.length;
            alert('GAME OVER, YOUR SCORE ' + score);
        }
    }
}

function getNextDefaultPosition() {
    var pos = currentPosition;

    function compareTwoPositions() {
        if (compareTwoArrays(pos, eatPosition)) {
            fullSnake.unshift(eatPosition);
            eatCounter = 0;
        }
    }

    switch (direction) {
        case 'left':
            if (currentPosition[0] - 1 >= 0) {
                currentPosition = [currentPosition[0] - 1, currentPosition[1]];
                compareTwoPositions();
            } else {
                currentPosition = [staticWidth - 1, currentPosition[1]];
                compareTwoPositions();
            }
            move(currentPosition);
            break;
        case 'top':
            if (currentPosition[1] - 1 >= 0) {
                currentPosition = [currentPosition[0], currentPosition[1] - 1];
                compareTwoPositions();
            } else {
                currentPosition = [currentPosition[0], staticHeight - 1];
                compareTwoPositions();
            }
            move(currentPosition);
            break;
        case 'right':
            if (currentPosition[0] + 1 < staticWidth) {
                currentPosition = [currentPosition[0] + 1, currentPosition[1]];
                compareTwoPositions();
            } else {
                currentPosition = [0, currentPosition[1]];
                compareTwoPositions();
            }
            move(currentPosition);
            break;
        case 'down':
            if (currentPosition[1] + 1 < staticHeight) {
                currentPosition = [currentPosition[0], currentPosition[1] + 1];
                compareTwoPositions();
            } else {
                currentPosition = [currentPosition[0], 0];
                compareTwoPositions();
            }
            move(currentPosition);
            break;
    }
}

function changeDirection(e) {
    switch (e.keyCode) {
        case 37:    // left
            direction = 'left';
            break;
        case 38:   // top
            direction = 'top';
            break;
        case 39:   // right
            direction = 'right';
            break;
        case 40:   // down
            direction = 'down';
            break;
    }
}

function move(position) {
    findCellAndPaintOver(fullSnake.pop(), '#708090');
    checkIfBrake(position[0], position[1]);
    fullSnake.unshift(position);
    colorFields(fullSnake);
}

function findCellAndPaintOver(position, color) {
    var cell = findCellByCoordinates(position);
    cell.style.backgroundColor = color;
}

function colorFields(snake) {
    findCellAndPaintOver(snake[0], 'red');
    for (var snakeIndexer = 1; snakeIndexer < snake.length; snakeIndexer++) {
        findCellAndPaintOver(snake[snakeIndexer], '00008b');
    }
}

