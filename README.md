# AlgoNote AI

A production-level full-stack web application for DSA revision built for competitive programmers. AlgoNote AI lets you import LeetCode problems, write and save multi-approach solutions, take notes, analyze code complexity with AI, and generate structured study sheets from YouTube DSA playlists — all in one place.

---

## Features

### Core

- **File Explorer** — VS Code-style sidebar to organize problems into folders
- **Problem Workspace** — split-panel editor with problem description on the left and code editor on the right
- **Multi-solution tabs** — write Brute Force, Better, and Optimal solutions separately
- **Notes** — per-problem notes saved to the database
- **Complexity Analyzer** — AI-powered time & space complexity analysis of your code
- **LeetCode Importer** — paste any LeetCode URL and auto-import the problem title, description, difficulty, tags, and starter code

### Playlist Sheet Generator _(new)_

- Paste a YouTube DSA playlist URL
- AI identifies the exact LeetCode problem for each video
- Fetches full problem data from LeetCode's GraphQL API
- Stores a structured DSA sheet in the database
- **Add to Explorer** — creates a folder in the file explorer with one file per problem, pre-loaded with description and starter code
- **Open on LeetCode** — button on every problem file to open the original question in a new tab

---

## Tech Stack

### Frontend

| Tech                   | Purpose                   |
| ---------------------- | ------------------------- |
| React 19               | UI framework              |
| Vite                   | Build tool & dev server   |
| Tailwind CSS v4        | Styling                   |
| Zustand                | Global state management   |
| React Router v7        | Client-side routing       |
| Framer Motion          | Animations                |
| Monaco Editor          | VS Code-style code editor |
| Axios                  | HTTP client               |
| Lucide React           | Icons                     |
| React Resizable Panels | Split-panel layout        |

### Backend

| Tech                  | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| Node.js + Express     | Microservices framework                           |
| PostgreSQL            | Primary database                                  |
| Sequelize ORM         | Database models & migrations                      |
| OpenAI API            | Code complexity analysis (ai-service)             |
| OpenRouter + DeepSeek | LeetCode problem identification from video titles |
| YouTube Data API v3   | Fetch all videos from a playlist                  |
| LeetCode GraphQL API  | Fetch problem content, difficulty, starter code   |
| http-proxy-middleware | API gateway routing                               |
| Axios                 | Inter-service HTTP calls                          |
| dotenv                | Environment variable management                   |
| CORS                  | Cross-origin request handling                     |

---

## Architecture

The backend follows a **microservices pattern** behind a single API gateway.

```
Client (React + Vite :5173)
        │
        │  /api/*
        ▼
  API Gateway (:5001)
        │
   ┌────┴────────────────────────────────────────┐
   │              │              │                │
   ▼              ▼              ▼                ▼
File Service  Problem Service  AI Service   Playlist Service
  (:5002)       (:5003)         (:5004)       (:5005)
   │              │              │                │
   └──────────────┴──────────────┴────────────────┘
                          │
                    PostgreSQL DB
                    (algonote)
```

---

## Project Structure

```
├── package.json                    # Root scripts (start:backend)
├── start-backend.ps1               # PowerShell launcher for all services
│
├── client/                         # React frontend
│   ├── index.html
│   ├── vite.config.js              # Vite proxy → gateway :5001
│   └── src/
│       ├── App.jsx                 # Routes
│       ├── main.jsx
│       ├── components/
│       │   ├── editor/
│       │   │   └── CodeEditor.jsx          # Monaco editor wrapper
│       │   ├── explorer/
│       │   │   └── FileExplorer.jsx        # Sidebar file tree
│       │   └── layout/
│       │       ├── Layout.jsx              # App shell with sidebar
│       │       └── ProblemWorkspace.jsx    # Split-panel editor page
│       ├── pages/
│       │   ├── Dashboard.jsx              # Home / folder view
│       │   ├── FolderView.jsx             # Folder contents
│       │   └── PlaylistFeaturePage.jsx    # YouTube → DSA Sheet generator
│       ├── services/
│       │   ├── api.js                     # File, problem, AI API calls
│       │   └── playlistApi.js             # Playlist feature API calls
│       └── store/
│           └── useFileStore.js            # Zustand global store
│
└── backend/
    ├── gateway/
    │   └── server.js                      # Express proxy gateway (:5001)
    │
    └── services/
        ├── file-service/                  # File system CRUD (:5002)
        │   └── src/
        │       ├── config/database.js
        │       ├── controllers/fileController.js
        │       ├── models/FileNode.js
        │       └── routes/fileRoutes.js
        │
        ├── problem-service/               # Problem content CRUD (:5003)
        │   └── src/
        │       ├── config/database.js
        │       ├── controllers/
        │       │   ├── problemController.js
        │       │   └── importController.js    # LeetCode scraper
        │       ├── models/Problem.js
        │       └── routes/problemRoutes.js
        │
        ├── ai-service/                    # OpenAI code analysis (:5004)
        │   └── src/
        │       ├── controllers/aiController.js
        │       └── routes/aiRoutes.js
        │
        └── youtube-playlist-service/      # Playlist sheet generator (:5005)
            └── src/
                ├── config/database.js
                ├── controllers/playlistController.js
                ├── models/
                │   ├── LearningSheet.js       # learning_sheets table
                │   └── SheetProblem.js        # sheet_problems table
                ├── routes/playlistRoutes.js
                └── services/
                    ├── youtubeService.js      # YouTube Data API
                    ├── openrouterService.js   # DeepSeek via OpenRouter
                    └── leetcodeService.js     # LeetCode GraphQL
```

