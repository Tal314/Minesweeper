initiateGame();

let mouseState = [false, false, false];
let mouseLeft = 0;
let mouseRight = 2;
let surface = "Regular Surface"; //"Regular Surface", "Torus", "Mobius Strip", "Klein Bottle"

let canvas, surfaceSelector, difficultySelector;
let customDiv;
let customSubmit, customWidth, customHeight, customMines;
let dbx = 20;
let dby = 104;

//An object containing all pictures (defined in preload())
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
    //loading all of the needed pictures from the github repository
    for (let i = 0; i <= 8; i++) {
        pictures.board.numbers[i] = loadImage(`https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/numbers/open${i}.png`);
    }

    pictures.board.covered = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/covered.png");
    pictures.board.flagged = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/flagged.png");
    pictures.board.bombs.wrong = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/wrong%20mark.png");
    pictures.board.bombs.tapped = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/clicked%20bomb.png");
    pictures.board.bombs.regular = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/board/bomb%20revealed.png");

    pictures.border.tb = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/border.png");
    pictures.border.bottom_left = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/bottom%20left.png");
    pictures.border.bottom_right = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/bottom%20right.png");
    pictures.border.joint_left = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/joint%20left.png");
    pictures.border.joint_right = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/joint%20right.png");
    pictures.border.side_long = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/side%20long.png");
    pictures.border.side_short = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/side%20short.png");
    pictures.border.top_left = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/upper%20left.png");
    pictures.border.top_right = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/border/upper%20right.png");

    pictures.faces.dead = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/faces/dead%20face.png");
    pictures.faces.ooh = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/faces/ooh%20face.png");
    pictures.faces.smile = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/faces/smile%20face.png");
    pictures.faces.win = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/faces/win%20face.png");
    pictures.faces.pressed = loadImage("https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/faces/pressed%20face.png");

    for (let i = 0; i <= 9; i++) {
        pictures.time[i] = loadImage(`https://raw.githubusercontent.com/TalBeno314/Minesweeper/master/minesweeper%20data/time%20numbers/time${i}.png`);
    }
}

function setup() {
    Canvas();
}

