import type { Collaborator, ChatMessage } from '../types';

export const CURRENT_USER: Collaborator = {
  id: 'user-self',
  name: 'Alex Rivera (You)',
  email: 'alex.rivera@devsync.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  color: '#38bdf8', // Cyan
  role: 'Host',
  status: 'online',
  cursorLine: 14,
  cursorColumn: 8,
  currentFile: 'index.js',
  isMuted: false,
  latencyMs: 18,
};

export const INITIAL_COLLABORATORS: Collaborator[] = [
  CURRENT_USER,
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.c@devsync.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#a855f7', // Purple
    role: 'Editor',
    status: 'in-call',
    cursorLine: 14,
    cursorColumn: 6,
    currentFile: 'index.js',
    isMuted: false,
    latencyMs: 24,
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    email: 'marcus.v@devsync.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#10b981', // Emerald
    role: 'Editor',
    status: 'online',
    cursorLine: 8,
    cursorColumn: 12,
    currentFile: 'App.jsx',
    isMuted: true,
    latencyMs: 32,
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.r@devsync.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#f59e0b', // Amber
    role: 'Viewer',
    status: 'idle',
    cursorLine: 3,
    cursorColumn: 1,
    currentFile: 'styles.css',
    isMuted: true,
    latencyMs: 45,
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    senderColor: '#a855f7',
    text: "Hey Alex! Check out index.js. DevSync AI detected a critical SQL injection vulnerability on Line 14.",
    timestamp: '15:10'
  },
  {
    id: 'msg-2',
    senderId: 'user-3',
    senderName: 'Marcus Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    senderColor: '#10b981',
    text: "I also noticed an unused variable warning in App.jsx. Let's fix both before running our test suite.",
    timestamp: '15:12'
  },
  {
    id: 'msg-3',
    senderId: 'user-self',
    senderName: 'Alex Rivera (You)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderColor: '#38bdf8',
    text: "Awesome, I'm opening the AI Review panel to inspect the AST diff and hit 'Apply Fix'.",
    timestamp: '15:14'
  }
];
