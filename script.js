const gameboard = (function() {
    const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

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
    const getActivePlayer = () => activePlayer;
    const resetPlayer = () => activePlayer = players[0];
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

    const resetGame = () => {
        gameFinished = false;
        resetPlayer();
    }

    return { tickCell, hasGameFinished, checkTie, checkWin, getActivePlayer, resetGame }
})();

(function() {
    const cells = [...document.querySelectorAll('.cell')];
    const buttons = document.querySelectorAll('.button');
    const gameResultAnnouncement = document.querySelector('.game-result');
    const markerTurn = document.querySelector('.marker-turn');
    const gameEndModal = document.querySelector('.game-end-modal')
    const board = gameboard.getBoard();

    const updateBoard = (cellIndex) => {
        cells[cellIndex].textContent = [].concat(...board)[cellIndex];
        displayTurn();
        if (gameController.hasGameFinished()) {
            displayResult();
        }
    };

    const displayTurn = () => {
        markerTurn.textContent = gameController.getActivePlayer().marker;
    }
    displayTurn();

    const displayResult = () => {
        if (gameController.checkTie()) {
            gameResultAnnouncement.textContent = "It's a tie!";
        }
        if (gameController.checkWin()) {
            gameResultAnnouncement.textContent = `The winner is: ${gameController.getActivePlayer().name} !!`;
        }
        gameEndModal.showModal();
    }

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

    const clickHandlerButton = (e) => {
        if (e.target.classList.contains("play-again")) {
            playAgain();
        }
    };

    const playAgain = () => {
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
                cells[index].textContent = '';
                index++;
            }
        }
        gameController.resetGame();
        displayTurn();
        gameEndModal.close(); 
    } 

    buttons.forEach((button) => {
        button.addEventListener('click', clickHandlerButton)
    })
})();