function draw() {
    background("#bdbdbd");
    //drawing the board
    for (let i = 0; i < gameDetail.width; i++) {
        for (let j = 0; j < gameDetail.height; j++) {
            let cell = board[i][j];
            if (cell.revealed) {
                if (cell.mine) {
                    if (cell.tapped) {
                        image(pictures.board.bombs.tapped, i * 32 + dbx, j * 32 + dby);
                    } else {
                        image(pictures.board.bombs.regular, i * 32 + dbx, j * 32 + dby);
                    }
                } else {
                    image(pictures.board.numbers[cell.value], i * 32 + dbx, j * 32 + dby);
                    if (cell.wrong) {
                        image(pictures.board.bombs.wrong, i * 32 + dbx, j * 32 + dby);
                    }
                }
            } else {
                if (cell.marked) {
                    image(pictures.board.flagged, i * 32 + dbx, j * 32 + dby);
                } else {
                    image(pictures.board.covered, i * 32 + dbx, j * 32 + dby);
                }
            }

            if (gameState == "BEFORE" || gameState == "PLAYING") {
                if (onBoard(mouseX, mouseY)) {
                    let x = Math.floor((mouseX - dbx) / 32);
                    let y = Math.floor((mouseY - dby) / 32);
                    if (mouseState[mouseLeft] && !mouseState[mouseRight]) {
                        if (!board[x][y].marked && !board[x][y].revealed) {
                            image(pictures.board.numbers[0], x * 32 + dbx, y * 32 + dby);
                        }
                    } else if (mouseState[mouseRight] && mouseState[mouseLeft]) {
                        if (!board[x][y].marked && !board[x][y].revealed) {
                            image(pictures.board.numbers[0], x * 32 + dbx, y * 32 + dby);
                        }
                        let neighbours = findNeighbours(x, y);
                        for (let l = 0; l < neighbours.length; l++) {
                            if (!board[neighbours[l][0]][neighbours[l][1]].marked && !board[neighbours[l][0]][neighbours[l][1]].revealed) {
                                image(pictures.board.numbers[0], neighbours[l][0] * 32 + dbx, neighbours[l][1] * 32 + dby);
                            }
                        }
                    }
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
    } else if (faceState == "DEAD") {
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
    canvas = createCanvas(gameDetail.width * 32 + 40, gameDetail.height * 32 + 124).position((windowWidth - width) / 2, 0);

    surfaceSelector = createSelect().size(152, 72).style("font-size: 24px; background-color: white;").position((windowWidth + width) / 2 - 152, height + 16);
    surfaceSelector.option("Regular Surface");
    surfaceSelector.option("Torus");
    surfaceSelector.option("Mobius Strip");
    surfaceSelector.option("Klein Bottle");
    surfaceSelector.option("Real Projective Plane");
    surfaceSelector.selected(surface);
    surfaceSelector.changed(changSurface);

    difficultySelector = createSelect().size(162, 72).style("font-size: 24px; background-color: white;").position((windowWidth - width) / 2, height + 16);
    difficultySelector.option("Expert");
    difficultySelector.option("Intermediate");
    difficultySelector.option("Beginner");
    difficultySelector.option("Custom");
    difficultySelector.selected(gameDetail.name);
    difficultySelector.changed(selectDifficulty);

    customDiv = createDiv().id("Custom")

    let textWidth = createP("Width: ").style("color: white;").position((windowWidth - width) / 2, height + 82).id("textWidth")
    customWidth = createInput().position((windowWidth - width) / 2 + 52, height + 100).size(64, 12).id("customWidth")
    let textHeight = createP("Height: ").style("color: white;").position((windowWidth - width) / 2, height + 106).id("textHeight")
    customHeight = createInput().position((windowWidth - width) / 2 + 52, height + 124).size(64, 12).id("customHeight");
    let textMines = createP("Mines: ").style("color: white;").position((windowWidth - width) / 2, height + 130).id("textMines")
    customMines = createInput().position((windowWidth - width) / 2 + 52, height + 148).size(64, 12).id("customMines")

    customSubmit = createButton("Create Game").style("background-color: white;").position((windowWidth - width) / 2, height + 172).id("customSubmit").mousePressed(customGame);

    let elements = ["textWidth", "customWidth", "textHeight", "customHeight", "textMines", "customMines", "customSubmit"];
    for (let i = 0; i < elements.length; i++) {
        customDiv.child(elements[i]);
    }
    if (difficultySelector.value() == "Custom") {
        hideCustom("Custom", "block");
    } else {
        hideCustom("Custom", "none");
    }
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

function selectDifficulty() {
    if (difficultySelector.value() == "Custom") {
        hideCustom("Custom", "block");
    } else {
        customDiv.style("display: none;");

        switch (difficultySelector.value()) {
            case "Expert":
                gameDetail = Expert;
                break;
            case "Intermediate":
                gameDetail = Intermediate;
                break;
            case "Beginner":
                gameDetail = Beginner;
                break;
        }

        document.getElementsByTagName("body")[0].innerHTML = "";
        initiateGame();
        Canvas();
    }
}

function hideCustom(element, display) {
    element = document.getElementById(element);
    for (let i = 0; i < element.childNodes.length; i++) {
        element.childNodes[i].style.display = display;
    }
}

document.onmousedown = function(evt) {
    let previous = [mouseState[0], mouseState[1], mouseState[2]];
    mouseState[evt.button] = true;

    if (mouseState[mouseRight] && !mouseState[mouseLeft]) {
        if (gameState == "PLAYING" || gameState == "BEFORE") {
            let coord = mouseToBoard(mouseX, mouseY);
            if (!board[coord.x][coord.y].revealed) {
                if ((!board[coord.x][coord.y].marked && totalFlagged < gameDetail.mines) || board[coord.x][coord.y].marked) {
                    board[coord.x][coord.y].marked = !board[coord.x][coord.y].marked;
                    totalFlagged += (board[coord.x][coord.y].marked) ? 1 : -1;
                }
            }
        }
    } else if (mouseState[mouseLeft] && !mouseState[mouseRight]) {
        if (mouseX > (width - 52) / 2 && mouseX < (width + 52) / 2 && mouseY > 26 && mouseY < 78) {
            faceState = "PRESSED";
        }
    }
}

document.onmouseup = function(evt) {
    let previous = [mouseState[0], mouseState[1], mouseState[2]];
    mouseState[evt.button] = false;

    if (previous[mouseLeft] && !previous[mouseRight]) {
        if (onBoard(mouseX, mouseY)) {
            if (gameState == "BEFORE") {
                let coord = mouseToBoard(mouseX, mouseY);
                generateGame(coord.x, coord.y);
                timer = setInterval(() => {
                    time++;
                }, 1000);
                gameState = "PLAYING";
            } else if (gameState == "PLAYING") {
                let coord = mouseToBoard(mouseX, mouseY);
                click(coord.x, coord.y);
            }
        }

        if (faceState == "PRESSED") {
            initiateGame();
        }
    } else if (previous[mouseRight] && !previous[mouseLeft]) {

    } else if (previous[mouseRight] && previous[mouseLeft]) {
        if (onBoard(mouseX, mouseY) && gameState == "PLAYING") {
            let coord = mouseToBoard(mouseX, mouseY);
            chord(coord.x, coord.y);
        }
    }
}

function onBoard(x, y) {
    //this function checks if the mouse is on the board
    return (x > dbx && x < width - dbx && y > dby && y < height - dbx)
}

function customGame() {
    let newHeight = customHeight.value();
    let newWidth = customWidth.value();
    let newMines = customMines.value();

    if (!isNaN(newHeight) && !isNaN(newWidth) && !isNaN(newMines)) {
        newHeight = floor(parseFloat(newHeight));
        newWidth = floor(parseFloat(newWidth));
        newMines = floor(parseFloat(newMines));

        gameDetail = new Setup(newHeight, newWidth, newMines, "Custom");
        document.getElementsByTagName("body")[0].innerHTML = "";
        initiateGame();
        Canvas();
    }
}

function findNeighbours(x, y) {
    let neighbours = []
    switch (surface) {
        case "Regular Surface":
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (!(dx == dy && dx == 0)) {
                        if (x + dx < gameDetail.width && x + dx >= 0 && y + dy < gameDetail.height && y + dy >= 0) {
                            //In the regular surface we simply ignore everything that goes beyond the border
                            neighbours.push([x + dx, y + dy]);
                        }
                    }
                }
            }
            break;
        case "Torus":
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (!(dx == dy && dx == 0)) {
                        //In the torus we need to loop over, it can be done using the remainder like so
                        let newX = (x + dx + gameDetail.width) % gameDetail.width;
                        let newY = (y + dy + gameDetail.height) % gameDetail.height;
                        neighbours.push([newX, newY]);
                    }
                }
            }
            break;
        case "Mobius Strip":
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (!(dx == dy && dx == 0)) {
                        if ((x + dx >= gameDetail.width || x + dx < 0) && (y + dy < gameDetail.height && y + dy >= 0)) {
                            //if we go over one side (left and right in this case)
                            //the x coordinate will loop over:
                            let newX = (x + dx + gameDetail.width) % gameDetail.width;
                            //and the y coordinate will be flipped over along the middle x axis
                            let newY = gameDetail.height - y - dy - 1;
                            neighbours.push([newX, newY]);
                        } else if (x + dx < gameDetail.width && x + dx >= 0 && y + dy < gameDetail.height && y + dy >= 0) {
                            //just like in the regular case
                            neighbours.push([x + dx, y + dy]);
                        }
                    }
                }
            }
            break;
        case "Klein Bottle":
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (!(dx == dy && dx == 0)) {
                        if ((x + dx >= gameDetail.width || x + dx < 0) && (y + dy < gameDetail.height && y + dy >= 0)) {
                            let newX = (x + dx + gameDetail.width) % gameDetail.width;
                            let newY = (y + dy + gameDetail.height) % gameDetail.height;
                            neighbours.push([newX, newY]);
                        } else if ((y + dy >= gameDetail.height || y + dy < 0) && (x + dx < gameDetail.width && x + dx >= 0)) {
                            let newX = gameDetail.width - x - dx - 1;
                            let newY = (y + dy + gameDetail.height) % gameDetail.height;
                            neighbours.push([newX, newY]);
                        } else if (x + dx < gameDetail.width && x + dx >= 0 && y + dy < gameDetail.height && y + dy >= 0) {
                            neighbours.push([x + dx, y + dy]);
                        } else if ((x + dx >= gameDetail.width || x + dx < 0) && (y + dy >= gameDetail.height || y + dy < 0)) {
                            let newX = (2 * gameDetail.width - x - dx - 1) % gameDetail.width;
                            let newY = (y + dy + gameDetail.height) % gameDetail.height;
                            neighbours.push([newX, newY]);
                        }
                    }
                }
            }
            break;
        case "Real Projective Plane":
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (!(dx == dy && dx == 0)) {
                        if ((x + dx >= gameDetail.width || x + dx < 0) && (y + dy < gameDetail.height && y + dy >= 0)) {
                            let newX = (x + dx + gameDetail.width) % gameDetail.width;
                            let newY = gameDetail.height - y - dy - 1;
                            neighbours.push([newX, newY]);
                        } else if ((y + dy >= gameDetail.height || y + dy < 0) && (x + dx < gameDetail.width && x + dx >= 0)) {
                            let newX = gameDetail.width - x - dx - 1;
                            let newY = (y + dy + gameDetail.height) % gameDetail.height;
                            neighbours.push([newX, newY]);
                        } else if (x + dx < gameDetail.width && x + dx >= 0 && y + dy < gameDetail.height && y + dy >= 0) {
                            neighbours.push([x + dx, y + dy]);
                        }
                    }
                }
            }
            break;
    }

    return neighbours;
}

function mouseToBoard(x, y) {
    let coord = {
        x: 0,
        y: 0
    }

    coord.x = Math.floor((mouseX - dbx) / 32);
    coord.y = Math.floor((mouseY - dby) / 32);

    return coord;
}

function changSurface() {
    surface = surfaceSelector.value();
    initiateGame();
}