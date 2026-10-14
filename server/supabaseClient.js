import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are placeholder or actual keys
const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log('⚡ [DevSync Backend] Supabase client initialized successfully at:', supabaseUrl);
} else {
  console.log('ℹ️  [DevSync Backend] Supabase credentials not provided or placeholder. Running in-memory database cache with mock persistence.');
}

// ==============================================================================
// In-Memory Database Fallback Store (Used when Supabase is not configured)
// ==============================================================================
const memoryDb = {
  rooms: new Map([
    ['ROOM-8921', {
      id: 'ROOM-8921',
      name: 'DevSync Workspace Demo',
      language: 'javascript',
      is_private: false,
      host_id: 'usr-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  ]),
  code_snippets: new Map([
    ['ROOM-8921:f-1', {
      room_id: 'ROOM-8921',
      file_id: 'f-1',
      file_name: 'index.js',
      language: 'javascript',
      content: `// DevSync Real-Time Collaborative Workspace
// Shared by active peers

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory items database
let items = [
  { id: 1, name: "Collaborative Session", status: "active" },
  { id: 2, name: "AI Review Agent", status: "monitoring" }
];

// Search endpoint
app.get("/api/items/search", (req, res) => {
  const query = req.query.q;
  const results = items.filter(i => i.name.toLowerCase().includes(query?.toLowerCase() || ""));
  res.json({ success: true, count: results.length, data: results });
});

app.listen(PORT, () => {
  console.log(\`[DevSync Engine] Server active on port \${PORT}\`);
});`,
      updated_at: new Date().toISOString()
    }]
  ]),
  chat_messages: new Map([
    ['ROOM-8921', [
      {
        id: 'msg-seed-1',
        room_id: 'ROOM-8921',
        user_id: 'usr-2',
        user_name: 'Sarah Connor',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
        user_role: 'Editor',
        message: 'Hey team! Connected to the session. Ready to code.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      },
      {
        id: 'msg-seed-2',
        room_id: 'ROOM-8921',
        user_id: 'usr-3',
        user_name: 'Elena Rostova',
        user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        user_role: 'Host',
        message: 'Welcome everyone! Testing the Socket.io sync and AI scanner integration.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      }
    ]]
  ])
};

// ==============================================================================
// Unified Database Access Layer (Supabase with In-Memory fallback)
// ==============================================================================

/**
 * Fetch room metadata by room_id
 */
export async function getRoom(roomId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Supabase Error] getRoom:', error.message);
    }
    if (data) return data;
  }

  return memoryDb.rooms.get(roomId) || null;
}

/**
 * Create or update room record
 */
export async function createOrUpdateRoom({ id, name, language = 'javascript', is_private = false, host_id = 'usr-host' }) {
  const roomRecord = {
    id,
    name: name || `DevSync Room ${id}`,
    language,
    is_private: Boolean(is_private),
    host_id,
    updated_at: new Date().toISOString()
  };

  // Always update memory store
  const existing = memoryDb.rooms.get(id);
  memoryDb.rooms.set(id, {
    created_at: existing?.created_at || new Date().toISOString(),
    ...roomRecord
  });

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rooms')
      .upsert(roomRecord, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] createOrUpdateRoom:', error.message);
    } else {
      return data;
    }
  }

  return memoryDb.rooms.get(id);
}

/**
 * Fetch all code snippets / files for a given room
 */
export async function getCodeSnippets(roomId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('room_id', roomId)
      .order('updated_at', { ascending: true });

    if (error) {
      console.error('[Supabase Error] getCodeSnippets:', error.message);
    } else if (data && data.length > 0) {
      return data;
    }
  }

  // Memory fallback: filter all snippets for this roomId
  const snippets = [];
  for (const [key, snippet] of memoryDb.code_snippets.entries()) {
    if (snippet.room_id === roomId) {
      snippets.push(snippet);
    }
  }
  return snippets;
}

/**
 * Save or update a code snippet for a room
 */
export async function saveCodeSnippet(roomId, { file_id, file_name, content, language }) {
  const snippetRecord = {
    room_id: roomId,
    file_id: file_id || 'f-default',
    file_name: file_name || 'index.js',
    content: content ?? '',
    language: language || 'javascript',
    updated_at: new Date().toISOString()
  };

  // Update memory store
  const key = `${roomId}:${snippetRecord.file_id}`;
  memoryDb.code_snippets.set(key, snippetRecord);

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('code_snippets')
      .upsert(snippetRecord, { onConflict: 'room_id,file_id' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] saveCodeSnippet:', error.message);
    } else {
      return data;
    }
  }

  return snippetRecord;
}

/**
 * Fetch chat message history for a room
 */
export async function getChatMessages(roomId, limit = 50) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[Supabase Error] getChatMessages:', error.message);
    } else if (data && data.length > 0) {
      return data;
    }
  }

  return memoryDb.chat_messages.get(roomId) || [];
}

/**
 * Save a new chat message to a room
 */
export async function saveChatMessage({ room_id, user_id, user_name, user_avatar, user_role = 'Editor', message }) {
  const messageRecord = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    room_id,
    user_id: user_id || 'anonymous',
    user_name: user_name || 'Collaborator',
    user_avatar: user_avatar || null,
    user_role,
    message,
    timestamp: new Date().toISOString()
  };

  // Update memory store
  if (!memoryDb.chat_messages.has(room_id)) {
    memoryDb.chat_messages.set(room_id, []);
  }
  const messages = memoryDb.chat_messages.get(room_id);
  messages.push(messageRecord);
  if (messages.length > 100) messages.shift(); // Keep latest 100 in memory

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id,
        user_id: messageRecord.user_id,
        user_name: messageRecord.user_name,
        user_avatar: messageRecord.user_avatar,
        user_role: messageRecord.user_role,
        message: messageRecord.message,
        timestamp: messageRecord.timestamp
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] saveChatMessage:', error.message);
    } else {
      return data;
    }
  }

  return messageRecord;
}

/**
 * Save a new user inquiry / contact request
 */
export async function createInquiry({ name, email, company, inquiry_type = 'general', team_size, message, metadata = {} }) {
  const inquiryRecord = {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    company: company || null,
    inquiry_type,
    team_size: team_size || null,
    message,
    status: 'new',
    metadata,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        name,
        email,
        company: inquiryRecord.company,
        inquiry_type,
        team_size: inquiryRecord.team_size,
        message,
        status: 'new',
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] createInquiry:', error.message);
      throw error;
    }
    return data;
  }

  return inquiryRecord;
}

/**
 * Fetch all inquiries
 */
export async function getInquiries(limit = 50) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Supabase Error] getInquiries:', error.message);
      throw error;
    }
    return data;
  }
  return [];
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletter(email, source = 'website_landing') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, source }, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] subscribeNewsletter:', error.message);
      throw error;
    }
    return data;
  }
  return { email, source, created_at: new Date().toISOString() };
}

/**
 * Submit user feedback or bug report
 */
export async function createFeedbackReport({ name, email, category = 'feature_request', rating, feedback, room_id }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('feedback_reports')
      .insert({
        name: name || null,
        email: email || null,
        category,
        rating: rating || null,
        feedback,
        room_id: room_id || null
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] createFeedbackReport:', error.message);
      throw error;
    }
    return data;
  }
  return { category, feedback, created_at: new Date().toISOString() };
}

