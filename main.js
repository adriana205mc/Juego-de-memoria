const totalCards = 12;
const availableImages = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;
let gameFinished = false;

const stats = document.querySelector('#stats');
const gameBoard = document.querySelector('#game');
const repeatButton = document.querySelector('.repeatButton');
let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

let startTime = null;
let timer;
let gameStarted = false;

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
}

function updateCounter() {
    if (startTime !== null) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        document.getElementById('timeCounter').textContent = formatTime(elapsedTime);
    }
}

function startTimer() {
    if (!gameStarted) {
        startTime = Date.now();
        timer = setInterval(updateCounter, 1000);
        gameStarted = true;
    }
}

function stopTimer() {
    clearInterval(timer);
    gameStarted = false;
}

function resetTimer() {
    startTime = null;
    document.getElementById('timeCounter').textContent = "00:00:00";
}

function activate(e) {
    if (currentMove < 2 && !gameFinished) {
        if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
            e.target.classList.add('active');
            selectedCards.push(e.target);

            if (++currentMove === 2) {
                currentAttempts++;
                stats.innerHTML = currentAttempts + ' intentos';

                if (selectedCards[0].querySelector('.face').style.backgroundImage === selectedCards[1].querySelector('.face').style.backgroundImage) {
                    selectedCards = [];
                    currentMove = 0;
                    
                    if (document.querySelectorAll('.card.active').length === totalCards) {
                        gameFinished = true;
                        stopTimer();
                        repeatButton.style.display = 'block';
                    }
                } else {
                    setTimeout(() => {
                        selectedCards[0].classList.remove('active');
                        selectedCards[1].classList.remove('active');
                        selectedCards = [];
                        currentMove = 0;
                    }, 600);
                }
            }
        }
    }
}

function getFaceValue(value) {
    return `url('img/${availableImages[value % availableImages.length]}.png')`;
}

function setupCards() {
    gameBoard.innerHTML = '';
    valuesUsed = [];
    selectedCards = [];
    currentMove = 0;
    currentAttempts = 0;
    stats.innerHTML = currentAttempts + ' intentos';
    gameFinished = false;

    for (let i = 0; i < totalCards / 2; i++) {
        valuesUsed.push(i);
        valuesUsed.push(i);
    }

    valuesUsed.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalCards; i++) {
        let div = document.createElement('div');
        div.innerHTML = cardTemplate;
        div.classList.add('card-container');
        div.querySelector('.face').style.backgroundImage = getFaceValue(valuesUsed[i]);
        div.querySelector('.card').addEventListener('click', (e) => {
            if (!gameStarted) {
                startTimer();
            }
            activate(e);
        });
        gameBoard.appendChild(div);
    }

    repeatButton.style.display = 'none';
}

function startGame() {
    resetTimer();
    setupCards();
}

window.onload = () => {
    startGame();
    repeatButton.addEventListener('click', startGame);
};