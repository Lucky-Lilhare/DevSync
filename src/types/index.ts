export type SupportedLanguage = 
  | 'javascript'
  | 'typescript' 
  | 'python' 
  | 'cpp'
  | 'rust' 
  | 'go' 
  | 'html' 
  | 'json';

export type EditorTheme = 'vs-dark' | 'light' | 'github-dark' | 'dracula' | 'one-dark';

export type ColorTheme = 'bexer-clean' | 'cyber-iris' | 'emerald-matrix' | 'sunset-coral' | 'deep-cosmic';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  role: 'Host' | 'Editor' | 'Viewer';
  status: 'online' | 'idle' | 'in-call';
  cursorLine?: number;
  cursorColumn?: number;
  currentFile: string;
  isMuted?: boolean;
  latencyMs: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  text: string;
  timestamp: string;
  isCodeSnippet?: boolean;
  codeLanguage?: string;
}

export interface AiReviewItem {
  id: string;
  type: 'security' | 'bug' | 'performance' | 'style';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  lineNumber: number;
  endLineNumber?: number;
  originalSnippet: string;
  suggestedSnippet: string;
  explanation: string;
  applied: boolean;
}

export interface SessionMeta {
  id: string;
  name: string;
  language: SupportedLanguage;
  description?: string;
  createdAt: string;
  updatedAt: string;
  participantCount: number;
  isPrivate: boolean;
  activeFile: string;
  tags: string[];
  healthScore: number;
}

export interface CodeFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  content: string;
  isDirty?: boolean;
}

export interface ConsoleOutputLog {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  timestamp: string;
  executionDuration?: string;
}
