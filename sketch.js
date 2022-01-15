let gameDetail = Expert;
let board = createBoard(gameDetail.height, gameDetail.width);
let canvas;
let dbx = 20;
let dby = 104;

let pictures = {
    board: {
        numbers: [],
        covered: "",
        flagged: "",
        bombs: {
            wrong: "",
            tapped: "",
            regular: ""
        }
    },
    border: {
        tb: "",
        top_left: "",
        top_right: "",
        bottom_left: "",
        bottom_right: "",
        side_long: "",
        side_short: "",
        joint_left: "",
        joint_right: ""
    },
    faces: {
        dead: "",
        ooh: "",
        smile: "",
        win: "",
        pressed: ""
    },
    time: []
};

function preload() {
    for (let i = 0; i <= 8; i++) {
        pictures.board.numbers[i] = loadImage(`https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/numbers/open${i}.png`);
    }

    pictures.board.covered = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/covered.png");
    pictures.board.flagged = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/flagged.png");
    pictures.board.bombs.wrong = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/wrong%20mark.png");
    pictures.board.bombs.tapped = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/clicked%20bomb.png");
    pictures.board.bombs.regular = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/board/bomb%20revealed.png");

    pictures.border.tb = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/border.png");
    pictures.border.bottom_left = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/bottom%20left.png");
    pictures.border.bottom_right = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/bottom%20right.png");
    pictures.border.joint_left = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/joint%20left.png");
    pictures.border.joint_right = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/joint%20right.png");
    pictures.border.side_long = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/side%20long.png");
    pictures.border.side_short = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/side%20short.png");
    pictures.border.top_left = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/upper%20left.png");
    pictures.border.top_right = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/border/upper%20right.png");

    pictures.faces.dead = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/faces/dead%20face.png");
    pictures.faces.ooh = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/faces/ooh%20face.png");
    pictures.faces.smile = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/faces/smile%20face.png");
    pictures.faces.win = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/faces/win%20face.png");
    pictures.faces.pressed = loadImage("https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/faces/pressed%20face.png");

    for (let i = 0; i <= 9; i++) {
        pictures.time[i] = loadImage(`https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/time%20numbers/time${i}.png`);
    }
}

function setup() {
    Canvas();
}

function draw() {
    background("#bcbdbc");
    //drawing the board
    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            let cell = board[i][j];
            if (cell.revealed) {
                if (cell.bomb) {
                    if (cell.marked) {
                        image(pictures.board.bombs.wrong, i * 32 + dbx, j * 32 + dby);
                    } else if (cell.tapped) {
                        image(pictures.board.bombs.tapped, i * 32 + dbx, j * 32 + dby);
                    } else {
                        image(pictures.board.bombs.regular, i * 32 + dbx, j * 32 + dby);
                    }
                } else {
                    image(pictures.board.numbers[cell.value]);
                }
            } else {
                if (cell.flagged) {
                    image(pictures.board.flagged, i * 32 + dbx, j * 32 + dby);
                } else {
                    image(pictures.board.covered, i * 32 + dbx, j * 32 + dby);
                }
            }
        }
    }

    //drawing the border
    image(pictures.border.top_left, 0, 0);
    image(pictures.border.top_right, width - 20, 0);
    image(pictures.border.tb, 20, 0, width - 40, 20);
    image(pictures.border.bottom_left, 0, height - 20);
    image(pictures.border.bottom_right, width - 20, height - 20);
    image(pictures.border.tb, 20, height - 20, width - 40, 20);

    image(pictures.border.tb, 20, 84, width - 40, 20);
    image(pictures.border.joint_left, 0, 84);
    image(pictures.border.joint_right, width - 20, 84);

    image(pictures.border.side_long, 0, 20);
    image(pictures.border.side_long, width - 20, 20);
    image(pictures.border.side_short, 0, 104, 20, height - 124);
    image(pictures.border.side_short, width - 20, 104, 20, height - 124);

    //drawing the smily face
    if (faceState == "SMILE") {
        image(pictures.faces.smile, (width - 52) / 2, 26);
    } else if (faceState == "OOH") {
        image(pictures.faces.ooh, (width - 52) / 2, 26);
    } else if (faceState == "WIN") {
        image(pictures.faces.win, (width - 52) / 2, 26);
    } else if (faceState == "LOSE") {
        image(pictures.faces.dead, (width - 52) / 2, 26);
    } else if (faceState == "PRESSED") {
        image(pictures.faces.pressed, (width - 52) / 2, 26);
    }

    //drawing the timer
    let tempTime = convertToThree(time);

    image(pictures.time[tempTime[0]], width - 56, 31);
    image(pictures.time[tempTime[1]], width - 82, 31);
    image(pictures.time[tempTime[2]], width - 108, 31);

    //drawing the mine count
    let tempMine = convertToThree((gameDetail.mines - totalFlagged));

    image(pictures.time[tempMine[2]], 30, 31);
    image(pictures.time[tempMine[1]], 56, 31);
    image(pictures.time[tempMine[0]], 82, 31);
}

function Canvas() {
    console.log(gameDetail);
    canvas = createCanvas(gameDetail.width * 32 + 40, gameDetail.height * 32 + 124);
}

function convertToThree(num) {
    let newNum = [];
    if (num < 1000) {
        newNum[0] = num % 10;
        newNum[1] = Math.floor((num % 100) / 10)
        newNum[2] = Math.floor((num % 1000) / 100);
    } else {
        newNum = ["9", "9", "9"]
    }

    return newNum;
}