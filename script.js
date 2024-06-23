
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');

let currentBoard;
let humanPlayer = 'O';
let aiPlayer = 'X';

// Event listeners for cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, false);
});

// Event listener for reset button
resetButton.addEventListener('click', startGame, false);

// Start the game
startGame();

function startGame() {
    currentBoard = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', handleCellClick, false);
    });
}

function handleCellClick(event) {
    let cellIndex = event.target.dataset.index;
    if (typeof currentBoard[cellIndex] === 'number') {
        turn(cellIndex, humanPlayer);
        if (!checkWin(currentBoard, humanPlayer) && !checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(cellIndex, player) {
    currentBoard[cellIndex] = player;
    document.querySelector(`.cell[data-index='${cellIndex}']`).innerText = player;
    let gameWon = checkWin(currentBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    let winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    winCombos[gameWon.index].forEach(index => {
        document.querySelector(`.cell[data-index='${index}']`).style.backgroundColor =
            gameWon.player === humanPlayer ? "blue" : "red";
    });
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick, false);
    });
}

function emptySquares() {
    return currentBoard.filter(s => typeof s === 'number');
}

function bestSpot() {
    return minimax(currentBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', handleCellClick, false);
        });
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares();

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
