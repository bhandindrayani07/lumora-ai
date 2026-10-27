
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));

// Serve the frontend files from lumora-ai/public
app.use(
  express.static(path.join(__dirname, "..", "public"))
);

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post("/api/generate", async function (req, res) {
  try {
    const notes = req.body.notes;

    if (typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({
        error: "Please enter your study notes first."
      });
    }

    if (notes.length > 20000) {
      return res.status(400).json({
        error: "Please keep your notes under 20,000 characters."
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the server."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `
Create a study set from these notes:

${notes}

Return ONLY valid JSON in this format:
{
  "summary": "A clear summary of the notes",
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Requirements:
- Include exactly 5 quiz questions.
- Each quiz question must have 4 options.
- The answer must be an index from 0 to 3.
- Include exactly 5 flashcards.
- Base everything on the notes.
- Use simple, clear language.
`
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const data = JSON.parse(cleaned);

    if (
      typeof data.summary !== "string" ||
      !Array.isArray(data.quiz) ||
      data.quiz.length !== 5 ||
      !Array.isArray(data.flashcards) ||
      data.flashcards.length !== 5
    ) {
      throw new Error("The AI returned an unexpected study-set format.");
    }

    for (const question of data.quiz) {
      if (
        typeof question.question !== "string" ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !Number.isInteger(question.answer) ||
        question.answer < 0 ||
        question.answer > 3 ||
        typeof question.explanation !== "string"
      ) {
        throw new Error("The AI returned an invalid quiz question.");
      }
    }

    for (const card of data.flashcards) {
      if (
        typeof card.front !== "string" ||
        typeof card.back !== "string"
      ) {
        throw new Error("The AI returned an invalid flashcard.");
      }
    }

    return res.json(data);
  } catch (error) {
    console.error("Study set generation failed:", error.message);

    return res.status(500).json({
      error: "Could not generate your study set. Please try again."
    });
  }
});

// Start the server locally; export the app for deployment.
if (require.main === module) {
  app.listen(PORT, function () {
    console.log(`Lumora is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
