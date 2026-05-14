const BOARD_SIZE = 15;
let currentPlayer = 'black'; // 'black' or 'white'
let gameActive = true;
let boardState = []; // 2D array [15][15]

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

// Initialize the game
function initGame() {
    // Reset state
    currentPlayer = 'black';
    gameActive = true;
    boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    updateStatus();

    // Clear and build board
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            // Add classes for grid line edge cases
            if (row === 0) cell.classList.add('top');
            if (row === BOARD_SIZE - 1) cell.classList.add('bottom');
            if (col === 0) cell.classList.add('left');
            if (col === BOARD_SIZE - 1) cell.classList.add('right');

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(e) {
    if (!gameActive) return;

    const cell = e.currentTarget;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // If cell already has a piece, do nothing
    if (boardState[row][col] !== null) return;

    // Place piece in data state
    boardState[row][col] = currentPlayer;
    
    // Create UI piece
    const piece = document.createElement('div');
    piece.classList.add('piece', currentPlayer);
    cell.appendChild(piece);

    // Check if the current move wins the game
    if (checkWin(row, col, currentPlayer)) {
        gameActive = false;
        const winnerText = currentPlayer === 'black' ? '黑子' : '白子';
        const color = currentPlayer === 'black' ? 'var(--black-piece)' : '#666';
        statusElement.innerHTML = `<span style="color: #e74c3c; font-size: 1.5rem;">遊戲結束！<strong style="color: ${color}">${winnerText}</strong> 獲勝！🎉</span>`;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updateStatus();
}

// Update the turn indicator text
function updateStatus() {
    if (currentPlayer === 'black') {
        statusElement.innerHTML = `當前輪到：<span class="player-black">黑子</span>`;
    } else {
        statusElement.innerHTML = `當前輪到：<span class="player-white">白子</span>`;
    }
}

// Check for 5-in-a-row
function checkWin(row, col, player) {
    // 4 directions: Horizontal, Vertical, Diagonal (\), Diagonal (/)
    const directions = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // bottom-right
        [1, -1]   // bottom-left
    ];

    for (let [dx, dy] of directions) {
        let count = 1; // Current piece
        
        // Check forward direction
        for (let i = 1; i < 5; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (isValid(newRow, newCol) && boardState[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // Check backward direction
        for (let i = 1; i < 5; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (isValid(newRow, newCol) && boardState[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// Check if coordinates are within the board
function isValid(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

// Bind restart button
restartBtn.addEventListener('click', initGame);

// Start game initially
initGame();
