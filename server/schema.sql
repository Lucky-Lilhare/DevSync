-- ==============================================================================
-- DevSync: Supabase Database Schema Migration
-- Real-Time Collaborative Code & AI Review Workspace
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ROOMS TABLE
-- Stores collaboration rooms, metadata, host information, and creation timestamp
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,                       -- e.g. 'ROOM-8921' or custom ID
    name TEXT NOT NULL,                        -- e.g. 'DevSync Fullstack Workspace'
    language TEXT NOT NULL DEFAULT 'javascript',
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    host_id TEXT NOT NULL DEFAULT 'usr-host',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying rooms by update and creation date
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rooms_updated_at ON public.rooms(updated_at DESC);

-- ------------------------------------------------------------------------------
-- 2. CODE SNIPPETS TABLE
-- Stores multi-file code contents, current language, and revision timestamp per room
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    file_id TEXT NOT NULL,                     -- e.g. 'file-1' or unique file slug
    file_name TEXT NOT NULL,                   -- e.g. 'index.js', 'App.jsx'
    content TEXT NOT NULL DEFAULT '',
    language TEXT NOT NULL DEFAULT 'javascript',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_room_file UNIQUE (room_id, file_id)
);

CREATE INDEX IF NOT EXISTS idx_code_snippets_room_id ON public.code_snippets(room_id);

-- ------------------------------------------------------------------------------
-- 3. CHAT MESSAGES TABLE
-- Stores real-time chat history for rooms with user identity and timestamp
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_role TEXT NOT NULL DEFAULT 'Editor',
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_timestamp ON public.chat_messages(room_id, timestamp ASC);

-- ------------------------------------------------------------------------------
-- 4. USER SESSIONS TABLE (Optional Presence Tracking)
-- Tracks active participant sockets and cursor positions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    socket_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_role TEXT NOT NULL DEFAULT 'Editor',
    user_color TEXT DEFAULT '#86c33a',
    cursor_line INTEGER DEFAULT 1,
    cursor_column INTEGER DEFAULT 1,
    current_file_id TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_room ON public.user_sessions(room_id);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- Enables public/anonymous read and write for collaborative rooms
-- (Customize according to your Supabase Auth requirements if auth is enforced)
-- ------------------------------------------------------------------------------

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow public read access on rooms" 
    ON public.rooms FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update on rooms" 
    ON public.rooms FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on code_snippets" 
    ON public.code_snippets FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update on code_snippets" 
    ON public.code_snippets FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on chat_messages" 
    ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Allow public insert on chat_messages" 
    ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on user_sessions" 
    ON public.user_sessions FOR SELECT USING (true);

CREATE POLICY "Allow public manage on user_sessions" 
    ON public.user_sessions FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- SEED DATA: Default Demo Room (#ROOM-8921)
-- ------------------------------------------------------------------------------
INSERT INTO public.rooms (id, name, language, is_private, host_id)
VALUES (
    'ROOM-8921',
    'DevSync Workspace Demo',
    'javascript',
    false,
    'usr-1'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.code_snippets (room_id, file_id, file_name, content, language)
VALUES (
    'ROOM-8921',
    'f-1',
    'index.js',
    '// DevSync Real-Time Collaborative Workspace
// Shared by 4 developers online

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory items database
let items = [
  { id: 1, name: "Collaborative Session", status: "active" },
  { id: 2, name: "AI Review Agent", status: "monitoring" }
];

// Vulnerable Query demonstration
app.get("/api/items/search", (req, res) => {
  const query = req.query.q;
  // AI Warning: Potential unsanitized query param risk
  const results = items.filter(i => i.name.toLowerCase().includes(query?.toLowerCase() || ""));
  res.json({ success: true, count: results.length, data: results });
});

app.listen(PORT, () => {
  console.log(`[DevSync Engine] Server active on port ${PORT}`);
});',
    'javascript'
) ON CONFLICT (room_id, file_id) DO NOTHING;

INSERT INTO public.chat_messages (room_id, user_id, user_name, user_avatar, user_role, message)
VALUES 
    ('ROOM-8921', 'usr-2', 'Sarah Connor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', 'Editor', 'Hey team! Just hopped on. Checking the Express server route logic.'),
    ('ROOM-8921', 'usr-3', 'Elena Rostova', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', 'Host', 'Looks good. Let us run an AI Security Scan on the search endpoint before merging.')
ON CONFLICT DO NOTHING;
