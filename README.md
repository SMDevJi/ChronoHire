# 🚀 AI Interview Platform (MERN Stack)

An AI-powered mock interview platform built with the **MERN stack**.  
The platform helps job seekers practice interviews, get real-time evaluations, and receive feedback powered by **speech-to-text** and **AI-based answer evaluation**.  

It also supports **resume-based question generation** and **candidate performance tracking**.  

---

## ✨ Features


- 🎤 **Speech-to-Text**: Converts spoken answers into text for AI processing.  
- 🧠 **AI-Powered Evaluation**: Evaluates answers based on relevance, clarity, and confidence.  
- 📄 **Resume Parsing**: Generates personalized interview questions.  
- 📊 **Analytics Dashboard**: Provides performance insights.  
- 🔒 **Authentication & Authorization** using JWT.  
- 🌐 **Responsive UI** with React + TailwindCSS, ShadCN.  

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- TailwindCSS  
- Axios 
- ShadCN 

**Backend**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

**AI & Speech Processing**  
- Gemini API (for question generation & evaluation)  
- Google Speech-to-Text

**Other Tools**  
- JWT Authentication  
- Multer (for resume uploads)  

---


## ⚡ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/smdevji/ChronoHire.git
cd ChronoHire
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file inside `/backend` with:
```env

```
Run backend:
```bash
node index.js
```

### 3️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:3000`  




## 🤝 Contributing

1. Fork the project  
2. Create a feature branch (`git checkout -b feature/awesome-feature`)  
3. Commit changes (`git commit -m 'Add awesome feature'`)  
4. Push to branch (`git push origin feature/awesome-feature`)  
5. Create Pull Request  

---

## 📜 License
This project is licensed under the **MIT License**.  
