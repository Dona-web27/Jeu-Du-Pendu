// === Initialisation des variables ===
const words = [
  "ordinateur",
  "javascript",
  "programmer",
  "developpeur",
  "souris",
];
let secretWord = "";
let displayedWord = [];
let guessedLetters = [];
let remainingTries = 7;

// === Sélection des éléments HTML ===
const penduImage = document.getElementById("penduImage");
const hiddenWordSpan = document.getElementById("hiddenWord");
const guessedLettersSpan = document.getElementById("guessedLetters");
const remainingAttemptsSpan = document.getElementById("remainingAttempts");
const letterInput = document.getElementById("letterInput");
const guessButton = document.getElementById("guessButton");
const resetButton = document.getElementById("resetButton");

const rulesBox = document.getElementById("gameDescription");
const openInfoButton = document.getElementById("openInfo");
const closeInfoButton = document.getElementById("infoButton");
const modalOverlay = document.getElementById("modalOverlay");
const muteButton = document.getElementById("muteButton");
const backgroundMusic = new Audio("sons/sport-epic-race-loop-edit-234478.mp3");
const correctSound = new Audio("sons/correct.mp3");
const wrongSound = new Audio("sons/wrong.mp3");
const victorySound = new Audio("sons/victoire.mp3");
const defeatSound = new Audio("sons/defaite.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

let isMuted = false;
muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  backgroundMusic.muted = isMuted;
  muteButton.textContent = isMuted ? "🔇" : "🔊";
});

// === Fonction pour choisir un mot aléatoire et réinitialiser le jeu ===
function initGame() {
  secretWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  displayedWord = Array(secretWord.length).fill("_");
  guessedLetters = [];
  remainingTries = 7;
  updateDisplay();
  letterInput.value = "";
  letterInput.focus();
  penduImage.src = `Img/pendu1.jpg`;
  document.querySelector(".word").classList.remove("victory");
  document.querySelector(".container").classList.remove("defeat", "danger");
  if (!isMuted) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
  }
}

// === AFFICHER LE JEU ACTUALISÉ ===
function updateDisplay() {
  hiddenWordSpan.textContent = displayedWord.join(" ");
  guessedLettersSpan.textContent = guessedLetters.join(", ");
  remainingAttemptsSpan.textContent = "❤️".repeat(remainingTries);
}

// === FONCTION VICTOIRE (avec confettis) ===
function handleVictory() {
    backgroundMusic.pause();
    victorySound.play();
    document.querySelector(".word").classList.add("victory");
    launchConfetti();
    setTimeout(() => {
      alert("🎉 Bravo, vous avez gagné !");
    }, 200);
}

// === FONCTION DÉFAITE ===
 function handleDefeat() { 
    backgroundMusic.pause();
    defeatSound.play();
    document.querySelector(".container").classList.add("defeat");
    setTimeout(() => {
    alert(`💀 Perdu ! Le mot était : ${secretWord}`);
    }, 200);
  }
  
// ==== AJOUT DES CONFETTI AU CAS D'UNE VICTOIRE ====
function launchConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 100,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 100,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// === DEVINER UNE LETTRE ===
function handleGuess() {
  const letter = letterInput.value.toUpperCase();
  if (!letter.match(/[A-ZÀ-Ÿ]/i) || guessedLetters.includes(letter)) {
    letterInput.value = "";
    if (remainingTries === 1) {
      document.querySelector(".container").classList.add("danger");
    } 
    return;
  }
  
  guessedLetters.push(letter);

  if (secretWord.includes(letter)) {
    correctSound.play();
    letterInput.classList.add("correct");
    [...secretWord].forEach((char, i) => {
      if (char === letter) displayedWord[i] = letter;
    });
  } else {
    wrongSound.play();
    letterInput.classList.add("wrong");
    remainingTries--;
    penduImage.src = `Img/pendu${8 - remainingTries}.jpg`;
  }

  // Supprimer la classe après l'animation
  setTimeout(() => {
    letterInput.classList.remove("correct", "wrong");
  }, 400);

  updateDisplay();
  letterInput.value = "";
  letterInput.focus();
  
  if (!displayedWord.includes("_")) {
   handleVictory();
  } else if (remainingTries === 0) {
   handleDefeat();
  }

  // === ÉCOUTEURS ===
  guessButton.addEventListener("click", handleGuess);
  resetButton.addEventListener("click", initGame);
  
  // ==== Déclencher la vérification avec la touche "Enter" ====
  letterInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      guessButton.click();
    }
  });


// === Afficher / Masquer les règles ===
openInfoButton.addEventListener("click", () => {
  openInfoButton.style.display = "none";
  document.body.classList.add("modal-open");
  modalOverlay.classList.add("visible");
  rulesBox.classList.add("visible");
  closeInfoButton.focus(); // Pour l'accebilité clavier
});

// ===== Cacher les règles avec animation ====
closeInfoButton.addEventListener("click", () => {
  openInfoButton.style.display = "block";
  document.body.classList.remove("modal-open");
  modalOverlay.classList.remove("visible");
  rulesBox.classList.remove("visible");
  openInfoButton.focus(); // retour du focus
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("visible")) {
    closeInfoButton.click();
  }
});

// === Lancer le jeu au chargement de la page ===
window.addEventListener("load", () => {
  backgroundMusic.play().catch((error) => {
    console.warn("Lecture automatique bloqué:", error);
  });

  initGame();
});
