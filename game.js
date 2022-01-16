class Setup {
    constructor(height, width, mines, name) {
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.name = name;
    }
}

const Expert = new Setup(16, 30, 99, "Expert");
const Intermediate = new Setup(16, 16, 40, "Intermediate");
const Beginner = new Setup(9, 9, 10, "Beginner");

let gameDetail = Expert;
let torus = false;
let gameState, faceState, time, totalFlagged, board, timer, revealed;

class Cell {
    constructor() {
        this.revealed = false;
        this.value = 0;
        this.mine = false;
        this.marked = false;
        this.tapped = false;
        this.wrong = false;
    }
}

function initiateGame() {
    clearInterval(timer);
    gameState = "BEFORE"; //"BEFORE", "AFTER", "PLAYING"
    faceState = "SMILE"; // "SMILE", "OOH", "WIN", "DEAD", "PRESSED"
    time = 0;
    totalFlagged = 0;
    revealed = 0;
    board = createBoard(gameDetail.height, gameDetail.width);
    clearInterval(timer);
}

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

function generateGame(x, y) {
    let tempMines = gameDetail.mines;
    while (tempMines > 0) {
        let randomX = Math.floor(Math.random() * gameDetail.width);
        let randomY = Math.floor(Math.random() * gameDetail.height);

        if (Math.abs(randomX - x) > 1 && Math.abs(randomY - y) > 1 && !board[randomX][randomY].mine) {
            board[randomX][randomY].mine = true;
            tempMines--;
        }
    }

    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            if (!board[i][j].mine) {
                let neighbours = findNeighbours(i, j);
                console.log(neighbours);
                for (let k = 0; k < neighbours.length; k++) {
                    let tmepX = neighbours[k][0];
                    let tempY = neighbours[k][1];

                    console.log(neighbours[k]);
                    if (board[tmepX][tempY].mine) {
                        board[i][j].value++;
                    }
                }
            }
        }
    }

    revealeNeighbours(x, y);
}

function revealeNeighbours(x, y) {
    let neighbours = findNeighbours(x, y);
    board[x][y].revealed = true;
    revealed++;
    if (board[x][y].value == 0) {
        for (let k = 0; k < neighbours.length; k++) {
            let tempX = neighbours[k][0];
            let tempY = neighbours[k][1];
            if (!board[tempX][tempY].mine && !board[tempX][tempY].marked && !board[tempX][tempY].revealed) {
                if (board[tempX][tempY].value == 0) {
                    revealeNeighbours(tempX, tempY);
                } else {
                    board[tempX][tempY].revealed = true;
                    revealed++;
                }
            }
        }
    }
}

function click(x, y) {
    if (!board[x][y].mine && !board[x][y].marked) {
        revealeNeighbours(x, y);
        let uncovered = 0;
        for (let i = 0; i < gameDetail.width; i++) {
            for (let j = 0; j < gameDetail.height; j++) {
                if (board[i][j].revealed) {
                    uncovered++;
                }
            }
        }

        if (uncovered == (gameDetail.width * gameDetail.height - gameDetail.mines)) win();
    } else if (board[x][y].mine && !board[x][y].marked) {
        board[x][y].tapped = true;
        lose();
    }
}

function win() {
    faceState = "WIN";
    gameState = "AFTER";
    clearInterval(timer);

    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            if (board[i][j].mine) {
                board[i][j].marked = true;
            }
        }
    }
}

function lose() {
    faceState = "DEAD";
    gameState = "AFTER";
    clearInterval(timer);

    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            if (board[i][j].mine && !board[i][j].marked) {
                board[i][j].revealed = true;
            } else if (!board[i][j].mine && board[i][j].marked) {
                board[i][j].wrong = true;
                board[i][j].revealed = true;
            }
        }
    }
}

function chord(x, y) {
    if (board[x][y].revealed) {
        let neighbours = findNeighbours(x, y);
        let neighMarked = 0;
        for (let i = 0; i < neighbours.length; i++) {
            if (board[neighbours[i][0]][neighbours[i][1]].marked) {
                neighMarked++
            }
        }

        if (board[x][y].value == neighMarked) {
            for (let i = 0; i < neighbours.length; i++) {
                click(neighbours[i][0], neighbours[i][1]);
            }
        }
    }
}