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

    const clearBoard = () => {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                board[row][column] = '';
            }
        }
    }

    return { getBoard, clearBoard, displayBoard };
    
})();

const gameController = (function() {
    const board = gameboard.getBoard();
    let result = null;
    let gameFinished = false;

    const players = [
        {
           marker: 'X', 
        },
        {
            marker: '0',
        }
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${activePlayer.marker}'s turn!`);
    }

    const hasGameFinished = () => gameFinished;
    const getResult = () => result;

    const checkTie = () => {
        const oneDimensionalBoard = [].concat(...board);
        const numOfEmptyCells = oneDimensionalBoard.filter((emptyString) => (emptyString === '')).length;
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
            console.log(`${activePlayer.marker} won!!!`)
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
                    if (checkTie()) {
                        result = "It's a tie!";
                        gameFinished = true;
                        return
                    }
                    if (checkWin()) {
                        result = `The winner is\n${getActivePlayer().marker}`;
                        gameFinished = true;
                        return;
                    }
                    switchPlayerTurn();
                    return;
                 }
                 indexTracker ++;
            }
        }
    } 

    const resetGame = () => {
        gameboard.clearBoard();
        result = null;
        gameFinished = false;
        activePlayer = players[0];
    }

    return { tickCell, getActivePlayer, hasGameFinished, getResult, resetGame }
})();

(function() {

    const screenContoller = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.displayTurn();
        },
        cacheDom: function() {
            this.cells = document.querySelectorAll('.cell');
            this.buttons = document.querySelectorAll('.button');
            this.turn = document.querySelector('.turn');
            this.dialogs = document.querySelectorAll('dialog');
            this.resultAnnouncementDialog = document.querySelector('.game-end-modal');

        },
        bindEvents: function() {
            this.cells.forEach((cell, cellIndex) => {
                cell.addEventListener('click', this.markCell.bind(this,cellIndex))
            })
            this.buttons.forEach(button => {
                button.addEventListener('click', this.identifyButton.bind(this))
                // Buttons should: 1. Close the dialog; 2. Not dialog related buttons
                // 3. And later may open the dialog.
            })
        },

        identifyButton: function(e) {
            if (e.target.parentNode.classList.contains("modal-wrapper")) {
                this.dialogs.forEach(dialog => {
                    this.clearScreen();
                    dialog.close();
                })
                //buttons that are inside a dialog
            }
            //Otherwise you are dealing with other button not in the dialog
        },
        markCell: function(cellIndex, e) {
            if (e.target.textContent === '') {
                e.target.textContent = gameController.getActivePlayer().marker;
                gameController.tickCell(cellIndex);
                this.displayTurn();
            }
            if (gameController.hasGameFinished()) {
                this.resultAnnouncementDialog.showModal();
                this.displayResult();
                
            }
        },
        displayTurn: function() {
            const mark = `${gameController.getActivePlayer().marker} `;
            this.turn.textContent = mark;
        },
        displayResult: function() {
            document.querySelector('.game-result').textContent = gameController.getResult();
        },

        clearScreen: function() {
            gameController.resetGame();
            this.cells.forEach(cell => {
                cell.textContent = '';
            })
            this.displayTurn();
        }
    }

    screenContoller.init();
})();