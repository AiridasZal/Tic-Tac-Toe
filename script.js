const firstPlayer = document.getElementById('firstPlayer');
const secondPlayer = document.getElementById('secondPlayer');
const startButton = document.getElementById('startGame');
const playerForm = document.getElementById('playerInformation');
const game = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const clearBoardBtn = document.getElementById('clearBoard');
const resetScoreBtn = document.getElementById('resetScore');
const gameStatusText = document.getElementById('statusText');
let winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let score = [0,0];
let localScore;
let currentPlayer = "X";
let gameActive = false;

firstPlayer.addEventListener('keyup', validate);
secondPlayer.addEventListener('keyup', validate);
startButton.addEventListener('click', startGame);

function validate() {
    if (firstPlayer.value === '' || secondPlayer.value === '' || firstPlayer.value === secondPlayer.value) {
        startButton.disabled = true;
    } else {
        startButton.disabled = false;
    }
}

function startGame() {
    playerForm.addEventListener('submit', function (event) {
        event.preventDefault();
    })
    playerForm.style.display='none';
    game.style.display='flex';
    let tempName = firstPlayer.value;
    let result = tempName.charAt(0).toUpperCase() + tempName.slice(1).toLowerCase();
    sessionStorage.setItem('1Player', result);
    tempName = secondPlayer.value;
    result = tempName.charAt(0).toUpperCase() + tempName.slice(1).toLowerCase();
    sessionStorage.setItem('2Player', result);
    sessionStorage.setItem('score', score);
    document.getElementById('firstPlayerName').innerHTML = sessionStorage.getItem('1Player');
    document.getElementById('secondPlayerName').innerHTML = sessionStorage.getItem('2Player');
    localScore = sessionStorage.getItem('score').split(',');
    document.getElementById('firstPlayerScore').innerHTML = localScore[0];
    document.getElementById('secondPlayerScore').innerHTML = localScore[1];
    gameActive = true;
    gameStatusText.innerText = `${sessionStorage.getItem('1Player')} (X)'s turn`;
}

