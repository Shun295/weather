const board = document.getElementById("board");
const statusDisplay = document.querySelector(".status");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", index);
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    });
}

function handleCellClick(event) {
    const index = event.target.getAttribute("data-index");

    if (gameBoard[index] !== "" || !gameActive) return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner(currentPlayer)) {
        statusDisplay.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (!gameBoard.includes("")) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (currentPlayer === "O") {
        statusDisplay.textContent = "AI's Turn (O)";
        setTimeout(aiMove, 500);
    } else {
        statusDisplay.textContent = "Player's Turn (X)";
    }
}

function aiMove() {
    let bestMove = minimax(gameBoard, "O").index;
    gameBoard[bestMove] = "O";

    let cell = document.querySelector(`[data-index='${bestMove}']`);
    cell.textContent = "O";
    cell.classList.add("taken");

    if (checkWinner("O")) {
        statusDisplay.textContent = "AI Wins!";
        gameActive = false;
        return;
    }

    if (!gameBoard.includes("")) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    statusDisplay.textContent = "Player's Turn (X)";
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => gameBoard[index] === player)
    );
}

function minimax(newBoard, player) {
    let availableSpots = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if (checkWinner("X")) return { score: -10 };
    if (checkWinner("O")) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusDisplay.textContent = "Player's Turn (X)";
    createBoard();
}

createBoard();
