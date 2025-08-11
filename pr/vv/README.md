# Task & Productivity Dashboard

A modern, responsive task management application built with React, Vite, and Tailwind CSS.

## ✨ Features

- **CRUD Operations**: Add, edit, delete, and mark tasks complete
- **Search & Filter**: Search tasks and filter by All / Completed / Pending
- **Statistics**: Total, Completed, and Pending task counts
- **Dark/Light Mode**: Toggle with smooth transitions
- **Persistent Storage**: Uses LocalStorage so data survives refresh
- **Reusable Components**: Button, Input, Card, Modal
- **Validation**: Form validation and error handling
- **Modern React**: Hooks (`useState`, `useEffect`, `useRef`)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### Install & Run
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## 📁 Project Structure
```
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── FilterButtons.jsx
│   ├── Header.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── SearchBar.jsx
│   ├── StatsSection.jsx
│   ├── TaskForm.jsx
│   └── TaskList.jsx
├── hooks/
│   ├── useLocalStorage.js
│   └── useTheme.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🧪 Notes
- All data is stored in LocalStorage.
- The UI is responsive and accessible.

## 📄 License
MIT