window.addEventListener('DOMContentLoaded', () => {
    if(sessionStorage.getItem('1Player') !== null && sessionStorage.getItem('2Player') !== null) {
        playerForm.style.display='none';
        game.style.display='flex';
        document.getElementById('firstPlayerName').innerHTML = sessionStorage.getItem('1Player');
        document.getElementById('secondPlayerName').innerHTML = sessionStorage.getItem('2Player');
        localScore = sessionStorage.getItem('score').split(',');
        document.getElementById('firstPlayerScore').innerHTML = localScore[0];
        document.getElementById('secondPlayerScore').innerHTML = localScore[1];
        gameActive = true;
        gameStatusText.innerText = `${sessionStorage.getItem('1Player')} (X)'s turn`;
    }

    let backToStart = document.getElementById('toInfo');
    backToStart.addEventListener('click', () => {
        sessionStorage.clear();
        location.reload();
    })

    cells.forEach(cell => cell.addEventListener('click', placeMarker));
    
    cells.forEach(cell => cell.addEventListener('click', () => {
        if(options.includes('') || !gameActive) {
            backToStart.disabled = true;
            clearBoardBtn.disabled = false;
            resetScoreBtn.disabled = true;
        }
        else {
            backToStart.disabled = false;
            clearBoardBtn.disabled = true;
            resetScoreBtn.disabled = false;
        }
    }))

    function placeMarker(){
        const cellIndex = this.getAttribute("cellIndex");
        if(options[cellIndex] != '' || !gameActive) {
            return;
        }
        updateCell(this, cellIndex);
        checkWinner();
    }

    document.addEventListener('keydown', event => {
        let buttonMapping = {
            '1': 6,
            '2': 7,
            '3': 8,
            '4': 3,
            '5': 4,
            '6': 5,
            '7': 0,
            '8': 1,
            '9': 2
            };
        if (event.key >= 1 && event.key <= 9) {
            cellIndex = buttonMapping[event.key];
            /*Convert the cells NodeList object to an array, using spread operator (...). This allows us to use the find method, which is not available on NodeList objects. */
            let cell = [...cells].find(cell => cell.getAttribute('cellIndex') == cellIndex);
            if(options[cellIndex] != '' || !gameActive) {
                return;
            }
            updateCell(cell, cellIndex);
            checkWinner();
            if(options.includes('') || !gameActive) {
                backToStart.disabled = true;
                clearBoardBtn.disabled = false;
                resetScoreBtn.disabled = true;
            }
            else {
                backToStart.disabled = false;
                clearBoardBtn.disabled = true;
                resetScoreBtn.disabled = false;
            }
        }
      });

    function updateCell(cell, index){
        options[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.remove('empty');
        cell.classList.add('taken');
    }

    function checkWinner(){
        let roundWon = false;
        for(let i = 0; i <= 7; i++) {
            const winCondition = winningCombos[i];
            let a = options[winCondition[0]];
            let b = options[winCondition[1]];
            let c = options[winCondition[2]];
            if(a === '' || b === '' || c === '') {
                continue;
            }
            if(a === b && b === c) {
                roundWon = true;
                cells[winCondition[0]].classList.add('highlighted');
                cells[winCondition[1]].classList.add('highlighted');
                cells[winCondition[2]].classList.add('highlighted');
                cells.forEach(cell => cell.classList.add('taken'));
                cells.forEach(cell => cell.classList.remove('empty'));
                gameActive = false;
                break;
            }
        }
        if(roundWon) {
            gameActive = false;
            if(currentPlayer === 'X') {
                gameStatusText.innerHTML = sessionStorage.getItem('1Player') + " (X) wins!";
                gameStatusText.classList.add('matchEnd');
                score[0]++;
                sessionStorage.setItem('score', score);
                localScore = sessionStorage.getItem('score').split(',');
                document.getElementById('firstPlayerScore').innerHTML = localScore[0];
            }
            else{
                gameStatusText.innerHTML = sessionStorage.getItem('2Player') + " (O) wins!";
                gameStatusText.classList.add('matchEnd');
                score[1]++;
                sessionStorage.setItem('score', score);
                localScore = sessionStorage.getItem('score').split(',');
                document.getElementById('secondPlayerScore').innerHTML = localScore[1];
            }
        }
        else if(!options.includes('')) {
            gameStatusText.innerHTML = "It's a tie!";
            gameStatusText.classList.add('matchDraw');
            clearBoardBtn.disabled = false;
            gameActive=false;
        }
        else {
            changePlayer();
        }
    }

    function changePlayer(){
        currentPlayer = (currentPlayer == "X") ? "O" : "X";
        if(currentPlayer === 'X') {
            gameStatusText.innerText = `${sessionStorage.getItem('1Player')} (X)'s turn`;
        }
        else {
            gameStatusText.innerText = `${sessionStorage.getItem('2Player')} (O)'s turn`;
        }        
    }

    clearBoardBtn.addEventListener('click', () => {
        options = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => cell.innerHTML = '');
        currentPlayer = "X";
        gameActive = true;
        gameStatusText.innerText = `${sessionStorage.getItem('1Player')} (X)'s turn`;
        gameStatusText.classList.remove('matchEnd');
        gameStatusText.classList.remove('matchDraw');
        clearBoardBtn.disabled = true;
        backToStart.disabled = false;
        resetScoreBtn.disabled = false;
        cells.forEach(cell => cell.classList.remove('taken'));
        cells.forEach(cell => cell.classList.add('empty'));
        cells.forEach(cell => cell.classList.remove('highlighted'));
    })

    resetScoreBtn.addEventListener('click', () => {
        score = [0,0];
        sessionStorage.setItem('score', score);
        localScore = sessionStorage.getItem('score').split(',');
        document.getElementById('firstPlayerScore').innerHTML = localScore[0];
        document.getElementById('secondPlayerScore').innerHTML = localScore[1];
    })
})

