const cards = document.querySelectorAll(".card");
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchesFound = 0;

// Voltear
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("active");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  hasFlippedCard = false;

  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.querySelector(".front-view img").src ===
    secondCard.querySelector(".front-view img").src;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchesFound++;
  if (matchesFound === cards.length / 2) {
    setTimeout(() => alert("¡Has encontrado todas las coincidencias!🥳🎉✨"), 500);
  }
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("active");
    secondCard.classList.remove("active");
    resetBoard();
  }, 500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Barajar

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

// Audio

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector("audio");
  const toggleAudio = document.querySelector("#toggle-audio");
  const audioIcon = document.querySelector("#audio-icon");

  audio.loop = true;
  audio.muted = false;

  const tryPlayAudio = () => {
    audio.play().catch((error) => {
      console.error("Error al intentar reproducir el audio:", error);
    });
  };

  setTimeout(() => {
    tryPlayAudio();
  }, 1000);

  document.addEventListener("click", () => {
    if (audio.paused) {
      tryPlayAudio();
    }
  });

  toggleAudio.addEventListener("click", () => {
    if (audio.muted) {
      audio.muted = false;
      audio.play().catch((error) => {
        console.error("Error al intentar reproducir el audio:", error);
      });
      audioIcon.src = "svg/full.svg";
    } else {
      audio.muted = true;
      audioIcon.src = "svg/mute.svg";
    }
  });
});

// Parejas

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("active");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  hasFlippedCard = false;

  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.querySelector(".front-view img").src ===
    secondCard.querySelector(".front-view img").src;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchesFound++;
  parejasEncontradas++;

  actualizarContador();

  if (matchesFound === cards.length / 2) {
    setTimeout(() => alert("¡Has encontrado todas las coincidencias!"), 500);
  }
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("active");
    secondCard.classList.remove("active");
    resetBoard();
  }, 500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

function actualizarContador() {
  const contadorElemento = document.getElementById("contador");
  if (contadorElemento) {
    contadorElemento.textContent = `${parejasEncontradas}/${totalParejas}`;
  } else {
    console.error('Elemento con id "contador" no encontrado');
  }
}

const totalParejas = 6;

let parejasEncontradas = 0;

actualizarContador();

// Contador

document.addEventListener("DOMContentLoaded", () => {
  let timer;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let timerStarted = false;
  const timeCounter = document.getElementById("timeCounter");

  const startTimer = () => {
    timer = setInterval(() => {
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }

      timeCounter.textContent = `${formatTime(hours)}:${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
    }, 1000);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const allCardsFound = () => {
    return (
      document.querySelectorAll(".card.found").length ===
      document.querySelectorAll(".card").length
    );
  };

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!timerStarted) {
        startTimer();
        timerStarted = true;
      }

      card.classList.add("found");

      if (allCardsFound()) {
        clearInterval(timer);
        console.log(
          "Todas las cartas han sido encontradas en " + timeCounter.textContent
        );
      }
    });
  });
});