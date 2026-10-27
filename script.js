
const notes = document.querySelector("#notes");
const counter = document.querySelector("#counter");
const generateBtn = document.querySelector("#generateBtn");
const message = document.querySelector("#message");
const themeToggle = document.querySelector("#themeToggle");

const summaryOutput = document.querySelector("#summaryOutput");
const quizContainer = document.querySelector("#quizContainer");
const flashcardsContainer = document.querySelector("#flashcardsContainer");
const quizScore = document.querySelector("#quizScore");

const historyContainer = document.querySelector("#historyContainer");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");

let quizQuestions = [];
let currentScore = 0;
let answeredQuestions = new Set();
let studyHistory = [];

// Load saved study history
try {
  const savedHistory = localStorage.getItem("lumora-history");
  studyHistory = savedHistory ? JSON.parse(savedHistory) : [];

  if (!Array.isArray(studyHistory)) {
    studyHistory = [];
  }
} catch (error) {
  console.error("Could not load study history:", error);
  studyHistory = [];
}

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

  if (className) {
    element.className = className;
  }

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
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

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

          if (allOptions[question.answer]) {
            allOptions[question.answer].classList.add("correct-answer");
          }
        }

        addText(
          questionBox,
          "p",
          question.explanation || "Review this concept in your summary.",
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

// Save a generated study set
function saveStudySet(topic, summary, quiz, flashcards) {
  const item = {
    id: Date.now(),
    topic: topic.length > 60
      ? topic.slice(0, 60) + "..."
      : topic,
    date: new Date().toISOString(),
    summary: summary,
    quiz: quiz,
    flashcards: flashcards
  };

  // Keep the five most recent study sets
  studyHistory.unshift(item);
  studyHistory = studyHistory.slice(0, 5);

  try {
    localStorage.setItem(
      "lumora-history",
      JSON.stringify(studyHistory)
    );

    showHistory();
    return true;
  } catch (error) {
    console.error("Could not save study history:", error);
    message.textContent =
      "Your study set was generated, but history could not be saved.";
    return false;
  }
}

// Display Study History
function showHistory() {
  if (!historyContainer) {
    console.error("Study History container not found.");
    return;
  }

  historyContainer.replaceChildren();

  if (studyHistory.length === 0) {
    addText(
      historyContainer,
      "p",
      "Your study history will appear here."
    );
    return;
  }

  studyHistory.forEach(function (item) {
    const entry = document.createElement("div");
    entry.className = "history-item";

    addText(entry, "h4", item.topic);

    addText(
      entry,
      "p",
      "Created: " + new Date(item.date).toLocaleString()
    );

    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.textContent = "View study set";

    viewButton.addEventListener("click", function () {
      showSummary(item.summary);
      showQuiz(item.quiz);
      showFlashcards(item.flashcards);

      message.textContent = "Previous study set loaded.";

      document.querySelector("#summarySection").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    entry.appendChild(viewButton);
    historyContainer.appendChild(entry);
  });
}

// Clear Study History
if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", function () {
    if (studyHistory.length === 0) {
      message.textContent = "Your study history is already empty.";
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to clear all study history?"
    );

    if (!confirmed) return;

    try {
      localStorage.removeItem("lumora-history");
      studyHistory = [];
      showHistory();
      message.textContent = "Study history cleared successfully.";
    } catch (error) {
      console.error("Could not clear study history:", error);
      message.textContent =
        "Could not clear study history. Please try again.";
    }
  });
}

// Show saved history when the page opens
showHistory();

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

    let data;

    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error("The server returned an invalid response. Please try again.");
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Could not generate your study set."
      );
    }

    if (
      !data ||
      typeof data.summary !== "string" ||
      !data.summary.trim() ||
      !Array.isArray(data.quiz) ||
      data.quiz.length !== 5 ||
      !Array.isArray(data.flashcards) ||
      data.flashcards.length !== 5 ||
      !data.quiz.every(function (question) {
        return (
          question &&
          typeof question.question === "string" &&
          Array.isArray(question.options) &&
          question.options.length >= 2 &&
          Number.isInteger(question.answer) &&
          question.answer >= 0 &&
          question.answer < question.options.length
        );
      }) ||
      !data.flashcards.every(function (card) {
        return (
          card &&
          typeof card.front === "string" &&
          card.front.trim() &&
          typeof card.back === "string" &&
          card.back.trim()
        );
      })
    ) {
      throw new Error(
        "The AI returned an invalid study set. Please try again."
      );
    }

    showSummary(data.summary);
    showQuiz(data.quiz);
    showFlashcards(data.flashcards);

    const saved = saveStudySet(
      studyNotes,
      data.summary,
      data.quiz,
      data.flashcards
    );

    if (saved) {
      message.textContent = "Your Lumora study set is ready!";
    }

  } catch (error) {
    console.error("Generation error:", error);

    summaryOutput.textContent =
      "Your summary could not be generated.";

    quizContainer.textContent =
      "Your quiz could not be generated.";

    flashcardsContainer.textContent =
      "Your flashcards could not be generated.";

    message.textContent =
      error.message === "Failed to fetch"
        ? "Could not reach the server. Make sure Lumora is running."
        : error.message || "Something went wrong. Please try again.";

  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "✦ Generate study set";
  }
});
