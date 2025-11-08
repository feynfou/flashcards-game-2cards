let flashcards = [];
let currentIndex = 0;
let score = 0;
let currentSound = "";

const gameGrid = document.getElementById("game-grid");
const feedback = document.getElementById("feedback");
const scoreDiv = document.getElementById("score");
const replayButton = document.getElementById("replay-sound");

// Load the JSON data
fetch("Flashcards.json")
  .then(response => response.json())
  .then(data => {
    flashcards = data;
    loadWord();
  })
  .catch(error => console.error("Error loading JSON:", error));

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

function loadWord() {
  gameGrid.innerHTML = "";
  feedback.textContent = "";
  const current = flashcards[currentIndex];

  // store the current sound for replay button
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

function chooseOption(img, isCorrect) {
  if (isCorrect) {
    score++;
    img.classList.add("correct");
    feedback.textContent = "🎉 Bravo!";
    scoreDiv.textContent = `Score: ${score}`;

    const bravo = new Audio("sounds/Bravo.m4a");
    bravo.play();
    bravo.addEventListener("ended", () => {
      setTimeout(nextWord, 300);
    });
  } else {
    feedback.textContent = "❌ Try again!";
    const noBravo = new Audio("sounds/NoBravo.m4a");
    noBravo.play();
  }
}

function nextWord() {
  currentIndex = (currentIndex + 1) % flashcards.length;
  loadWord();
}

// Replay sound button
replayButton.addEventListener("click", () => {
  if (currentSound) playSound(currentSound);
});
