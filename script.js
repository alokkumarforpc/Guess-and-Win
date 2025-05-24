// Elements
const difficultySelect = document.getElementById("difficulty");
const customMaxInput = document.getElementById("customMax");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const rangeMaxSpan = document.getElementById("rangeMax");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const quitBtn = document.getElementById("quitBtn");
const message = document.getElementById("message");
const attemptsCount = document.getElementById("attemptsCount");
const scoreDisplay = document.getElementById("score");
const historyList = document.getElementById("historyList");
const darkModeToggle = document.getElementById("darkModeToggle");

let maxNum = 50;
let randomNum;
let attempts = 0;
const maxAttempts = 10;
let score = 0;
let guessHistory = [];

// Show/Hide custom max input
difficultySelect.addEventListener("change", () => {
  if (difficultySelect.value === "custom") {
    customMaxInput.classList.remove("hidden");
  } else {
    customMaxInput.classList.add("hidden");
  }
});

// Generate beep sound
function beep(freq = 440, duration = 150) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  oscillator.start();

  gainNode.gain.setValueAtTime(1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    context.currentTime + duration / 1000
  );

  oscillator.stop(context.currentTime + duration / 1000);
}

// Start Game
startBtn.addEventListener("click", () => {
  if (difficultySelect.value === "custom") {
    const customVal = parseInt(customMaxInput.value);
    if (!customVal || customVal <= 0) {
      alert("Please enter a valid custom max number");
      return;
    }
    maxNum = customVal;
  } else {
    maxNum = parseInt(difficultySelect.value);
  }

  randomNum = Math.floor(Math.random() * maxNum) + 1;
  attempts = 0;
  score = 0;
  guessHistory = [];
  guessBtn.disabled = false;
  guessInput.disabled = false;
  guessInput.value = "";
  message.textContent = "Game started! Make your guess.";
  attemptsCount.textContent = attempts;
  scoreDisplay.textContent = score;
  historyList.innerHTML = "";
  rangeMaxSpan.textContent = maxNum;
  gameArea.classList.remove("hidden");
});

// Handle Guess
guessBtn.addEventListener("click", () => {
  let guessVal = guessInput.value.trim();

  // Cheat code: show answer
  if (guessVal.toLowerCase() === "cheatcode") {
    alert(`Secret Number is: ${randomNum}`);
    guessInput.value = "";
    return;
  }

  const guess = parseInt(guessVal);

  if (isNaN(guess) || guess < 1 || guess > maxNum) {
    message.textContent = `⚠️ Please enter a valid number between 1 and ${maxNum}`;
    guessInput.value = "";
    beep(200, 200);
    return;
  }

  attempts++;
  attemptsCount.textContent = attempts;
  guessHistory.push(guess);
  historyList.innerHTML = guessHistory
    .map((g, i) => `<li>Attempt ${i + 1}: ${g}</li>`)
    .join("");

  if (guess === randomNum) {
    score = Math.max(100 - attempts * 10, 10);
    scoreDisplay.textContent = score;
    message.textContent = `🎉 Congratulations! You guessed it right in ${attempts} attempts!`;
    guessBtn.disabled = true;
    guessInput.disabled = true;
    beep(600, 400);
    return;
  } else if (guess < randomNum) {
    message.textContent = "📉 Too low! Try a higher number.";
    beep(300, 150);
  } else {
    message.textContent = "📈 Too high! Try a lower number.";
    beep(300, 150);
  }

  guessInput.value = "";

  // Vibrate on mobile
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }

  if (attempts >= maxAttempts) {
    message.textContent = `❌ Game Over! You've used all ${maxAttempts} attempts. The number was ${randomNum}.`;
    guessBtn.disabled = true;
    guessInput.disabled = true;
  }
});

// Quit Game
quitBtn.addEventListener("click", () => {
  message.textContent = "❌ You quit the game!";
  guessBtn.disabled = true;
  guessInput.disabled = true;
});

// Dark Mode Toggle
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkModeToggle.checked);
});