---

## Database Schema

### Existing tables (managed by Sequelize)

| Table        | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `file_nodes` | Folders and files in the explorer tree                     |
| `problems`   | Problem content: description, solutions, notes, complexity |

### Playlist feature tables (auto-created on service start)

| Table             | Description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `learning_sheets` | Sheet metadata: name, playlist URL, created_at                                                                         |
| `sheet_problems`  | Individual problems: title, slug, difficulty, description, starter code, YouTube link, LeetCode link, confidence score |

---

## How the Playlist Feature Works

```
1. User pastes a YouTube playlist URL on PlaylistFeaturePage
          │
2. YouTube Data API v3
   → Fetches all video titles + URLs from the playlist (handles pagination)
          │
3. OpenRouter API (DeepSeek model)
   → For each video title, identifies the matching LeetCode problem
   → Returns: { title, titleSlug, difficulty, confidence }
   → Skips videos with confidence < 0.5 (intros, non-LeetCode content)
          │
4. LeetCode GraphQL API
   → Fetches full problem data by titleSlug
   → Returns: title, content (HTML), difficulty, exampleTestcases, codeSnippets
          │
5. PostgreSQL
   → Stores sheet in learning_sheets
   → Stores each problem in sheet_problems
          │
6. Frontend displays the sheet with expandable problem list
          │
7. "Add to Explorer" button
   → Creates a folder in file-service (named after the sheet)
   → Creates one file per problem inside that folder
   → Pre-populates each problem entry with description + starter code
   → Navigates to dashboard — folder appears instantly in sidebar
          │
8. Click any file → ProblemWorkspace opens with problem loaded
   "LeetCode" button → opens original problem on leetcode.com
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (database name: `algonote`)
- YouTube Data API v3 key
- OpenRouter API key
- OpenAI API key

### Environment Variables

**`backend/services/youtube-playlist-service/.env`**

```env
OPENROUTER_API_KEY=your_openrouter_key
YOUTUBE_API_KEY=your_youtube_data_api_key
DB_NAME=algonote
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
PLAYLIST_SERVICE_PORT=5005
```

**`backend/services/ai-service/.env`**

```env
OPENAI_API_KEY=your_openai_key
```

**`backend/services/file-service/.env`** and **`backend/services/problem-service/.env`**

```env
DB_NAME=algonote
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
```

### Installation

```bash
# Install root dependencies
npm install

# Install all service dependencies
cd backend/gateway && npm install
cd ../services/file-service && npm install
cd ../problem-service && npm install
cd ../ai-service && npm install
cd ../youtube-playlist-service && npm install

# Install client dependencies
cd ../../../../client && npm install
```

### Running the App

```bash
# Terminal 1 — Start all backend services
npm run start:backend

# Terminal 2 — Start frontend
cd client && npm run dev
```

Or use the PowerShell script to launch each service in its own window:

```powershell
.\start-backend.ps1
```

App runs at **http://localhost:5173**

### Service Ports

| Service                  | Port |
| ------------------------ | ---- |
| API Gateway              | 5001 |
| File Service             | 5002 |
| Problem Service          | 5003 |
| AI Service               | 5004 |
| YouTube Playlist Service | 5005 |

---

## API Reference

### File Service

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/files`     | Get full file system tree |
| POST   | `/api/files`     | Create file or folder     |
| PUT    | `/api/files/:id` | Update file metadata      |
| DELETE | `/api/files/:id` | Delete file or folder     |

### Problem Service

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/api/problems/:fileId` | Get problem data               |
| POST   | `/api/problems`         | Create problem entry           |
| PUT    | `/api/problems/:fileId` | Update solutions/notes/content |
| DELETE | `/api/problems/:fileId` | Delete problem                 |
| POST   | `/api/problems/import`  | Import from LeetCode URL       |

### AI Service

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| POST   | `/api/ai/analyze` | Analyze code time & space complexity |

### Playlist Service

| Method | Endpoint                                        | Description                        |
| ------ | ----------------------------------------------- | ---------------------------------- |
| POST   | `/api/youtube-playlist/import`                  | Import playlist and generate sheet |
| GET    | `/api/youtube-playlist/sheets`                  | List all sheets                    |
| GET    | `/api/youtube-playlist/sheet/:id`               | Get sheet with all problems        |
| POST   | `/api/youtube-playlist/sheet/:id/create-folder` | Create explorer folder from sheet  |
| DELETE | `/api/youtube-playlist/sheet/:id`               | Delete sheet                       |
