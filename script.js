const player = sign => {
    return { sign };
};

const gameBoard = (() => {
    const cells = new Array(9);
    let marked = 0;
    let result = null;
    const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    const markCell = (index, sign) => {
        cells[index] = sign;
        marked++;
    };

    const reset = () => {
        cells.forEach((_, index) => cells[index] = null);
        marked = 0;
        result = null;
    };

    const checkResult = () => {
        winConditions.forEach(row => {
            if(cells[row[0]]){
                if((cells[row[0]] === cells[row[1]]) && (cells[row[0]]  === cells[row[2]])) {
                    result = cells[row[0]];
                    displayController.endgame(result);
                }
            }
        });

        if(marked==9 && !result) {
            result = "DRAW";
            displayController.endgame(result);
        }
    };

    return { markCell, reset, checkResult };
})();

const displayController = (() => {
    const cellElements = document.querySelectorAll(".cell");
    const restartButton = document.querySelector(".restart");
    const board = document.querySelector(".bigContainer");
    const resultDiv = document.querySelector(".resultDiv");
    const resultH1 = document.querySelector(".result");
    const playerX = player("X");
    const playerO = player("O");
    let currentPlayer = playerX;
    let gameOver = false;
    
    const changeCurrentPlayer = () => {
        if(currentPlayer == playerX) currentPlayer = playerO;
        else currentPlayer = playerX;
    };

    const restart = () => {
        cellElements.forEach(cellElement => cellElement.textContent = "");
        gameBoard.reset();
        currentPlayer = playerX;
        gameOver = false;
        board.classList.remove("blur");
        resultDiv.classList.add("hide");
        
    };

    restartButton.onclick = restart;
    resultDiv.onclick = restart;

    cellElements.forEach(cellElement => {
        cellElement.onclick = () => {
            if(!cellElement.textContent && !gameOver){
                makeMove(cellElement);
            }
        };
    });

    const makeMove = cellElement => {
        cellElement.textContent = currentPlayer.sign;
        gameBoard.markCell(cellElement.id, currentPlayer.sign);
        gameBoard.checkResult();
        changeCurrentPlayer();
    };

    const endgame = result => {
        gameOver = true;
        board.classList.add("blur");
        resultDiv.classList.remove("hide");
        resultH1.innerHTML = result;
        if(result=="DRAW") resultH1.style.fontSize = "70px";
        else resultH1.style.fontSize = "200px";
    };

    return { endgame };
})();