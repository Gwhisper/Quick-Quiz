// Selecting HTML elements for the progress bar and progress text display.
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

// Function to update the progress bar based on the current time value.
const progress = (value) => {
  const percentage = (value / time) * 100; // Calculates percentage of time left.
  progressBar.style.width = `${percentage}%`; // Adjusts the progress bar's width.
  progressText.innerHTML = `${value}`; // Displays the current time left.
};

// Selecting various HTML elements related to quiz options and display.
const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

// Initializing quiz data and variables.
let questions = [], // Array to store fetched questions.
  time, // Time for each question.
  score = 0, // Initial score.
  currentQuestion, // Current question number.
  timer; // Timer interval reference.

// Function to start the quiz.
const startQuiz = () => {
  const num = numQuestions.value, // Gets number of questions.
    cat = category.value, // Gets selected category.
    diff = difficulty.value; // Gets selected difficulty level.
  loadingAnimation(); // Shows loading animation while fetching questions.

  // URL to fetch quiz questions based on chosen options.
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url) // Fetches questions from the API.
    .then((res) => res.json())
    .then((data) => {
      questions = data.results; // Stores fetched questions.
      setTimeout(() => {
        startScreen.classList.add("hide"); // Hides start screen.
        quiz.classList.remove("hide"); // Shows quiz screen.
        currentQuestion = 1; // Initializes current question to 1.
        showQuestion(questions[0]); // Displays the first question.
      }, 1000); // Delays quiz start for a second.
    })
    .catch((error) => {
      console.error("Error fetching questions:", error); // Logs any fetch errors.
    });
};

// Adds click event to the Start button to trigger the startQuiz function.
startBtn.addEventListener("click", startQuiz);

// Function to display each question and its answers.
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question; // Displays question text.

  // Combines correct and incorrect answers, then shuffles them.
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = ""; // Clears previous answers.
  answers.sort(() => Math.random() - 0.5); // Shuffles answers.

  // Creates answer elements and adds them to the answers wrapper.
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                  <div class="answer">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  // Shows the question number and total questions.
  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;

  // Adds click event to each answer choice for selection.
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected"); // Removes previous selections.
        });
        answer.classList.add("selected"); // Highlights selected answer.
        submitBtn.disabled = false; // Enables submit button.
      }
    });
  });

  time = parseInt(timePerQuestion.value, 10); // Sets time for each question.
  startTimer(time); // Starts the countdown timer.
};

// Function to start and control the countdown timer.
const startTimer = (initialTime) => {
  let time = initialTime;
  progress(time); // Updates progress bar.
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3"); // Plays countdown sound at 3 seconds left.
    }
    if (time >= 0) {
      progress(time); // Updates progress bar every second.
      time--;
    } else {
      clearInterval(timer); // Stops timer when time is up.
      checkAnswer(); // Checks the answer when time is out.
    }
  }, 1000);
};

// Function to show loading animation on the Start button.
const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

// Submit button triggers the checkAnswer function.
const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

// Next button moves to the next question.
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block"; // Shows submit button.
  nextBtn.style.display = "none"; // Hides next button.
});

// Function to check if the selected answer is correct.
const checkAnswer = () => {
  clearInterval(timer); // Stops timer when checking answer.
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++; // Increments score if answer is correct.
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
          answer.classList.add("correct"); // Highlights the correct answer.
        }
      });
    }
  } else {
    // Highlights the correct answer if none was selected.
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }
  // Disables answer selection and shows next button.
  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });
  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

// Function to show the next question or display the score if quiz is complete.
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore(); // Shows score if there are no more questions.
  }
};

// Selecting elements for the end screen to display the score.
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

// Displays the user's final score at the end of the quiz.
const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score; // Shows score.
  totalScore.innerHTML = `/ ${questions.length}`; // Shows total questions.
};

// Restart button reloads the page to reset the quiz.
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

// Plays audio for countdown warning.
const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};

// Save button records the score with username, category, and difficulty.
const saveBtn = document.querySelector(".save");
const messageDiv = document.getElementById("message");

saveBtn.addEventListener("click", () => {
  const usernameInput = document.getElementById("username").value;
  const selectedCategory = category.options[category.selectedIndex].text; // Get selected category text.
  const selectedDifficulty = difficulty.options[difficulty.selectedIndex].text; // Get selected difficulty text.

  if (usernameInput) {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const newScore = {
      name: usernameInput,
      score: score,
      category: selectedCategory, // Add selected category.
      difficulty: selectedDifficulty // Add selected difficulty.
    };
    highScores.push(newScore);
    localStorage.setItem("highScores", JSON.stringify(highScores)); // Saves score in local storage.
    messageDiv.innerHTML = "Your score has been recorded!";
    messageDiv.style.display = "block"; // Shows success message.
  } else {
    alert("Please enter a username."); // Alerts if no username is entered.
  }
});
