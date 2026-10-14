# DevSync: Real-Time Collaborative Code & AI Review Workspace

DevSync is a high-performance fullstack collaborative pair-programming platform featuring real-time code synchronization, live peer presence, AST security vulnerability scanning, interactive team chat, in-browser code execution, and spatial voice call simulation.

---

## ✨ Fullstack Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Monaco Code Editor (`@monaco-editor/react`), Lucide React icons.
- **Real-Time Engine**: Socket.io for sub-20ms code synchronization, cursor movement broadcasting, and instant chat.
- **Backend API**: Node.js & Express REST API with CORS support.
- **Database**: Supabase PostgreSQL database with Row Level Security (RLS) policies and automatic in-memory cache fallback.
- **Design System**: Bexer Clean Slate & Lime (`#151b26` slate navy & `#86c33a` vibrant lime) inspired by modern developer tooling.

---

## 📁 Project Structure

```text
DevSync/
├── server/
│   ├── routes/
│   │   ├── roomRoutes.js         # REST endpoints for room metadata & history
│   │   ├── codeRoutes.js         # Code snippet persistence & retrieval
│   │   └── chatRoutes.js         # Real-time message storage
│   ├── sockets/
│   │   └── socketHandler.js      # Socket.io events: join-room, code-change, cursor-move, send-message
│   ├── .env                      # Backend environment config
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Express, Socket.io, @supabase/supabase-js, cors, dotenv
│   ├── schema.sql                # Complete Supabase PostgreSQL DDL migration
│   ├── server.js                 # Express server + HTTP server + Socket.io entry point
│   └── supabaseClient.js         # Supabase client with in-memory persistence fallback
├── src/
│   ├── components/
│   │   ├── dashboard/            # Landing page, Create/Join modals, Telemetry
│   │   └── workspace/            # Split IDE, Monaco Editor, Terminal, AI review, Chat
│   ├── context/
│   │   └── WorkspaceContext.tsx  # Global state wired to Socket.io & Supabase REST APIs
│   ├── services/
│   │   ├── socket.ts             # Client-side Socket.io service singleton
│   │   ├── supabase.ts           # Client-side Supabase client initialization
│   │   └── api.ts                # REST API client for backend room & code history
│   ├── types/                    # Shared TypeScript domain models
│   ├── App.tsx
│   └── index.css                 # Bexer slate/lime design tokens & utilities
├── .env                          # Frontend environment variables
├── .env.example
├── package.json                  # Scripts: dev, server, server:dev, build
└── vite.config.ts
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend Server (Express + Socket.io)
```bash
# In the project root:
npm run server:dev

# Or in server directory:
cd server
npm run dev
```
The server will start at `http://localhost:5000` with WebSocket support at `ws://localhost:5000`.

### 2. Start the Frontend Client (Vite + React)
```bash
# In the project root:
npm run dev
```
Open `http://localhost:5174/` or `http://localhost:5173/` in your browser.

---

## 🗄️ Supabase Cloud PostgreSQL Database

DevSync is linked to the Supabase Cloud project (`devsync`):
- **Project Ref**: `porapjgyplszokrsgjzr`
- **Region**: `us-east-1`
- **API URL**: `https://porapjgyplszokrsgjzr.supabase.co`

### Active Database Tables & Schemas:
1. **`public.inquiries`**: Stores enterprise, partnership, and demo requests submitted from the website.
2. **`public.newsletter_subscribers`**: Stores developer bulletin and early access email subscriptions.
3. **`public.feedback_reports`**: Stores user feedback, bug reports, and AST security findings.
4. **`public.rooms`**: Collaborative session metadata, privacy toggles, and language configurations.
5. **`public.code_snippets`**: Multi-file code snippets and contents synced live.
6. **`public.chat_messages`**: Real-time room chat messages.
7. **`public.user_sessions`**: Connected peer socket presence tracking.

All tables are secured with Row Level Security (RLS) policies allowing collaborative frontend operations. Both `server/.env` and `.env` are configured with these credentials.

---

## ⌨️ Developer Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Enter` | Compile and run active file in sandbox |
| `Ctrl + Shift + S` | Trigger instant AI AST vulnerability scan |
| `Ctrl + \`` | Toggle bottom terminal / console panel |
| `Ctrl + B` | Toggle right AI & collaboration sidebar |
