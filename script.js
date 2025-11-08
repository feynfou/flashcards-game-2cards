let flashcards = [];
let score = 0;
let currentSound = "";

const gameGrid = document.getElementById("game-grid");
const feedback = document.getElementById("feedback");
const scoreDiv = document.getElementById("score");
const replayButton = document.getElementById("replay-sound");

// Load JSON
fetch("Flashcards.json")
  .then(res => res.json())
  .then(data => {
    flashcards = data;
    loadRandomWord(); // start with a random word
  })
  .catch(err => console.error("Error loading JSON:", err));

function playSound(file) {
  const audio = new Audio(file);
  audio.play();
}

// Pick 1 correct + 1 random incorrect option
function getRandomOptions(correctCard) {
  const options = [];
  options.push({ image: correctCard.image, correct: true });

  let randomCard;
  do {
    randomCard = flashcards[Math.floor(Math.random() * flashcards.length)];
  } while (randomCard.image === correctCard.image);

  options.push({ image: randomCard.image, correct: false });

  // Shuffle
  return options.sort(() => Math.random() - 0.5);
}

// Load a random card each round
function loadRandomWord() {
  gameGrid.innerHTML = "";
  feedback.textContent = "";

  const randomIndex = Math.floor(Math.random() * flashcards.length);
  const current = flashcards[randomIndex];

  currentSound = current.audio; // store for replay

  const options = getRandomOptions(current);
  options.forEach(opt => {
    const container = document.createElement("div");
    container.classList.add("card-container");

    const img = document.createElement("img");
    img.src = opt.image;
    img.addEventListener("click", () => chooseOption(img, opt.correct));
    container.appendChild(img);
    gameGrid.appendChild(container);
  });

  playSound(current.audio);
}

// Show big feedback in the middle
function showFeedback(message) {
  feedback.textContent = message;
  feedback.classList.add("show");

  setTimeout(() => {
    feedback.classList.remove("show");
  }, 1000); // fades out after 1s
}

// Handle selection
function chooseOption(img, isCorrect) {
  if (isCorrect) {
    score++;
    img.classList.add("correct");
    scoreDiv.textContent = `Score: ${score}`;
    showFeedback("🎉 Bravo!");

    launchConfetti(); // trigger confetti

    const bravo = new Audio("sounds/Bravo.m4a");
    bravo.play();
    bravo.addEventListener("ended", () => {
      setTimeout(loadRandomWord, 300);
    });
  } else {
    showFeedback("❌ Try again!");
    const noBravo = new Audio("sounds/NoBravo.m4a");
    noBravo.play();
  }
}

// Replay button
replayButton.addEventListener("click", () => {
  if (currentSound) playSound(currentSound);
});

// Enhanced multicolor confetti effect
function launchConfetti() {
  const duration = 1000; // total duration of confetti
  const animationEnd = Date.now() + duration;

  const colors = [
    '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', 
    '#fbb1b8', '#f9bec7', '#f7cad0', '#fae0e4', 
    '#00bfff', '#32cd32', '#ffa500', '#ffff00'
  ];

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 20 + Math.floor(Math.random() * 20);
    confetti({
      particleCount: particleCount,
      startVelocity: 40 + Math.random() * 20, // varied speed
      spread: 100 + Math.random() * 40,       // varied spread
      gravity: 0.6,
      ticks: 60, // lasts ~1.5s
      origin: { x: Math.random(), y: 0.3 },   // random top position
      colors: colors,
      scalar: 1.2
    });
  }, 200); // launch every 200ms
}
