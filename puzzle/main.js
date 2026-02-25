"use strict";

let offsetX = 0, offsetY = 0; // Stores where inside the card you clicked
const blue = "blue", green = "green", yellow = "yellow", red = "red";
const colors = [blue, green, yellow, red];

const puzzleContainer = document.getElementById("puzzle-container");

function getZones() {
    return Array.from(document.getElementsByClassName("zone"));
}

function getVirtualSquare() {
    return document.getElementById("virtual-square");
}

function createVirtualSquare(card) {
    let virtualSquare = card.cloneNode(true);
    virtualSquare.id = "virtual-square";
    virtualSquare.style.position = "static";
    virtualSquare.style.opacity = "0.5";
    virtualSquare.style.zIndex = "-1";
    virtualSquare.style.pointerEvents = "none"; // Ensure it doesn't block mouse events
    return virtualSquare;
}

function getClosestCollidingZone(card) {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = {
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 2
    };

    // Filter zones: must collide and be empty
    const collidingZones = getZones().filter(zone => {
        const isOccupied = zone.hasChildNodes() && !zone.querySelector('#virtual-square');
        return isCollision(zone, card) && !isOccupied;
    });

    if (collidingZones.length === 0) return null;

    let closestZone = null;
    let minDistance = Infinity;

    collidingZones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const zoneCenter = {
            x: zoneRect.left + zoneRect.width / 2,
            y: zoneRect.top + zoneRect.height / 2
        };

        const distance = Math.sqrt(
            Math.pow(zoneCenter.x - cardCenter.x, 2) + 
            Math.pow(zoneCenter.y - cardCenter.y, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestZone = zone;
        }
    });

    return closestZone;
}

function collisionHappened(card) {
    const closestZone = getClosestCollidingZone(card);
    let virtualSquare = getVirtualSquare();
    
    if (closestZone) {
        if (!virtualSquare || virtualSquare.parentElement !== closestZone) {
            if (virtualSquare) virtualSquare.remove();
            virtualSquare = createVirtualSquare(card);
            closestZone.appendChild(virtualSquare);
        }
    } else if (virtualSquare) {
        virtualSquare.remove();
    }
}

let moveHandler, upHandler;

function mouseDown(e, card) {
    // 1. Calculate offset so the card doesn't "jump"
    const rect = card.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    if (card.style.position !== "fixed") {
        const zone = card.parentElement;
        if (zone && zone.classList.contains('zone')) {
            const point = board.getPointByZoneId(zone.id);
            board.removeSquare(point);
        }
        
        // Move to body/container so it can move freely across the screen
        card.style.width = rect.width + "px";
        card.style.height = rect.height + "px";
        card.style.position = "fixed";
        puzzleContainer.appendChild(card);
    }

    card.style.zIndex = "1000";
    
    // Set initial position
    card.style.left = (e.clientX - offsetX) + "px";
    card.style.top = (e.clientY - offsetY) + "px";
    
    moveHandler = (e) => mouseMove(e, card);
    upHandler = (e) => mouseUp(e, card);

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
}

function mouseMove(e, card) {
    card.style.left = (e.clientX - offsetX) + "px";
    card.style.top = (e.clientY - offsetY) + "px";
    collisionHappened(card);
}

function mouseUp(e, card) {
    const virtualSquare = getVirtualSquare();
    if (virtualSquare) virtualSquare.remove();

    const closestZone = getClosestCollidingZone(card);
    
    if (closestZone) {
        card.style.position = "static";
        card.style.width = "";
        card.style.height = "";
        card.style.left = "";
        card.style.top = "";
        
        const point = board.getPointByZoneId(closestZone.id);
        const square = squares.find(s => s.id === card.id);
        
        board.insertSquare(square, point);
        closestZone.appendChild(card);

        if (board.isSolved()) {
            solvedHandler();
        }
    } else {
        // NEW: Reset the card if dropped in the "void"
        card.style.position = "static";
        card.style.width = "";
        card.style.height = "";
        card.style.left = "";
        card.style.top = "";
        card.style.zIndex = "1";
    }

    card.style.zIndex = "1";
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
}

function isCollision(boxA, boxB) {
    return isXCollision(boxA, boxB) && isYCollision(boxA, boxB);
}

function isXCollision(boxA, boxB) {
    const rectA = boxA.getBoundingClientRect();
    const rectB = boxB.getBoundingClientRect();

    return rectA.right >= rectB.left && rectA.left <= rectB.right;
}

function isYCollision(boxA, boxB) {
    const rectA = boxA.getBoundingClientRect();
    const rectB = boxB.getBoundingClientRect();

    return rectA.bottom >= rectB.top && rectA.top <= rectB.bottom;
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

const popup = document.getElementById("solved-popup");
const closeBtn = document.getElementById("solved-close-btn");

closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});

function solvedHandler() {
    popup.classList.add("show");
}