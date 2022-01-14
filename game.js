function createBoared(height, width) {
    let board = new Array(width);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(height);
    }
}

class Cell {
    constructor() {
        this.revealed = false;
        this.value = "0";
        this.mine = false;
        this.marked = false;
    }
}