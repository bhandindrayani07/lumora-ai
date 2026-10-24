
const notes = document.querySelector("#notes");
const counter = document.querySelector("#counter");
const generateBtn = document.querySelector("#generateBtn");
const message = document.querySelector("#message");
const themeToggle = document.querySelector("#themeToggle");

const summaryOutput = document.querySelector("#summaryOutput");
const quizContainer = document.querySelector("#quizContainer");
const flashcardsContainer = document.querySelector("#flashcardsContainer");
const quizScore = document.querySelector("#quizScore");

let quizQuestions = [];
let currentScore = 0;
let answeredQuestions = new Set();

// Character counter
notes.addEventListener("input", function () {
  counter.textContent = notes.value.length + " characters";
});

// Theme settings
function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  themeToggle.textContent = isDark ? "☀ Light" : "☾ Dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("lumora-theme");
} catch (error) {
  console.log("Theme preference could not be loaded.");
}

applyTheme(savedTheme === "dark");

themeToggle.addEventListener("click", function () {
  const isDark = !document.body.classList.contains("dark-mode");

  applyTheme(isDark);

  try {
    localStorage.setItem("lumora-theme", isDark ? "dark" : "light");
  } catch (error) {
    console.log("Theme preference could not be saved.");
  }
});

// Create a text element safely
function addText(parent, tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  parent.appendChild(element);
  return element;
}

// Display the summary
function showSummary(summary) {
  summaryOutput.replaceChildren();

  addText(summaryOutput, "p", summary);

  const copyButton = document.querySelector("#copySummaryBtn");
  const downloadButton = document.querySelector("#downloadSummaryBtn");

  copyButton.onclick = async function () {
    try {
      await navigator.clipboard.writeText(summary);
      message.textContent = "Summary copied successfully!";
    } catch (error) {
      message.textContent =
        "Copy failed. Please select and copy the summary manually.";
    }
  };

  downloadButton.onclick = function () {
    const file = new Blob([summary], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lumora-summary.txt";
    link.click();

    URL.revokeObjectURL(url);
    message.textContent = "Summary download started.";
  };
}

// Display an interactive quiz
function showQuiz(questions) {
  quizContainer.replaceChildren();
  quizScore.textContent = "";

  quizQuestions = questions;
  currentScore = 0;
  answeredQuestions = new Set();

  questions.forEach(function (question, questionIndex) {
    const questionBox = document.createElement("div");
    questionBox.className = "quiz-question";

    addText(
      questionBox,
      "h4",
      (questionIndex + 1) + ". " + question.question
    );

    const optionsBox = document.createElement("div");
    optionsBox.className = "quiz-options";

    question.options.forEach(function (option, optionIndex) {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "quiz-option";
      optionButton.textContent = option;

      optionButton.addEventListener("click", function () {
        if (answeredQuestions.has(questionIndex)) return;

        answeredQuestions.add(questionIndex);

        const allOptions = optionsBox.querySelectorAll("button");

        allOptions.forEach(function (button) {
          button.disabled = true;
        });

        if (optionIndex === question.answer) {
          currentScore++;
          optionButton.classList.add("correct-answer");
        } else {
          optionButton.classList.add("wrong-answer");
          allOptions[question.answer].classList.add("correct-answer");
        }

        addText(
          questionBox,
          "p",
          question.explanation,
          "quiz-explanation"
        );

        quizScore.textContent =
          "Score: " + currentScore + " / " + questions.length;

        if (answeredQuestions.size === questions.length) {
          addText(
            quizContainer,
            "p",
            "Quiz complete! Final score: " +
              currentScore + " / " + questions.length
          );
        }
      });

      optionsBox.appendChild(optionButton);
    });

    questionBox.appendChild(optionsBox);
    quizContainer.appendChild(questionBox);
  });
}

// Display clickable flashcards
function showFlashcards(cards) {
  flashcardsContainer.replaceChildren();

  cards.forEach(function (card, index) {
    const flashcard = document.createElement("button");
    flashcard.type = "button";
    flashcard.className = "flashcard";
    flashcard.setAttribute("aria-pressed", "false");

    let showingAnswer = false;

    flashcard.textContent =
      "Card " + (index + 1) + ": " + card.front + " — Tap to reveal";

    flashcard.addEventListener("click", function () {
      showingAnswer = !showingAnswer;

      flashcard.textContent = showingAnswer
        ? card.back + " — Tap to see question"
        : "Card " + (index + 1) + ": " +
          card.front + " — Tap to reveal";

      flashcard.setAttribute("aria-pressed", String(showingAnswer));
    });

    flashcardsContainer.appendChild(flashcard);
  });
}

// Generate the study set using the backend
generateBtn.addEventListener("click", async function () {
  const studyNotes = notes.value.trim();

  if (!studyNotes) {
    message.textContent = "Please enter your notes or a topic first.";
    notes.focus();
    return;
  }

  if (studyNotes.length > 20000) {
    message.textContent = "Please keep your notes under 20,000 characters.";
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "✦ Generating...";
  message.textContent = "Lumora is preparing your study set...";

  summaryOutput.textContent = "Generating your summary...";
  quizContainer.textContent = "Generating your quiz...";
  flashcardsContainer.textContent = "Generating your flashcards...";
  quizScore.textContent = "";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ notes: studyNotes })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not generate your study set.");
    }

    if (
      typeof data.summary !== "string" ||
      !Array.isArray(data.quiz) ||
      data.quiz.length !== 5 ||
      !Array.isArray(data.flashcards) ||
      data.flashcards.length !== 5
    ) {
      throw new Error("The AI returned an invalid study set. Please try again.");
    }

    showSummary(data.summary);
    showQuiz(data.quiz);
    showFlashcards(data.flashcards);

    message.textContent = "Your Lumora study set is ready!";
  } catch (error) {
    console.error("Generation error:", error);

    summaryOutput.textContent = "Your summary could not be generated.";
    quizContainer.textContent = "Your quiz could not be generated.";
    flashcardsContainer.textContent = "Your flashcards could not be generated.";

    message.textContent =
      error.message === "Failed to fetch"
        ? "Could not reach the server. Make sure Lumora is running."
        : error.message;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "✦ Generate study set";
  }
});
