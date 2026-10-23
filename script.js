
const notes = document.querySelector("#notes");
const counter = document.querySelector("#counter");
const generateBtn = document.querySelector("#generateBtn");
const message = document.querySelector("#message");
const themeToggle = document.querySelector("#themeToggle");

// Update the notes character count
notes.addEventListener("input", function () {
  counter.textContent = notes.value.length + " characters";
});

// Apply the selected theme
function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  if (isDark) {
    themeToggle.textContent = "☀ Light";
    themeToggle.setAttribute("aria-label", "Switch to light mode");
  } else {
    themeToggle.textContent = "☾ Dark";
    themeToggle.setAttribute("aria-label", "Switch to dark mode");
  }
}

// Restore the saved theme when the page opens
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("lumora-theme");
} catch (error) {
  console.log("Theme preference could not be loaded.");
}

applyTheme(savedTheme === "dark");

// Switch themes when the button is clicked
themeToggle.addEventListener("click", function () {
  const isDark = !document.body.classList.contains("dark-mode");

  applyTheme(isDark);

  try {
    localStorage.setItem("lumora-theme", isDark ? "dark" : "light");
  } catch (error) {
    console.log("Theme preference could not be saved.");
  }
});

// Check that notes have been entered
generateBtn.addEventListener("click", function () {
  if (notes.value.trim() === "") {
    message.textContent = "Please enter your notes or a topic first.";
  } else {
    message.textContent =
      "Your notes are ready! AI generation will be added in a later step.";
  }
});
