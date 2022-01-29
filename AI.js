let previousMoves = 0;

function AI() {
    if (gameState == "PLAYING") {
        let moves = 0;
        for (let i = 0; i < gameDetail.width; i++) {
            for (let j = 0; j < gameDetail.height; j++) {
                if (board[i][j].revealed && board[i][j].value > 0) {
                    let neighbours = findNeighbours(i, j);
                    let flaggedNeighbours = 0;
                    let revealedNeighbours = 0;
                    for (let k = 0; k < neighbours.length; k++) {
                        let coord = neighbours[k];
                        if (board[coord[0]][coord[1]].marked) {
                            flaggedNeighbours++;
                        }

                        if (!board[coord[0]][coord[1]].revealed) {
                            revealedNeighbours++;
                        }
                    }
                    if (flaggedNeighbours != revealedNeighbours) {

                        if (revealedNeighbours == board[i][j].value) {
                            for (let k = 0; k < neighbours.length; k++) {
                                let coord = neighbours[k];
                                if (!board[coord[0]][coord[1]].revealed) {
                                    if (!board[coord[0]][coord[1]].marked) {
                                        totalFlagged++;
                                        board[coord[0]][coord[1]].marked = true;
                                        moves++;
                                    }
                                }
                            }
                        }

                        if (flaggedNeighbours == board[i][j].value) {
                            chord(i, j);
                            moves++;
                        }
                    }
                }
            }
        }



        if (previousMoves == moves && moves == 0) {
            let clickedCell = false;
            while (!clickedCell) {
                let randomX = Math.floor(Math.random() * gameDetail.width);
                let randomY = Math.floor(Math.random() * gameDetail.height);

                if (!board[randomX][randomY].marked && !board[randomX][randomY].revealed) {
                    //let neighbours = findNeighbours(randomX, randomY);
                    //let revealedNeighbour = neighbours.find(neigh => board[neigh[0]][neigh[1]].revealed);
                    //if (revealedNeighbour != undefined) {
                    click(randomX, randomY);
                    console.log("guessed!");
                    clickedCell = true;
                    moves++;
                    //}
                }
            }
        }

        previousMoves = moves;
    }

    if (gameState == "BEFORE") {
        let x = Math.floor(gameDetail.width / 2);
        let y = Math.floor(gameDetail.height / 2);

        generateGame(x, y);
        timer = setInterval(() => {
            time++;
        }, 1000);
        gameState = "PLAYING";
    }
}