document.addEventListener("DOMContentLoaded", function () {
  const startScreen = document.querySelector(".start-screen");
  const quizContainer = document.querySelector(".quiz-container");
  const startButton = document.getElementById("startButton");
  const categorySelect = document.getElementById("categorySelect");
  const difficultySelect = document.getElementById("difficultySelect");
  const typeSelect = document.getElementById("typeSelect"); // Added typeSelect
  const userInput = document.getElementById("userInput");
  const checkAnswerButton = document.getElementById("navButton");
  const goBackButton = document.getElementById("goBack");
  const restartQuizButton = document.getElementById("restartQuiz");
  const timerElement = document.getElementById("timer");

  let correctAnswersCount = 0;
  let incorrectAnswersCount = 0;
  let currentQuestionIndex = 0;
  let triviaData = [];
  let timer;
  let timeInSeconds = 0;
  let selectedType = ""; // Added selectedType variable
  let selectedAnswer = ""; // Variable to store the user's selected answer

  function startTimer() {
    timer = setInterval(function () {
      timeInSeconds++;
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      timerElement.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  startButton.addEventListener("click", function () {
    const selectedCategory = categorySelect.value;
    const selectedDifficulty = difficultySelect.value;
    selectedType = typeSelect.value.toLowerCase(); // Convert to lowercase

    fetchTrivia(selectedCategory, selectedDifficulty, selectedType)
      .then((trivia) => {
        startScreen.style.display = "none";
        quizContainer.style.display = "flex";
        triviaData = trivia;
        displayQuestion(currentQuestionIndex);
        startTimer();
      })
      .catch((error) => {
        console.error("Error fetching trivia:", error);
      });
  });

  checkAnswerButton.addEventListener("click", function () {
    const progressBar = document.querySelector(".progress-bar");

    // Check if the user has provided an answer
    if (!selectedAnswer && selectedType !== "type") {
      alert("Please select or type an answer before proceeding.");
      return; // Stop the function execution if no answer is provided
    }

    const correctAnswer =
      triviaData[currentQuestionIndex].correct_answer.toLowerCase();

    if (correctAnswer.includes(selectedAnswer)) {
      console.log(selectedAnswer);
      userInput.placeholder = `Correct! The answer was: ${decodeURIComponent(
        correctAnswer
      )}`;
      correctAnswersCount++;
      progressBar.style.backgroundColor = "rgba(168, 255, 156, 0.7)"; // Change progress bar color to green for correct answer with some transparency
    } else {
      userInput.placeholder = `Wrong! The correct answer is: ${decodeURIComponent(
        correctAnswer
      )}. Your answer was: ${selectedAnswer}`;
      incorrectAnswersCount++;
      progressBar.style.backgroundColor = "rgba(255, 156, 156, 0.7)"; // Change progress bar color to red for incorrect answer with some transparency
    }

    // Allow the transition to happen by adding a class
    progressBar.classList.add("fade-background-color");

    // Remove the class and set the background color after the transition is complete
    setTimeout(function () {
      progressBar.classList.remove("fade-background-color");
      progressBar.style.backgroundColor = "var(--progress-bar-color)"; // Set it back to the original color
    }, 1000);

    currentQuestionIndex++;
    selectedAnswer = ""; // Reset the selected answer
    const selectedButton = document.querySelector(".option-button.selected");
    if (selectedButton) {
      selectedButton.classList.remove("selected");
    }

    // Disable the checkAnswerButton until the user provides a new answer
    checkAnswerButton.disabled = true;

    // Display the results immediately
    displayResults();

    // Introduce a delay before showing the next question or end screen
    if (currentQuestionIndex < triviaData.length) {
      displayQuestionWithDelay(currentQuestionIndex, 500); // Adjust the delay time as needed
    } else {
      stopTimer();
      displayEndScreenWithDelay(700); // Adjust the delay time as needed
    }
  });

  function displayResults() {
    // Display results logic here
    // You can use the same logic as in the original checkAnswerButton event listener
    // to immediately update the UI with correct and incorrect answers
  }

  function displayQuestionWithDelay(questionIndex, delay) {
    setTimeout(function () {
      displayQuestion(questionIndex);
    }, delay);
  }

  function displayEndScreenWithDelay(delay) {
    setTimeout(function () {
      displayEndScreen();
    }, delay);
  }

  function displayQuestionWithDelay(questionIndex, delay) {
    setTimeout(function () {
      displayQuestion(questionIndex);
    }, delay);
  }

  function displayEndScreenWithDelay(delay) {
    setTimeout(function () {
      displayEndScreen();
    }, delay);
  }

  function displayEndScreen() {
    quizContainer.style.display = "none";
    const endScreen = document.querySelector(".end-screen");
    const timeTakenElement = document.getElementById("timetaken");
    const questionsAnsweredElement =
      document.getElementById("questionsAnswered");
    const correctAnswersElement = document.getElementById("correctAnswers");
    const incorrectAnswersElement = document.getElementById("incorrectAnswers");

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    timeTakenElement.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    questionsAnsweredElement.textContent = `${triviaData.length}/${triviaData.length}`;
    correctAnswersElement.innerHTML = `<i class="fa-solid fa-check"></i>${correctAnswersCount}`;
    incorrectAnswersElement.innerHTML = `<i class="fa-solid fa-xmark"></i>${incorrectAnswersCount}`;

    endScreen.style.display = "flex";

    const replayButton = document.getElementById("replayButton");
    replayButton.addEventListener("click", function () {
      endScreen.style.display = "none";
      startScreen.style.display = "none";
      quizContainer.style.display = "flex";
      currentQuestionIndex = 0;
      timeInSeconds = 0;
      timerElement.textContent = "00:00";
      userInput.value = "";
      userInput.placeholder = "Type in your answer";
      userInput.classList.remove("fade-out");
      correctAnswersCount = 0;
      incorrectAnswersCount = 0;
      startTimer();
      displayQuestion(currentQuestionIndex);
    });

    const changeQuizButton = document.getElementById("changeQuiz");
    changeQuizButton.addEventListener("click", function () {
      endScreen.style.display = "none";
      startScreen.style.display = "flex";
      quizContainer.style.display = "none";
      currentQuestionIndex = 0;
      timeInSeconds = 0;
      timerElement.textContent = "00:00";
      userInput.value = "";
      userInput.placeholder = "Type in your answer";
      userInput.classList.remove("fade-out");
      correctAnswersCount = 0;
      incorrectAnswersCount = 0;
      stopTimer();
    });
  }

  goBackButton.addEventListener("click", function () {
    stopTimer();
    startScreen.style.display = "flex";
    quizContainer.style.display = "none";
    currentQuestionIndex = 0;
    triviaData = [];
    timeInSeconds = 0;
    timerElement.textContent = "00:00";
  });

  restartQuizButton.addEventListener("click", function () {
    stopTimer();
    userInput.placeholder = "Type in your answer";
    userInput.value = "";
    userInput.classList.remove("fade-out");

    currentQuestionIndex = 0;
    timeInSeconds = 0;
    timerElement.textContent = "00:00";
    displayQuestion(currentQuestionIndex);

    startTimer();

    alert("Quiz restarted!");
  });

  function fetchTrivia(category, difficulty, type) {
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}&encode=url3986`;

    return fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.response_code !== 0) {
          console.error("Error in API response:", data);
          console.log(apiUrl);
          throw new Error("Error in API response");
        }

        console.log("API Data:", data);

        return data.results.map((question) => {
          question.question = decodeURIComponent(question.question);
          question.correct_answer = decodeURIComponent(question.correct_answer);
          question.incorrect_answers = question.incorrect_answers.map(
            (answer) => decodeURIComponent(answer)
          );
          return question;
        });
      })
      .catch((error) => {
        console.error("Error fetching trivia:", error);
        throw error;
      });
  }

  function displayQuestion(questionIndex) {
    const questionElement = document.getElementById("question");
    const questionCounterElement = document.getElementById("questionCounter");
    const progressBar = document.querySelector(".progress-bar");
    const optionsContainer = document.querySelector(".option-buttons");

    optionsContainer.innerHTML = ""; // Clear previous options

    if (triviaData.length > 0 && questionIndex < triviaData.length) {
      const currentQuestion = triviaData[questionIndex];
      questionElement.innerHTML = currentQuestion.question;
      questionCounterElement.textContent = `${questionIndex + 1}/${
        triviaData.length
      }`;
      userInput.value = "";

      setTimeout(function () {
        userInput.placeholder = "Type in your answer";
      }, 4000);

      const progressBarWidth = ((questionIndex + 1) / triviaData.length) * 100;
      progressBar.style.width = progressBarWidth + "%";

      // Display options based on the selected type
      if (selectedType === "multiple") {
        displayMultipleChoiceOptions(currentQuestion);
      } else if (selectedType === "boolean") {
        displayTrueFalseOptions(currentQuestion);
      } else if (selectedType === "type") {
        displayInputField();
      }
    }
  }

  function displayMultipleChoiceOptions(question) {
    const optionsContainer = document.querySelector(".option-buttons");

    // Display multiple-choice options
    question.incorrect_answers.forEach((incorrectAnswer, index) => {
      const optionButton = document.createElement("button");
      optionButton.className = "option-button";
      optionButton.textContent = incorrectAnswer;
      optionButton.addEventListener("click", function () {
        handleOptionClick(incorrectAnswer);
      });
      optionsContainer.appendChild(optionButton);
    });

    const correctAnswerButton = document.createElement("button");
    correctAnswerButton.className = "option-button";
    correctAnswerButton.textContent = question.correct_answer;
    correctAnswerButton.addEventListener("click", function () {
      handleOptionClick(question.correct_answer);
    });
    optionsContainer.appendChild(correctAnswerButton);
  }

  function displayTrueFalseOptions(question) {
    const optionsContainer = document.querySelector(".option-buttons");

    // Display True and False options
    const trueButton = document.createElement("button");
    trueButton.className = "option-button";
    trueButton.textContent = "True";
    trueButton.addEventListener("click", function () {
      handleOptionClick("True");
    });
    optionsContainer.appendChild(trueButton);

    const falseButton = document.createElement("button");
    falseButton.className = "option-button";
    falseButton.textContent = "False";
    falseButton.addEventListener("click", function () {
      handleOptionClick("False");
    });
    optionsContainer.appendChild(falseButton);
  }

  function displayInputField() {
    const optionsContainer = document.querySelector(".option-buttons");

    // Display input field for the user to type the answer
    const inputField = document.createElement("input");
    inputField.setAttribute("type", "text");
    inputField.setAttribute("id", "userInput");
    inputField.setAttribute("placeholder", "Type in your answer");
    optionsContainer.appendChild(inputField);

    const submitButton = document.createElement("button");
    submitButton.className = "option-button";
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
      const userAnswer = inputField.value.trim().toLowerCase();
      handleOptionClick(userAnswer);
    });
    optionsContainer.appendChild(submitButton);
  }

  function handleOptionClick(userAnswer) {
    // Convert userAnswer to lowercase
    selectedAnswer = userAnswer.toLowerCase();
    console.log("Selected Answer:", selectedAnswer);

    // Remove the active class from all buttons
    const allOptionButtons = document.querySelectorAll(
      ".option-buttons button"
    );
    allOptionButtons.forEach((button) => {
      button.classList.remove("active");
    });

    // Optionally, you can provide some visual indication that the option is selected
    // For example, you can add a class to the input field or submit button for styling
    const inputField = document.getElementById("userInput");
    const submitButton = document.querySelector(".option-button");

    if (inputField) {
      inputField.classList.add("selected");
      // Set the input field value to the selected answer
      inputField.value = selectedAnswer;
    }

    if (submitButton) {
      submitButton.classList.add("selected");
      // Enable the checkAnswerButton so the user can proceed
      checkAnswerButton.disabled = false;
    }

    // Add the active class to the clicked button
    const clickedButton = event.target;
    if (clickedButton && clickedButton.tagName === "BUTTON") {
      clickedButton.classList.add("active");
    }
  }
});
