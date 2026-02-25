"use strict";

const board = new Board();
const square1 = new Square("1", [green, blue, red, yellow]);
const square2 = new Square("2", [green, red, blue, yellow]);
const square3 = new Square("3", [green, yellow, blue, red]);
const square4 = new Square("4", [green, blue, yellow, red]);
const square5 = new Square("5", [green, red, yellow, blue]);
const square6 = new Square("6", [green, yellow, blue, red]);
const square7 = new Square("7", [green, blue, red, yellow]);
const square8 = new Square("8", [green, yellow, red, blue]);
const squares = [square1, square2, square3, square4, square5, square6, square7, square8];


squares.forEach((square) => {
    const squareHtml = renderSquare(square);
    puzzleContainer.insertAdjacentHTML('beforeend', squareHtml);
});

function renderSquare(square) {
    return `
    <div id="${square.id}" class="square">
        <button class="btn-sm" onmousedown="event.stopPropagation()" onclick="rotateSquareLeft('${square.id}')">←</button>
        <button class="btn-sm" onmousedown="event.stopPropagation()" onclick="rotateSquareRight('${square.id}')">→</button>
        <div id="tl-${square.id}" class="dot ${square.corners[0]}"></div>
        <div id="tr-${square.id}" class="dot ${square.corners[1]}"></div>
        <div id="bl-${square.id}" class="dot ${square.corners[2]}"></div>
        <div id="br-${square.id}" class="dot ${square.corners[3]}"></div>
    </div>
    `;
}

function rotateSquareLeft(id) {
    const square = squares.find(s => s.id === id)

    if (square) {
        square.rotate90degLeft();
        updateSquareElement(square);
        if (board.isSolved()) {
            solvedHandler();
        }
    }
}

function rotateSquareRight(id) {
    const square = squares.find(s => s.id === id)
    console.log(square);
    if (square) {
        square.rotate90degRight();
        updateSquareElement(square);
        if (board.isSolved()) {
            solvedHandler();
        }
    }
}


function updateSquareElement(square) {
    const squareElement = document.getElementById(square.id);
    if (squareElement) {
        const tlDot = document.getElementById(`tl-${square.id}`);
        replaceColor(tlDot, square.topLeft);
        const trDot = document.getElementById(`tr-${square.id}`);
        replaceColor(trDot, square.topRight);
        const blDot = document.getElementById(`bl-${square.id}`);
        replaceColor(blDot, square.botLeft);
        const brDot = document.getElementById(`br-${square.id}`);
        replaceColor(brDot, square.botRight);
    }
}

function replaceColor(element, color) {
    colors.forEach(color => element.classList.remove(color));
    element.classList.add(color);
}

const squareElements = document.getElementsByClassName("square");

for (let i = 0; i < squareElements.length; i++) {
    const element = squareElements[i];
    element.addEventListener("mousedown", (e) => mouseDown(e, element));
}



// [ [1], [1, 2, 3], [1, 2, 3], [1] ]
[ [1, 2, 3], [1, 2],  [1, 2, 3] ]
// const board = [ [], [], [] ];

// upper row
// 0, 0 -> 1, 0 (right? could be down)
// 0, 1 -> 1, 0 && 1, 1
// 0, 2 -> 1, 1

// middle row ONLY CHECK MIDDLE FOR WIN ez
// 1, 0 -> 0, 0 && 0, 1 && 2, 0 && 2, 1
// 1, 1 -> 0, 1 && 0, 2 && 2, 1 && 2, 2

// lower row
// 2, 0 -> 1, 0
// 2, 1 -> 1, 0 && 1, 1
// 2, 2 -> 1, 1
