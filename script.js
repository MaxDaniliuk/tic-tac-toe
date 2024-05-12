const gameboard = (function() {
    const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    // Used to display the board in console. Won't be required after setting up the DOM.
    const displayBoard = (board) => {
        let display = '';
        display += ` ___ ___ ___  \n`;
        display += `| ${board[0][0]} | ${board[0][1]} | ${board[0][2]} | \n`;
        display += `|---|---|---| \n`;
        display += `| ${board[1][0]} | ${board[1][1]} | ${board[1][2]} | \n`;
        display += `|---|---|---|\n`;
        display += `| ${board[2][0]} | ${board[2][1]} | ${board[2][2]} | \n`;
        console.log(display);
    }

    const getBoard = () => board;

    return { getBoard, displayBoard }
    
})();

const gameController = (function() {
    const board = gameboard.getBoard();
    const playerOne = 'Player One';
    const playerTwo = 'Player Two';
    let gameFinished = false;

    const players = [
        {
           name: playerOne,
           marker: 'X', 
        },
        {
            name: playerTwo,
            marker: '0',
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${activePlayer.name}'s turn!`);
    }

    const hasGameFinished = () => gameFinished;

    const checkTie = () => {
        const flattenedBoard = [].concat(...board);
        const numOfEmptyCells = flattenedBoard.filter((emptyString) => (emptyString === '')).length;
        if (numOfEmptyCells === 0) {
            console.log(`It's a tie!`)
            return true;
        }
        return false;
    }

    const checkWin = () => {
        if ((board[0][0] !== '' && board[0][0] === board[0][1] && board[0][1] === board[0][2]) || 
            (board[1][0] !== '' && board[1][0] === board[1][1] && board[1][1] === board[1][2]) || 
            (board[2][0] !== '' && board[2][0] === board[2][1] && board[2][1] === board[2][2]) || 
            (board[0][0] !== '' && board[0][0] === board[1][0] && board[1][0] === board[2][0]) || 
            (board[0][1] !== '' && board[0][1] === board[1][1] && board[1][1] === board[2][1]) || 
            (board[0][2] !== '' && board[0][2] === board[1][2] && board[1][2] === board[2][2]) || 
            (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) || 
            (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0])
        ) { 
            console.log(`${activePlayer.name} won!!!`)
            return true;
        }
        return false;
    }

    const tickCell = (cellIndex) => { 
        let indexTracker = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (indexTracker === cellIndex) {
                    board[i][j] = activePlayer.marker;
                    gameboard.displayBoard(board);

                    if (checkWin() || checkTie()) {
                        return gameFinished = true;
                    }

                    switchPlayerTurn();
                    return
                 }
                 indexTracker ++;
            }
        }
    }
    return { tickCell, hasGameFinished }
})();

(function() {
    const cells = document.querySelectorAll('.cell');
    const updateBoard = (cellIndex) => {
        [...cells][cellIndex].textContent = [].concat(...gameboard.getBoard())[cellIndex];
    };

    const clickHandlerCell = (cellIndex) => (e) => {
        if (!gameController.hasGameFinished()) {
            if (e.target.textContent === '') {
                gameController.tickCell(cellIndex);
                updateBoard(cellIndex);
            }
        }
    };

    cells.forEach((cell, cellIndex) => {
        cell.addEventListener('click', clickHandlerCell(cellIndex))
    })
})();