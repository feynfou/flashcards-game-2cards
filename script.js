let flashcards = {};
let currentCategory = [];
let score = 0;
let currentSound = "";

// DOM elements
const gameGrid = document.getElementById("game-grid");
const feedback = document.getElementById("feedback");
const scoreDiv = document.getElementById("score");
const replayButton = document.getElementById("replay-sound");
const menuButton = document.getElementById("menu-button");
const menuDiv = document.getElementById("menu");
const categoryDiv = document.querySelector(".category-buttons");

// Category icons
const categoryIcons = {
  letters: "🔤",
  animals: "🐾",
  colors: "🎨",
  emotions: "😊",
  food: "🍎",
  house: "🏠",
  body: "🧍"
};

// Load JSON and create buttons dynamically
fetch("Flashcards.json")
  .then(res => res.json())
  .then(data => {
    flashcards = data;
    categoryDiv.innerHTML = ""; // clear any placeholder

    Object.keys(flashcards).forEach(cat => {
      const btn = document.createElement("button");
      btn.classList.add("category-button");
      btn.innerHTML = `${categoryIcons[cat] || "❓"} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
      btn.addEventListener("click", () => {
        currentCategory = flashcards[cat];
        score = 0;
        scoreDiv.textContent = `Score: ${score}`;
        menuDiv.style.display = "none";
        loadRandomWord();
      });
      categoryDiv.appendChild(btn);
    });
  })
  .catch(err => console.error("Error loading JSON:", err));

// Play sound
function playSound(file) {
  const audio = new Audio(file);
  audio.play();
}

// Random options
function getRandomOptions(correctCard) {
  const options = [{ image: correctCard.image, correct: true }];
  let randomCard;
  do {
    randomCard = currentCategory[Math.floor(Math.random() * currentCategory.length)];
  } while (randomCard.image === correctCard.image);
  options.push({ image: randomCard.image, correct: false });
  return options.sort(() => Math.random() - 0.5);
}

// Load random card
function loadRandomWord() {
  if (!currentCategory.length) return;
  gameGrid.innerHTML = "";
  feedback.textContent = "";
  const randomIndex = Math.floor(Math.random() * currentCategory.length);
  const current = currentCategory[randomIndex];
  currentSound = current.audio;

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

// Feedback
function showFeedback(message) {
  feedback.textContent = message;
  feedback.classList.add("show");
  setTimeout(() => feedback.classList.remove("show"), 1000);
}

// Selection
function chooseOption(img, isCorrect) {
  if (isCorrect) {
    score++;
    img.classList.add("correct");
    scoreDiv.textContent = `Score: ${score}`;
    showFeedback("🎉 Bravo!");
    launchConfetti();
    const bravo = new Audio("sounds/Bravo.m4a");
    bravo.play();
    bravo.addEventListener("ended", () => setTimeout(loadRandomWord, 300));
  } else {
    showFeedback("❌ Try again!");
    const noBravo = new Audio("sounds/NoBravo.m4a");
    noBravo.play();
  }
}

// Replay sound
replayButton.addEventListener("click", () => { if (currentSound) playSound(currentSound); });

// Menu button
menuButton.addEventListener("click", () => {
  menuDiv.style.display = "flex";
  gameGrid.innerHTML = "";
  score = 0;
  scoreDiv.textContent = `Score: ${score}`;
});

// Confetti
function launchConfetti() {
  const duration = 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#ff0a54','#ff477e','#ff7096','#ff85a1','#fbb1b8','#f9bec7','#f7cad0','#fae0e4','#00bfff','#32cd32','#ffa500','#ffff00'];

  const interval = setInterval(function(){
    const timeLeft = animationEnd - Date.now();
    if(timeLeft <=0) return clearInterval(interval);
    const particleCount = 20 + Math.floor(Math.random()*20);
    confetti({
      particleCount,
      startVelocity:40 + Math.random()*20,
      spread: 100 + Math.random()*40,
      gravity:0.6,
      ticks:60,
      origin: {x: Math.random(), y:0.3},
      colors,
      scalar:1.2
    });
  },200);
}
