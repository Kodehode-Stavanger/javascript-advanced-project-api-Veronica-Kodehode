async function getData() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    quizData = data.results;
    quiz();
  } catch (error) {
    console.error("Error:", error);
  }
}

const container = document.getElementById("container");
const start = document.getElementById("start");
const topContainer = document.getElementById("top-container");
const bottomContainer = document.getElementById("bottom-container");
let currentQuestionIndex = 0;
let quizData = [];

function quiz() {
  const currentQuestion = quizData[currentQuestionIndex];
  const questionElement = document.createElement("div");
  questionElement.classList.add("question");
  questionElement.textContent = decodeHTMLEntities(currentQuestion.question);
  topContainer.innerHTML = "";
  topContainer.appendChild(questionElement);

  const options = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ];
  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = decodeHTMLEntities(option);
    optionButton.classList.add("option");
    optionButton.addEventListener("click", () =>
      checkAnswer(option === currentQuestion.correct_answer)
    );
    topContainer.appendChild(optionButton);
  });

  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.textContent = "Next question";
  nextButton.style.display = "none";
  bottomContainer.appendChild(nextButton);
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      quiz();
      nextButton.style.display = "none";
    } else {
      alert("Quiz finished!");
    }
  });
}

function checkAnswer(isCorrect, selected) {
  const optionButtons = document.querySelectorAll(".option");
  optionButtons.forEach((button) => {
    // if (button === selected) {
    //   button.classList.add("selected");
    // }
    if (button.textContent === quizData[currentQuestionIndex].correct_answer) {
      button.classList.toggle("right");
    } else {
      button.classList.toggle("wrong");
    }
    button.disabled = true;
  });

  const nextButton = document.getElementById("next");
  nextButton.style.display = "block";
}

start.addEventListener("click", () => {
  getData();
});

function decodeHTMLEntities(text) {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(text, "text/html").body
    .textContent;
  return decodedString;
}
