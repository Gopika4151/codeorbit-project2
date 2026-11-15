const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];

let gameActive = true;

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const HUMAN = "X";
const AI = "O";

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle player moves
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

        // ஒருவேளை கேம் செயலிலில் இல்லை என்றாலோ அல்லது ஏற்கனவே நிரப்பப்பட்டிருந்தாலோ திரும்பவும்
        if (board[index] !== "" || !gameActive) {
            return;
        }

        makeMove(index, HUMAN);

        // பிளேயர் நகர்வுக்குப் பிறகு கேம் முடிந்துவிட்டதா எனச் சோதிக்கவும்
        if (!checkGame()) {
            gameActive = false; // கம்ப்யூட்டர் யோசிக்கும் நேரத்தில் பிளேயர் கிளிக் செய்யாமல் இருக்க இது சரி
            statusText.textContent = "Computer is thinking...";

            setTimeout(computerMove, 500);
        }
    });
});

// Make a move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].disabled = true;
}

// Check winner
function getWinner(currentBoard) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            currentBoard[a] &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[b] === currentBoard[c]
        ) {
            return currentBoard[a];
        }
    }
    return null;
}

// Check game result
function checkGame() {
    const winner = getWinner(board);

    if (winner === HUMAN) {
        statusText.textContent = "🎉 You Win!";
        playerScore++;
        updateScore();
        gameActive = false;
        return true;
    }

    if (winner === AI) {
        statusText.textContent = "🤖 Computer Wins!";
        computerScore++;
        updateScore();
        gameActive = false;
        return true;
    }

    if (!board.includes("")) {
        statusText.textContent = "🤝 Match Draw!";
        drawScore++;
        updateScore();
        gameActive = false;
        return true;
    }

    return false;
}

// Computer move using Minimax
function computerMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = AI;
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        makeMove(bestMove, AI);

        // கம்ப்யூட்டர் நகர்வுக்குப் பிறகு கேம் முடியாவிட்டால், பிளேயரின் டர்னை அனுமதிக்கவும்
        if (!checkGame()) {
            gameActive = true; // <--- மிக முக்கிய மாற்றம்: கேமை மீண்டும் இயக்கச் செய்தல்
            statusText.textContent = "Your Turn (X)";
        }
    }
}

// Minimax algorithm
function minimax(currentBoard, depth, isMaximizing) {
    let winner = getWinner(currentBoard);

    if (winner === AI) return 10 - depth;
    if (winner === HUMAN) return depth - 10;
    if (!currentBoard.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === "") {
                currentBoard[i] = AI;
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === "") {
                currentBoard[i] = HUMAN;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Update scores
function updateScore() {
    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;
    document.getElementById("drawScore").textContent = drawScore;
}

// Restart game
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
    });

    statusText.textContent = "Your Turn (X)";
}