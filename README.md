# 🧠 QuizBuddy

**QuizBuddy** is a modern, minimalist AI-powered quiz platform built on the **PERN Stack** (PostgreSQL, Express, React, Node.js). 

It empowers users to instantly generate highly accurate 15-question quizzes from any text prompt or uploaded PDF document using Google's **Gemini AI**. Test your knowledge, share custom quiz links with friends, or challenge them to real-time 1v1 battles in a beautiful, distraction-free black-and-white editorial interface.

---

## ✨ Features

- **🤖 AI Quiz Generation:** Instantly convert any PDF notes, lectures, or text prompts into a structured 15-question multiple-choice quiz using the Gemini Flash AI model.
- **⚔️ Live 1v1 Battles:** Challenge friends to real-time, synchronized multiplayer quiz duels powered by Socket.IO. Watch your opponent's live progress!
- **🔗 Sharable Quizzes:** Generate secure public links to share your custom AI quizzes with anyone.
- **🎨 Premium B&W Aesthetic:** A distraction-free, minimalist monochrome design built from scratch with custom CSS, `Inter`, and `Space Mono` typography.
- **🔐 Secure Authentication:** Full JWT-based authentication flow with HTTP-only cookies and bcrypt password hashing.
- **📊 Progress Tracking:** Save your generated quizzes directly to your database and review past scores.

---

## 🛠️ Technology Stack

**Frontend**
- **React.js** (Vite)
- **Zustand** (Global State Management)
- **Tailwind CSS** (Utility classes) + Custom Vanilla CSS (Design System)
- **React Router Dom** (Navigation)
- **Socket.IO-client** (Real-time WebSockets)

**Backend**
- **Node.js & Express.js** (REST API)
- **PostgreSQL** (Relational Database)
- **Sequelize** (ORM)
- **Socket.IO** (Real-time Multiplayer Engine)
- **Google Gemini API** (`@google/genai` for AI generation)
- **Multer & pdf-parse** (PDF upload and text extraction)
- **JSON Web Tokens (JWT)** (Auth & Session Management)

---

## 🚀 Getting Started

Follow these instructions to set up QuizBuddy on your local machine.

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- A free API Key from [Google Gemini (Google AI Studio)](https://aistudio.google.com/app/apikey)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/QuizBuddy.git
cd QuizBuddy
```

### 3. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
BACKEND_PORT=8080
DATABASE_URL=postgres://your_pg_user:your_pg_password@localhost:5432/quizbuddy
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```
*(The backend runs on `http://localhost:8080`)*

### 4. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

---

## 🎮 How to Play a 1v1 Battle
1. Ensure both you and your friend have accounts and are logged in.
2. Navigate to the **Battle** page.
3. Player 1: Click **Create Room** to generate a secure Room Code.
4. Player 2: Enter the Room Code and click **Join Room**.
5. Once both players are in the lobby, the host can start the match! 

---

## 🚀 Deployment

QuizBuddy is fully optimized to be deployed as a single Web Service (e.g., on Render.com) where the Express backend serves the static Vite frontend bundle.

**Deployment Script:**
```json
// Add to a root package.json if deploying as a monorepo
"scripts": {
  "build": "npm run build --prefix Frontend",
  "start": "node Backend/server.js"
}
```
*Note: Make sure to set `NODE_ENV=production` in your hosting environment variables so the backend properly serves the `Frontend/dist` folder.*

---

<p align="center">
  <br>
  <i>Built with simplicity and speed in mind. Happy studying!</i>
</p>
