# ✦ Lumora — AI Study Companion

**Learn smarter. Remember longer.**

Lumora is an AI-powered study assistant that transforms study notes into summaries, interactive quizzes, and revision flashcards. It helps students understand key concepts, test their knowledge, and revise more effectively.

## ✨ Features

- **AI-Generated Summaries** — Simplify study notes into clear, easy-to-understand summaries.
- **Interactive Quizzes** — Generate five multiple-choice questions with four options each, correct answers, and explanations.
- **Revision Flashcards** — Create five flashcards to review important concepts.
- **Quiz Scoring** — Test your understanding and view your final score.
- **Summary Actions** — Copy or download your generated summary.
- **Modern Interface** — A clean, student-friendly design with a dark-mode option.
- **Input Validation** — Validate study notes before requesting AI generation.

## 🛠️ Technologies

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend and AI**
- Node.js
- Express.js
- Google Gemini API
- `@google/genai`
- `dotenv`

## 📂 Project Structure

```text
lumora-ai/
├── index.html
├── style.css
├── script.js
├── README.md
└── server/
    ├── index.js
    ├── package.json
    ├── package-lock.json
    └── .gitignore
```

The local `server/.env` file stores the API key and should not be committed to GitHub.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/bhandindrayani07/lumora-ai.git
cd lumora-ai
```

### 2. Install dependencies

```bash
cd server
npm install
```

### 3. Configure the API key

Create a `.env` file inside the `server` folder:

```env
GEMINI_API_KEY=your_api_key_here
```

Replace the placeholder with your own API key. Never share or upload the actual key.

### 4. Start Lumora

From the `server` folder, run:

```bash
npm start
```

Open **http://localhost:3000** in your browser. Keep the server terminal running while using the application.

## 📖 How to Use

1. Open Lumora in your browser.
2. Enter your study notes.
3. Select **Generate Study Set**.
4. Read the generated summary.
5. Answer the quiz questions and check your score.
6. Review the flashcards to reinforce your learning.

## 🔐 Security

- Store API keys in the local `.env` file.
- Exclude `.env` and `node_modules/` from Git using `.gitignore`.
- Keep API keys out of frontend code and public repositories.

## 🎯 Project Goal

Lumora aims to make studying more engaging and efficient by turning ordinary notes into interactive learning materials using AI.

## 👩‍💻 Author

**Indrayani Bhand**

Student Project · AI-Powered Learning

---

*Made for curious minds. ✦ Lumora*
