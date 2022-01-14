let gameDetail = Expert;
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
        win: ""
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

    for (let i = 0; i <= 9; i++) {
        pictures.time = loadImage(`https://raw.githubusercontent.com/TalBeno314/temp-test/master/minesweeper%20data/time%20numbers/time${i}.png`);
    }
}

function setup() {
    Canvas();
}

function draw() {
    background(220);
    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            image()
        }
    }
}

function Canvas() {
    canvas = createCanvas(gameDetail.width * 32 + 40, gameDetail.height * 32 + 40);
}