const gameboard = (function() {
    const board = [];

    const createBoard = () => {
        for (let row = 0; row < 3; row++) {
            board[row] = [];
            for (let column = 0; column < 3; column++) {
                board[row][column] = '';
            }
        }
    };
    const getBoard = () => board;
    createBoard();

    return { getBoard, createBoard };
})();

const gameController = (function() {
    const board = gameboard.getBoard();
    let result = null;
    let gameFinished = false;
    let gameStarted = false;

    const players = [{ marker: 'X' }, { marker: 'O'}];

    const switchMarkers = () => {
        [players[0]["marker"], players[1]["marker"]] = [players[1]["marker"], players[0]["marker"]];
        return players;
    };

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchPlayerTurn = () => { activePlayer = activePlayer === players[0] ? players[1] : players[0] };

    const hasGameFinished = () => gameFinished;
    const hasGameStarted = () => gameStarted;
    const getResult = () => result;

    const checkTie = () => {
        const numOfEmptyCells = [].concat(...board).filter((emptyString) => (emptyString === '')).length;
        if (numOfEmptyCells === 0) {
            return true;
        }
        return false;
    };

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
            return true;
        }
        return false;
    };

    const playRound = (cellIndex) => {
        gameStarted = true; 
        let indexTracker = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (indexTracker === cellIndex) {
                    board[i][j] = activePlayer.marker;
                    if (checkWin() || checkTie()) {
                        result = checkWin() ? "The winner is" : "It's a tie!";
                        gameFinished = true;
                        return;
                    }
                    switchPlayerTurn();
                    return;
                 }
                 indexTracker ++;
            }
        }
    }; 

    const resetGame = () => {
        gameboard.createBoard();
        result = null;
        [gameFinished, gameStarted] = [false, false];
        activePlayer = players[0];
    };

    return { playRound, getActivePlayer, hasGameFinished, getResult, resetGame, switchMarkers, hasGameStarted };
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
            this.resultAnnouncementDialog = document.querySelector('.game-end-modal');
            this.gameResult = document.querySelector('.game-result');
            this.winner = document.querySelector('.winner');
            this.playerOne = document.querySelector('.player-one');
            this.playerTwo = document.querySelector('.player-two');
        },
        bindEvents: function() {
            this.cells.forEach((cell, cellIndex) => {
                cell.addEventListener('click', this.markCell.bind(this,cellIndex))
            })
            this.buttons.forEach(button => {
                button.addEventListener('click', this.identifyButton.bind(this))
            })
        },
        identifyButton: function(e) {
            if (e.target.parentNode.classList.contains("modal-wrapper")) {
                this.clearScreen();
                this.resultAnnouncementDialog.close();
            } else {
                if (!gameController.hasGameStarted()) {
                    const players = gameController.switchMarkers();
                    this.switchPlayers(players);
                    this.displayTurn();
                }
            }
        },
        markCell: function(cellIndex, e) {
            if (e.target.textContent === '') {
                e.target.textContent = gameController.getActivePlayer().marker;
                e.target.style.color = e.target.textContent === 'X' ? 'gold' : '#ff0059';
                gameController.playRound(cellIndex);
                this.displayTurn();
            }
            if (gameController.hasGameFinished()) {
                this.resultAnnouncementDialog.showModal();
                this.displayResult();
            }
        },
        displayTurn: function() {
            this.setMarker(this.turn);
        },
        displayResult: function() {
            this.gameResult.textContent = gameController.getResult();
            this.setMarker(this.winner);
        },
        setMarker: function(element){
            const mark = `${gameController.getActivePlayer().marker}`;
            element.textContent = mark;
            element.style.color = mark === 'X' ? 'gold' : '#ff0059';
        },
        switchPlayers: function(players) {
            this.playerOne.textContent = players[0]["marker"];
            this.playerTwo.textContent = players[1]["marker"];
            if (players[0]["marker"] === 'O') {
                this.playerOne.style.color = '#ff0059';
                this.playerTwo.style.color = 'gold';
            } else {
                this.playerOne.style.color = 'gold';
                this.playerTwo.style.color = '#ff0059';
            }
        },
        clearScreen: function() {
            gameController.resetGame();
            this.cells.forEach(cell => cell.textContent = '')
            this.displayTurn();  
        }
    }

    screenContoller.init();
})();