---

# 🎨 Swagger Manager – Frontend

Modern **React** application built with **Vite** and **Material-UI (MUI)**.

This frontend allows users to create, manage, and share Swagger/OpenAPI documentation projects within an organization.

---

## 🚀 Tech Stack

* React 18
* Vite
* Material-UI (MUI)
* React Router
* Axios
* Formik (Forms)
* JWT Authentication (via backend API)

---

## 📦 Installation

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Configure Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update with your backend URL:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

⚠️ **Important:** Do not commit `.env` to GitHub.

---

### 3️⃣ Start Development Server

```bash
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
frontend/
│
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages (Login, Dashboard, etc.)
│   ├── context/         # Authentication context
│   ├── services/        # API calls (Axios)
│   ├── App.jsx
│   └── main.jsx
│
├── public/              
├── vite.config.js
└── package.json
```

---

## ✨ Features

* Secure authentication (Login / Register)
* Project dashboard
* Endpoint builder form
* Live Swagger documentation viewer
* Responsive Material-UI interface
* Fast hot-reload with Vite

---

## 📜 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---
## 👨‍💻 Author

**Dhanuka Navodya**  
Software Engineer  

📧 Email: dhanukanavodya97@gmail.com  
🔗 GitHub: https://github.com/DhanukaNavodya  
🔗 LinkedIn: https://www.linkedin.com/in/dhanuka-navodya-a69351314/

---
