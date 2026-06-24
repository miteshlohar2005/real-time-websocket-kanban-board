# 📝 Real-Time WebSocket Kanban Board

## 📌 Project Overview
The **Real-Time WebSocket Kanban Board** is a highly interactive, responsive, and fully synchronized task management application. Built to demonstrate proficiency in modern full-stack web development, it seamlessly synchronizes task states across multiple clients using WebSockets. The application allows users to create, modify, drag-and-drop, and categorize tasks in a visually engaging and accessible interface.

## ✨ Features
- **Real-time multi-user synchronization** powered by `Socket.IO`.
- **Full CRUD functionality:** Create, Edit, Delete, and Move tasks intuitively.
- **Drag and Drop capability** seamlessly implemented using `@dnd-kit/core`.
- **Kanban Columns:** Tasks are organized into `To Do`, `In Progress`, and `Done`.
- **Progress Dashboard:** Live statistical tracking with responsive `Recharts`.
- **Responsive Modern UI:** Premium glassmorphism aesthetics, dynamic dark mode, and fluid animations.
- **File Attachment Support:** Client-side image previews using `URL.createObjectURL`.
- **Comprehensive Testing:** Unit and Integration tests via `Vitest`, and End-to-End verification using `Playwright`.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite |
| **Backend Environment** | Node.js + Express.js |
| **Real-Time Communication**| Socket.IO |
| **Drag & Drop Logic** | @dnd-kit/core |
| **Data Visualization** | Recharts |
| **UI Components** | React Select, Lucide React (Icons), Vanilla CSS (Glassmorphism) |
| **Unit & Integration Testing**| Vitest + React Testing Library |
| **End-to-End Testing** | Playwright |

## 🏗️ Project Architecture
The project follows a decoupled client-server architecture:
- **Frontend Layer:** A Vite-optimized React application that maintains local state, intercepts Drag-and-Drop events, and optimistically updates the UI for zero-latency user experience.
- **WebSocket Layer:** An Express server with `Socket.IO` acting as the central nervous system, distributing state mutations (create, update, delete, move) instantly to all connected clients.
- **Testing Layer:** `Vitest` runs lightweight, isolated DOM tests with `jsdom`, while `Playwright` handles full-browser end-to-end automation workflows.

## 🚀 Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.x or later)
- npm or yarn

### 🔧 Backend Setup
Open a terminal and navigate to the root directory, then run the following commands:
```bash
cd backend
npm install
npm run dev
```
*The backend server will launch on `http://localhost:5000`.*

### 🖥️ Frontend Setup
Open a new terminal window, navigate to the root directory, and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend development server will launch on `http://localhost:3000`.*

## 🏁 Running the Application
To experience the real-time functionality:
1. Ensure both the **Backend** and **Frontend** servers are running.
2. Open `http://localhost:3000` in your primary browser.
3. Open a completely separate browser window (or Incognito mode) pointing to the same URL.
4. Drag a task from one column to another in the first window, and watch it move instantaneously in the second window.

## 🔌 WebSocket Events
The system utilizes a structured event-driven communication model:
- `sync:tasks` — Sent upon initial connection to hydrate the client's board.
- `task:create` — Emitted when a new task is formulated.
- `task:update` — Emitted when an existing task's properties (title, priority) are edited.
- `task:move` — Emitted containing the `taskId` and the new destination column `status`.
- `task:delete` — Emitted to purge a task ID from all connected clients.

## 🧪 Testing Instructions

The application maintains rigorous test coverage.

**Unit & Integration Tests (Vitest):**
```bash
cd frontend
npm run test
```
*Tests evaluate component rendering, user interactions, and mocked Socket.IO integrations.*

**End-to-End Tests (Playwright):**
```bash
cd frontend
# Ensure both backend and frontend servers are currently running on ports 5000 and 3000
npm run test:e2e
```
*Playwright launches Chromium/WebKit/Firefox to execute full user journeys.*

## 📂 Project Structure

```text
websocket-kanban-vitest-playwright-2026/
│── backend/
│   ├── package.json
│   └── server.js                 # Express + Socket.IO server setup
│
│── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Modular React components
│   │   │   ├── Column.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── services/
│   │   │   └── socket.js         # Singleton WebSocket client configuration
│   │   ├── tests/
│   │   │   ├── integration/      # Vitest Integration tests
│   │   │   └── unit/             # Vitest Unit tests
│   │   ├── App.jsx
│   │   ├── index.css             # Premium Vanilla CSS styles
│   │   ├── main.jsx
│   │   └── setupTests.js         # Jest-DOM setup
│   ├── tests/
│   │   └── e2e/                  # Playwright Test Definitions
│   │       └── kanban.spec.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 📸 Screenshots Section
*(Add screenshots of your application here before submission. Examples to include:)*
- Main Kanban Board layout
- "Create Task" Modal
- Progress Dashboard Analytics
- Real-time drag-and-drop action

## 🚀 Future Improvements
- **Persistent Database:** Migrate the in-memory array to a `MongoDB` instance via `Mongoose` for persistent storage.
- **User Authentication:** Introduce `JWT` to enable multi-tenant functionality, assigning users their own isolated boards.
- **Cloud Storage Integration:** Integrate `AWS S3` or `Cloudinary` to permanently store attached image files.
- **Rich Text Descriptions:** Upgrade the basic task description `textarea` to a rich Markdown editor.
