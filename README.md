# Dubicx Switcx Hub — Financial OS

This project has been decoupled into a modern **React (Vite) Frontend** and a **Python (Flask) Backend**. Both servers must be running simultaneously to use the application during development.

## 🛠️ Startup Instructions

Because of the decoupled API architecture, you must start the backend database/API node and the frontend UI node in **two separate terminal windows**.

### 1. Start the Flask Backend (Terminal 1)
This node handles the SQLite database (`/data/hub.db`) and all JSON REST API routes.
1. Open a terminal in the root project folder.
2. Run the main python app:
   ```bash
   python app.py
   ```
*(The API will start listening on `http://127.0.0.1:5000`)*

### 2. Start the React Frontend (Terminal 2)
This node compiles the modern UI and seamlessly proxies any API requests back to port 5000.
1. Open a **new** terminal window.
2. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(The UI will start loading on `http://localhost:5173`)*

---

### 🌐 Accessing the App
Once both terminals are running without errors, open your web browser and navigate strictly to:
**👉 http://localhost:5173**

*(Note: Do not visit port `5000` directly in your browser, as that is reserved entirely for background API data fetching).*
