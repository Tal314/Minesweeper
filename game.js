function createBoard(height, width) {
    let board = new Array(width);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(height);
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = new Cell();
        }
    }

    return board;
}

let gameState = "BEFORE"; //options are: "BEFORE", "AFTER", "PLAYING"
let faceState = "SMILE"; //options are: "SMILE", "OOH", "WIN", "DEAD", "PRESSED"
let time = 0;
let totalFlagged = 0;

class Cell {
    constructor() {
        this.revealed = false;
        this.value = 0;
        this.mine = false;
        this.marked = false;
        this.tapped = false;
    }
}