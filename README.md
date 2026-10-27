# ✦ Lumora — AI Study Companion

**Learn smarter. Remember longer.**

Lumora is an AI-powered study assistant that transforms study notes into summaries, interactive quizzes, and revision flashcards. It helps students understand key concepts, test their knowledge, and revise more effectively.

## ✨ Features

- **AI-Generated Summaries** — Turn study notes into clear, easy-to-understand summaries.
- **Interactive Quizzes** — Generate five multiple-choice questions with four options each, correct answers, and explanations.
- **Revision Flashcards** — Create five flashcards to review important concepts.
- **Quiz Scoring** — Test your understanding and view your score.
- **Read Summary Aloud** — Listen to generated summaries using text-to-speech controls.
- **Summary Actions** — Copy or download your generated summary.
- **Light and Dark Modes** — Switch themes with your preference saved.
- **Input Validation** — Validate study notes before requesting AI generation.
- **Responsive Design** — Use Lumora on desktop and mobile screens.

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

The local `server/.env` file stores the API key and must not be committed to GitHub.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/bhandindrayani07/lumora-ai.git
cd lumora-ai
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure the API Key

Create a `.env` file inside the `server` folder and add:

```env
GEMINI_API_KEY=your_api_key_here
```

Replace the placeholder with your own API key. Never share your actual key or upload it to GitHub.

### 4. Start Lumora

From inside the `server` folder, run:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Keep the terminal running while you use the application.

## 📖 How to Use

1. Open Lumora in your browser.
2. Enter your study notes.
3. Select **Generate Study Set**.
4. Read or listen to the generated summary.
5. Answer the quiz questions and check your score.
6. Review the flashcards to reinforce your learning.

## 🔐 Security

- Store the Gemini API key in the local `server/.env` file.
- Keep `.env` and `node_modules/` excluded through `.gitignore`.
- Never put API keys in frontend JavaScript or public repositories.
- Configure environment variables securely when deploying the application.

## 🎯 Project Goal

Lumora aims to make studying more engaging and efficient by turning ordinary notes into interactive learning materials using AI.

## 👩‍💻 Author

**Indrayani Bhand**

Student Project · AI-Powered Learning

--

*Made for curious minds. ✦ Lumora*
