# SkillBridge AI 🚀

SkillBridge AI is an intelligent platform designed to help developers build organized, well-coded resumes and prepare for interviews. By leveraging the power of Google's Gemini AI, SkillBridge analyzes your skills against job descriptions to provide personalized feedback, highlight skill gaps, and generate beautiful, production-ready PDF resumes.

## ✨ Features
- **AI-Powered Resume Generation:** Automatically generates a beautifully formatted, professional PDF resume tailored to a specific job description.
- **Skill Gap Analysis:** Highlights exact skills you are missing for a target job and provides a match percentage.
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

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### 1. Clone the repository
```bash
git clone https://github.com/VanshKardam/skillbridge-ai.git
cd skillbridge-ai
```

### 2. Environment Variables
You will need to set up environment variables for both the frontend and backend.

**Backend (`Backend/.env`)**:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5174
PORT=3000
```

**Frontend (`Frontend/.env`)**:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Running the Application (Windows)
For Windows users, a convenient startup script is included. Simply double-click the `start.bat` file in the root directory. This script will automatically install all dependencies (including Puppeteer) and start both development servers.

Alternatively, you can run them manually:
```bash
# Terminal 1: Backend
cd Backend
npm install
npm run dev

# Terminal 2: Frontend
cd Frontend
npm install
npm run dev
```

---

## 🚀 Deployment

The application is structured for easy cloud deployment:

- **Frontend (Vercel):** The React SPA is optimized for Vercel deployment. A `vercel.json` file is included to handle client-side routing rules. 
- **Backend (Render):** The Node.js Express server is configured for deployment on platforms like Render. Puppeteer is configured with `--no-sandbox` to ensure compatibility with cloud Linux environments.

*Note for Free Tier Hosting: If deployed on Render's free tier, the backend server may spin down after 15 minutes of inactivity. Initial requests after a period of inactivity may take up to 50 seconds while the server wakes up.*

---
*Built with ❤️ by Vansh Kardam*
