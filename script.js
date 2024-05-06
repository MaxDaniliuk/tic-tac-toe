

const gameboard = (function() {
    const board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
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

//Contains the logic of the game
const gameController = (function() {
    const board = gameboard.getBoard();
    const playerOne = 'Player One';
    const playerTwo = 'Player Two';

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
    //const getActivePlayer = () => activePlayer;

    //Switches players after each move
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${activePlayer.name}'s turn!`);
    }

    //Evaluates whether it is a tie or not that is based on empty cells
    const checkTie = () => {
        const flattenedBoard = [].concat(...board);
        const numOfEmptyCells = flattenedBoard.filter((emptyString) => (emptyString === ' ')).length;
        if (numOfEmptyCells === 0) {
            console.log(`It's a tie!`)
            return true;
        } else {
            return false;
        }
    }

    const checkWin = () => {
        if ((board[0][0] !== ' ' && board[0][0] === board[0][1] && board[0][1] === board[0][2]) || 
            (board[1][0] !== ' ' && board[1][0] === board[1][1] && board[1][1] === board[1][2]) || 
            (board[2][0] !== ' ' && board[2][0] === board[2][1] && board[2][1] === board[2][2]) || 
            (board[0][0] !== ' ' && board[0][0] === board[1][0] && board[1][0] === board[2][0]) || 
            (board[0][1] !== ' ' && board[0][1] === board[1][1] && board[1][1] === board[2][1]) || 
            (board[0][2] !== ' ' && board[0][2] === board[1][2] && board[1][2] === board[2][2]) || 
            (board[0][0] !== ' ' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) || 
            (board[0][2] !== ' ' && board[0][2] === board[1][1] && board[1][1] === board[2][0])
        ) { 
            console.log(`${activePlayer.name} won!!!`)
            return true;
        } else {
            return false;
        }
    }

    //Allows to selet a cell, however, does not prevent from ticking taken slots. 
    //Won't be required after listening to the 'click' events
    const tickCell = () => { 
        let cell = Number(prompt(`${activePlayer.name} choose the cell 1 - 9: `));
        let count = 1;
        outer:
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (count === cell) {
                     board[i][j] = activePlayer.marker;
                     gameboard.displayBoard(board);
                     break outer;
                 }
                 count++;
            }
        }
    }

    return { tickCell, switchPlayerTurn, checkWin, checkTie }
})();

//Runs the game 
(function() { 
    while(true) {
        gameController.tickCell();
        if (gameController.checkWin() || gameController.checkTie()) {
            break;
        }
        gameController.switchPlayerTurn();
    }
})(); 



