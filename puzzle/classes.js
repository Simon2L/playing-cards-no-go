class Direction {
  static Up = new Direction('Up');
  static Down = new Direction('Down');
  static Left = new Direction('Left');
  static Right = new Direction('Right');

  constructor(name) {
    this.name = name;
  }
  toString() {
    return `Direction.${this.name}`;
  }
}

class Square {
    constructor(id, corners) {
        this.id = id;
        this.corners = corners;
    }

    get topLeft() {
        return this.corners[0];
    }

    get topRight() {
        return this.corners[1];
    }

    get botLeft() {
        return this.corners[2];
    }

    get botRight() {
        return this.corners[3];
    }

    rotate90degRight() {
        // 0 1 <- square
        // 2 3
        const copy = this.corners.slice();
        this.corners[0] = copy[2];
        this.corners[1] = copy[0];
        this.corners[2] = copy[3];
        this.corners[3] = copy[1];
    }

    rotate90degLeft() {
        const copy = this.corners.slice();
        this.corners[0] = copy[1];
        this.corners[1] = copy[3];
        this.corners[2] = copy[0];
        this.corners[3] = copy[2];
    }

    isMatching(direction, otherSquare) {
        if (!otherSquare) return false;

        switch (direction) {
            case Direction.Up:
                return this.topLeft === otherSquare.botLeft &&
                       this.topRight === otherSquare.botRight;
            case Direction.Down:
                return this.botLeft === otherSquare.topLeft &&
                       this.botRight === otherSquare.topRight;
            case Direction.Left:
                return this.topLeft === otherSquare.topRight &&
                       this.botLeft === otherSquare.botRight;
            case Direction.Right:
                return this.topRight === otherSquare.topLeft &&
                       this.botRight === otherSquare.botLeft;
        }
    }
}

class Board {
    constructor() {
        this.topRow = new Array(3);
        this.midRow = new Array(2);
        this.botRow = new Array(3);
        this.board = [this.topRow, this.midRow, this.botRow];
    }

    getSquare(point) {
        return this.board[point.y][point.x];
    }

    insertSquare(square, point) {
        this.board[point.y][point.x] = square;
    }

    removeSquare(point) {
        this.board[point.y][point.x] = null;
    }

    isBoardFull() {
        return this.board.every(row => row.every(sq => sq instanceof Square));
    }

    printBoard() {
        this.board.forEach((row, y) => row.forEach((sq, x) => console.log(`x:${x}, y:${y}`, sq)));
    }

    isSolved() {
        if (!this.isBoardFull()) return false;

        try {
            const midLeft = this.getSquare(Squares.MidLeft);
            const midRight = this.getSquare(Squares.MidRight);

            // midLeft is the anchor for the left side of the puzzle
            const a = midLeft.isMatching(Direction.Left, this.getSquare(Squares.TopLeft));
            const b = midLeft.isMatching(Direction.Up, this.getSquare(Squares.TopMid));
            const c = midLeft.isMatching(Direction.Down, this.getSquare(Squares.BotLeft));
            const d = midLeft.isMatching(Direction.Right, this.getSquare(Squares.BotMid));
        
            // midRight is the anchor for the right side
            const e = midRight.isMatching(Direction.Left, this.getSquare(Squares.TopMid));
            const f = midRight.isMatching(Direction.Up, this.getSquare(Squares.TopRight));
            const g = midRight.isMatching(Direction.Down, this.getSquare(Squares.BotMid));
            const h = midRight.isMatching(Direction.Right, this.getSquare(Squares.BotRight));
        
            return a && b && c && d && e && f && g && h;
        } catch (e) {
            return false;
        }
    }

    getPointByZoneId(zoneId) {
        switch (zoneId) {
            case "zone1":
                return Squares.TopLeft; 
            case "zone2":
                return Squares.TopMid;
            case "zone3":
                return Squares.TopRight;

            case "zone4":
                return Squares.MidLeft;
            case "zone5":
                return Squares.MidRight;

            case "zone6":
                return Squares.BotLeft;
            case "zone7":
                return Squares.BotMid;
            case "zone8":
                return Squares.BotRight;
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Squares {
  static TopLeft = new Point(0, 0);
  static TopMid = new Point(1, 0);
  static TopRight = new Point(2, 0);

  static MidLeft = new Point(0, 1);
  static MidRight = new Point(1, 1)

  static BotLeft = new Point(0, 2);
  static BotMid = new Point(1, 2);
  static BotRight = new Point(2, 2);
}