document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const audio = document.querySelector("audio");
  const toggleAudio = document.querySelector("#toggle-audio");
  const audioIcon = document.querySelector("#audio-icon");
  const timeCounter = document.getElementById("timeCounter");
  const contadorElemento = document.getElementById("contador");

  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matchesFound = 0;
  let parejasEncontradas = 0;
  let timer;
  let seconds = 0,
    minutes = 0,
    hours = 0;
  let timerStarted = false;

  const totalParejas = 6;

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

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const allCardsFound = () =>
    document.querySelectorAll(".card.found").length === cards.length;

  const actualizarContador = () => {
    if (contadorElemento) {
      contadorElemento.textContent = `${parejasEncontradas}/${totalParejas}`;
    } else {
      console.error('Elemento con id "contador" no encontrado');
    }
  };

  audio.loop = true;
  audio.muted = false;

  const tryPlayAudio = () => {
    audio
      .play()
      .catch((error) =>
        console.error("Error al intentar reproducir el audio:", error)
      );
  };

  setTimeout(() => tryPlayAudio(), 1000);

  document.addEventListener("click", () => {
    if (audio.paused) {
      tryPlayAudio();
    }
  });

  toggleAudio.addEventListener("click", () => {
    audio.muted = !audio.muted;
    audioIcon.src = audio.muted ? "svg/mute.svg" : "svg/full.svg";
  });

  (function shuffle() {
    cards.forEach((card) => {
      let randomPos = Math.floor(Math.random() * cards.length);
      card.style.order = randomPos;
    });
  })();

  function flipCard() {
    if (lockBoard || this === firstCard) return;

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
      setTimeout(() => {
        alert("¡Felicidades!\n¡Has encontrado todas las coincidencias!");
        reiniciarJuego();
      }, 500);
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

  function reiniciarJuego() {
    clearInterval(timer);
    timerStarted = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timeCounter.textContent = "00:00:00";

    cards.forEach((card) => {
      card.classList.remove("active", "found");
      card.addEventListener("click", flipCard);
    });

    (function shuffle() {
      cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
      });
    })();

    parejasEncontradas = 0;
    matchesFound = 0;
    actualizarContador();
  }

  cards.forEach((card) => card.addEventListener("click", flipCard));

  cards.forEach((card) => {
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