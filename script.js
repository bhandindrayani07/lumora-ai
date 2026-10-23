
const notes = document.querySelector("#notes");
const counter = document.querySelector("#counter");
const generateBtn = document.querySelector("#generateBtn");
const message = document.querySelector("#message");

notes.addEventListener("input", function () {
  counter.textContent = notes.value.length + " characters";
});

generateBtn.addEventListener("click", function () {
  if (notes.value.trim() === "") {
    message.textContent = "Please enter your notes or a topic first.";
  } else {
    message.textContent =
      "Your notes are ready! AI generation will be added in a later step.";
  }
});
