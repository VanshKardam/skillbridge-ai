# SkillBridge AI 🚀

SkillBridge AI is an intelligent platform designed to help developers build organized, well-coded resumes and prepare for interviews. By leveraging the power of Google's Gemini AI, SkillBridge analyzes your skills against job descriptions to provide personalized feedback, highlight skill gaps, and generate beautiful, production-ready PDF resumes.

## ✨ Features
- **AI-Powered Resume Generation:** Automatically generates a beautifully formatted, professional PDF resume tailored to a specific job description.
- **Skill Gap Analysis:** Highlights exact skills you are missing for a target job and gives you a match percentage.
- **Mock Interview Preparation:** Generates personalized technical and behavioral interview questions based on your resume and the target role.
- **Secure Authentication:** JWT-based user authentication and secure password hashing.
- **Responsive Design:** Fully responsive, modern user interface built with React and SCSS.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React.js (built with Vite)
- **Routing:** React Router
- **Styling:** Vanilla SCSS (Mobile-Responsive, Dark/Light modes)

### Backend
- **Framework:** Node.js & Express.js
- **Database:** MongoDB (Mongoose)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **PDF Generation:** Puppeteer
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 💻 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/VanshKardam/skillbridge-ai.git
cd skillbridge-ai
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5174
PORT=3000
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` folder with the following variable:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🚀 Deployment Guide
This project is fully configured for cloud deployment.
1. **Frontend:** Deployed on [Vercel](https://vercel.com). Make sure to set the `VITE_API_BASE_URL` environment variable to your live Backend URL. *(Includes `vercel.json` for proper React SPA routing)*.
2. **Backend:** Deployed on [Render](https://render.com). Make sure to set the `FRONTEND_URL` environment variable to your live Vercel URL to allow CORS. Puppeteer is configured with `--no-sandbox` to run properly in Render's Linux environment.

---
*Built with ❤️ by Vansh Kardam*
