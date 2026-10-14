import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { 
  CodeFile, 
  Collaborator, 
  ChatMessage, 
  AiReviewItem, 
  SessionMeta, 
  ConsoleOutputLog, 
  SupportedLanguage, 
  EditorTheme,
  ColorTheme 
} from '../types';
import { INITIAL_FILES, MOCK_AI_REVIEWS } from '../data/sampleCodes';
import { INITIAL_COLLABORATORS, INITIAL_CHAT_MESSAGES, CURRENT_USER } from '../data/mockCollaborators';
import { RECENT_SESSIONS } from '../data/mockSessions';
import { socketService } from '../services/socket';
import { api } from '../services/api';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warn' | 'error';
}

interface WorkspaceContextType {
  currentView: 'dashboard' | 'workspace';
  setCurrentView: (view: 'dashboard' | 'workspace') => void;
  sessions: SessionMeta[];
  activeSession: SessionMeta | null;
  files: CodeFile[];
  activeFileId: string;
  activeFile: CodeFile | undefined;
  setActiveFileId: (id: string) => void;
  updateFileContent: (fileId: string, content: string, fromRemote?: boolean) => void;
  addNewFile: (name: string, language: SupportedLanguage) => void;
  closeFile: (fileId: string) => void;
  handleCursorChange: (line: number, column: number) => void;
  
  // Socket & Connection state
  isSocketConnected: boolean;
  
  // Editor & Aesthetic config
  editorTheme: EditorTheme;
  setEditorTheme: (theme: EditorTheme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  changeLanguage: (lang: SupportedLanguage) => void;
  
  // Collaborators & Chat
  collaborators: Collaborator[];
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, isCodeSnippet?: boolean) => void;
  toggleCollaboratorMute: (userId: string) => void;
  isAudioCallActive: boolean;
  toggleAudioCall: () => void;
  
  // AI Review
  aiReviews: AiReviewItem[];
  isAiScanning: boolean;
  runAiScan: () => void;
  applyAiFix: (reviewId: string) => void;
  explainBug: (reviewId: string) => void;
  
  // Terminal & Execution
  consoleLogs: ConsoleOutputLog[];
  isRunningCode: boolean;
  runCode: () => void;
  clearConsole: () => void;
  
  // Layout toggles
  rightSidebarTab: 'ai' | 'chat' | 'participants';
  setRightSidebarTab: (tab: 'ai' | 'chat' | 'participants') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  isFileExplorerOpen: boolean;
  setIsFileExplorerOpen: (open: boolean) => void;
  
  // Session actions
  joinSession: (sessionId: string, sessionName?: string) => boolean;
  createSession: (data: { name: string; language: SupportedLanguage; isPrivate: boolean; description?: string }) => string;
  leaveSession: () => void;
  
  // Toasts
  toasts: ToastItem[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warn' | 'error') => void;
  removeToast: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'workspace'>('dashboard');
  const [sessions, setSessions] = useState<SessionMeta[]>(RECENT_SESSIONS);
  const [activeSession, setActiveSession] = useState<SessionMeta | null>(RECENT_SESSIONS[0]);
  
  // Files
  const [files, setFiles] = useState<CodeFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_FILES[0].id);
  
  // Editor & Aesthetic Settings
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('vs-dark');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('bexer-clean');
  const [fontSize, setFontSize] = useState<number>(14);
  
  // Collaborators & Audio
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isAudioCallActive, setIsAudioCallActive] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  
  // AI Review
  const [aiReviews, setAiReviews] = useState<AiReviewItem[]>(MOCK_AI_REVIEWS);
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  
  // Console & Runtime
  const [consoleLogs, setConsoleLogs] = useState<ConsoleOutputLog[]>([
    {
      id: 'log-init-1',
      type: 'info',
      message: '[DevSync Backend] Real-time engine active at http://localhost:5000',
      timestamp: '14:48:10'
    },
    {
      id: 'log-init-2',
      type: 'success',
      message: '[WebRTC Mesh & Socket.io] 4 peers connected. Latency: 18ms jitter: ±2ms.',
      timestamp: '14:48:12'
    }
  ]);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  
  // UI Panels
  const [rightSidebarTab, setRightSidebarTab] = useState<'ai' | 'chat' | 'participants'>('ai');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(true);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState<boolean>(true);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'warn' | 'error' = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const activeFile = files.find(f => f.id === activeFileId);
  const activeSessionRef = useRef(activeSession);
  activeSessionRef.current = activeSession;

  // --------------------------------------------------------------------------
  // Real-Time Socket.io & Backend Synchronization
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (currentView !== 'workspace' || !activeSession) return;

    const roomId = activeSession.id;

    // Join room on Socket.io backend
    socketService.joinRoom(roomId, {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      role: 'Host',
      color: CURRENT_USER.color
    });

    const socket = socketService.getSocket();
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    setIsSocketConnected(socket.connected);

    // Initial snapshot from server (Supabase / In-Memory cache)
    socketService.onRoomInit((data) => {
      console.log('📦 [DevSync Client] Received room snapshot:', data);
      if (data.snippets && data.snippets.length > 0) {
        setFiles(prev => {
          const updated = [...prev];
          data.snippets.forEach((snip: any) => {
            const idx = updated.findIndex(f => f.id === snip.file_id || f.name === snip.file_name);
            if (idx >= 0) {
              updated[idx] = {
                ...updated[idx],
                content: snip.content,
                language: snip.language as SupportedLanguage
              };
            } else {
              updated.push({
                id: snip.file_id || `file-${Date.now()}`,
                name: snip.file_name,
                language: snip.language as SupportedLanguage,
                content: snip.content
              });
            }
          });
          return updated;
        });
      }

      if (data.chatHistory && data.chatHistory.length > 0) {
        setChatMessages(data.chatHistory.map((m: any) => ({
          id: m.id,
          senderId: m.user_id,
          senderName: m.user_name,
          senderAvatar: m.user_avatar || CURRENT_USER.avatar,
          senderColor: '#86c33a',
          text: m.message,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    });

    // Real-time peer code update
    socketService.onCodeUpdate((data) => {
      setFiles(prev => prev.map(f => {
        if (f.id === data.fileId || f.name === data.fileName) {
          return { ...f, content: data.content, isDirty: false };
        }
        return f;
      }));
    });

    // Real-time cursor positions
    socketService.onCursorUpdate((data) => {
      setCollaborators(prev => prev.map(c => {
        if (c.id === data.userId || c.name === data.userName) {
          return {
            ...c,
            cursorLine: data.cursorLine,
            cursorColumn: data.cursorColumn,
            currentFile: data.fileId || c.currentFile
          };
        }
        return c;
      }));
    });

    // Real-time incoming chat message
    socketService.onNewMessage((msg: any) => {
      const formatted: ChatMessage = {
        id: msg.id || 'msg-' + Date.now(),
        senderId: msg.user_id || msg.senderId || 'peer',
        senderName: msg.user_name || msg.senderName || 'Collaborator',
        senderAvatar: msg.user_avatar || msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        senderColor: '#86c33a',
        text: msg.message || msg.text || '',
        timestamp: msg.timestamp 
          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => {
        if (prev.some(m => m.id === formatted.id)) return prev;
        return [...prev, formatted];
      });
    });

    // Peer joined alert
    socketService.onUserJoined((data) => {
      addToast('Collaborator Joined', `${data.user.name} joined the room`, 'info');
      setCollaborators(prev => {
        if (prev.some(c => c.id === data.user.id)) return prev;
        return [...prev, data.user];
      });
    });

    // Peer left alert
    socketService.onUserLeft((data) => {
      addToast('Collaborator Left', `${data.user?.name || 'A teammate'} left the room`, 'info');
    });

    // Update active participants
    socketService.onParticipantsUpdate((data) => {
      if (data.participants && data.participants.length > 0) {
        setCollaborators(prev => {
          // Merge with predefined mock collaborators to maintain rich avatar UI
          const currentIds = new Set(data.participants.map(p => p.id));
          const remainingMocks = prev.filter(c => !currentIds.has(c.id));
          return [...data.participants, ...remainingMocks];
        });
      }
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.leaveRoom();
    };
  }, [currentView, activeSession, addToast]);

  // --------------------------------------------------------------------------
  // File Content Updates & Synchronization
  // --------------------------------------------------------------------------
  const updateFileContent = (fileId: string, content: string, fromRemote: boolean = false) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content, isDirty: !fromRemote } : f));

    // If local change, broadcast via Socket.io and auto-save
    if (!fromRemote && activeSession) {
      const file = files.find(f => f.id === fileId);
      if (file) {
        socketService.emitCodeChange(activeSession.id, fileId, file.name, content, file.language);
      }
    }
  };

  const handleCursorChange = useCallback((line: number, column: number) => {
    if (activeSession && activeFile) {
      socketService.emitCursorMove(activeSession.id, activeFile.name, line, column);
    }
  }, [activeSession, activeFile]);

  const addNewFile = (name: string, language: SupportedLanguage) => {
    const newFile: CodeFile = {
      id: 'file-' + Date.now(),
      name,
      language,
      content: `// ${name}\n// Created in DevSync collaborative session\n\nexport function example() {\n  console.log("Hello from ${name}");\n}\n`,
      isDirty: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    addToast('File Created', `Created ${name} in session`, 'success');

    if (activeSession) {
      api.saveSnippet(activeSession.id, {
        file_id: newFile.id,
        file_name: newFile.name,
        content: newFile.content,
        language: newFile.language
      });
    }
  };

  const closeFile = (fileId: string) => {
    if (files.length <= 1) {
      addToast('Cannot Close File', 'At least one file must remain open', 'warn');
      return;
    }
    const nextFiles = files.filter(f => f.id !== fileId);
    setFiles(nextFiles);
    if (activeFileId === fileId) {
      setActiveFileId(nextFiles[0].id);
    }
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    if (!activeFile) return;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, language: lang } : f));
    addToast('Language Updated', `Switched active syntax to ${lang.toUpperCase()}`, 'info');

    if (activeSession) {
      api.saveSnippet(activeSession.id, {
        file_id: activeFile.id,
        file_name: activeFile.name,
        content: activeFile.content,
        language: lang
      });
    }
  };

  const sendChatMessage = (text: string, isCodeSnippet: boolean = false) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderAvatar: CURRENT_USER.avatar,
      senderColor: CURRENT_USER.color,
      text,
      timestamp: timeStr,
      isCodeSnippet,
      codeLanguage: activeFile?.language
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Send via Socket.io and REST
    if (activeSession) {
      socketService.emitSendMessage(activeSession.id, text, CURRENT_USER);
      api.sendChatMessage(activeSession.id, {
        user_id: CURRENT_USER.id,
        user_name: CURRENT_USER.name,
        user_avatar: CURRENT_USER.avatar,
        user_role: 'Host',
        message: text
      });
    }

    // Simulate an organic response from a teammate after a brief moment
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const responses = [
          "Looks solid to me! Let's run the test suite.",
          "I just pulled your latest change. Socket.io sync is instantaneous.",
          "Check the AI review tab, it just detected a fix recommendation.",
          "Agree. I'm adding an assertion for this edge case right now."
        ];
        const randomResp = responses[Math.floor(Math.random() * responses.length)];
        const simMsg: ChatMessage = {
          id: 'msg-sim-' + Date.now(),
          senderId: 'user-2',
          senderName: 'Sarah Chen',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          senderColor: '#a855f7',
          text: randomResp,
          timestamp: timeStr
        };
        setChatMessages(curr => [...curr, simMsg]);
      }, 2500);
    }
  };

  const toggleCollaboratorMute = (userId: string) => {
    setCollaborators(prev => prev.map(c => {
      if (c.id === userId) {
        return { ...c, isMuted: !c.isMuted };
      }
      return c;
    }));
  };

  const toggleAudioCall = () => {
    setIsAudioCallActive(prev => {
      const next = !prev;
      addToast(
        next ? 'Joined Voice Room' : 'Left Voice Room', 
        next ? 'Simulated HD spatial audio connected with 3 peers' : 'Microphone disconnected',
        next ? 'success' : 'info'
      );
      return next;
    });
  };

  const runAiScan = () => {
    setIsAiScanning(true);
    addToast('AI Scanning Codebase', 'AST inspection & vulnerability detection running...', 'info');
    setTimeout(() => {
      setIsAiScanning(false);
      addToast('AI Scan Complete', 'Found 1 critical security flaw & 2 optimizations', 'warn');
    }, 1800);
  };

  const applyAiFix = (reviewId: string) => {
    const review = aiReviews.find(r => r.id === reviewId);
    if (!review) return;
    if (!activeFile) return;

    let content = activeFile.content;
    if (content.includes(review.originalSnippet.trim())) {
      content = content.replace(review.originalSnippet.trim(), review.suggestedSnippet.trim());
    } else {
      content = content.replace(review.originalSnippet, review.suggestedSnippet);
    }

    updateFileContent(activeFile.id, content);
    setAiReviews(prev => prev.map(r => r.id === reviewId ? { ...r, applied: true } : r));
    addToast(
      'Fix Applied Automatically', 
      `Updated ${review.title} on lines ${review.lineNumber} in ${activeFile.name}`, 
      'success'
    );
  };

  const explainBug = (reviewId: string) => {
    const review = aiReviews.find(r => r.id === reviewId);
    if (!review) return;
    setRightSidebarTab('ai');
    setIsSidebarOpen(true);
    addToast('Explaining Vulnerability', review.title, 'info');
  };

  const runCode = () => {
    setIsRunningCode(true);
    setIsTerminalOpen(true);
    addToast('Running Code', `Compiling and executing ${activeFile?.name}...`, 'info');

    if (activeSession) {
      socketService.emitCodeRun(activeSession.id);
    }

    setTimeout(() => {
      setIsRunningCode(false);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const fileLang = activeFile?.language || 'typescript';
      let mockOutput: ConsoleOutputLog[] = [];

      if (activeFile?.name === 'index.js') {
        mockOutput = [
          {
            id: 'log-' + Date.now() + '-1',
            type: 'info',
            message: '[DevSync Node Runtime] Initializing index.js with Express & Supabase Client...',
            timestamp: timeStr
          },
          {
            id: 'log-' + Date.now() + '-2',
            type: 'success',
            message: '[DevSync Gateway] Server listening on port 5000.',
            timestamp: timeStr
          },
          {
            id: 'log-' + Date.now() + '-3',
            type: 'info',
            message: 'GET /api/rooms/ROOM-8921/history 200 OK (Snippets & history fetched).',
            timestamp: timeStr,
            executionDuration: '0.19s'
          },
          {
            id: 'log-' + Date.now() + '-4',
            type: 'success',
            message: 'Process running in sandbox isolate with zero unhandled rejections.',
            timestamp: timeStr
          }
        ];
      } else {
        mockOutput = [
          {
            id: 'log-' + Date.now() + '-1',
            type: 'info',
            message: `[DevSync V8 Engine (${fileLang})] Executing ${activeFile?.name} in isolated sandbox...`,
            timestamp: timeStr
          },
          {
            id: 'log-' + Date.now() + '-2',
            type: 'success',
            message: 'DevSync Engine initialized successfully. Binary linked in 0.18s.',
            timestamp: timeStr,
            executionDuration: '0.18s'
          }
        ];
      }

      setConsoleLogs(prev => [...prev, ...mockOutput]);
      addToast('Execution Succeeded', `Finished in ${mockOutput[mockOutput.length - 1]?.executionDuration || '0.2s'} with exit code 0`, 'success');
    }, 1200);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
    addToast('Console Cleared', 'Output buffer purged', 'info');
  };

  const joinSession = (sessionId: string, sessionName?: string): boolean => {
    const rawId = sessionId.trim();
    const found = sessions.find(s => s.id.toLowerCase() === rawId.toLowerCase());
    
    // Fetch room history from backend / Supabase
    api.getRoomHistory(rawId).then(history => {
      if (history && history.snippets && history.snippets.length > 0) {
        setFiles(history.snippets.map(s => ({
          id: s.file_id,
          name: s.file_name,
          language: s.language as SupportedLanguage,
          content: s.content
        })));
        if (history.snippets[0]) {
          setActiveFileId(history.snippets[0].file_id);
        }
      }
    });

    if (found) {
      setActiveSession(found);
      setCurrentView('workspace');
      addToast('Joined Session', `Connected to ${found.name} (${found.id})`, 'success');
      return true;
    } else {
      const newSession: SessionMeta = {
        id: rawId,
        name: sessionName || `Collaborative Session: ${rawId}`,
        language: 'javascript',
        createdAt: 'Just now',
        updatedAt: 'Active now',
        participantCount: 2,
        isPrivate: false,
        activeFile: 'index.js',
        tags: ['Live', 'Collab'],
        healthScore: 90
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
      setCurrentView('workspace');
      addToast('Joined Room', `Room ${rawId} synchronized with backend`, 'success');
      return true;
    }
  };

  const createSession = (data: { name: string; language: SupportedLanguage; isPrivate: boolean; description?: string }): string => {
    const id = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);
    const newSession: SessionMeta = {
      id,
      name: data.name || 'Untitled DevSync Session',
      language: data.language,
      description: data.description || 'Live multi-user collaborative workspace with DevSync AI.',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      participantCount: 1,
      isPrivate: data.isPrivate,
      activeFile: data.language === 'python' ? 'main.py' : data.language === 'rust' ? 'main.rs' : 'index.js',
      tags: [data.language.toUpperCase(), 'Live', 'Sync'],
      healthScore: 95
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
    setCurrentView('workspace');
    addToast('Room Created!', `Share Room ID ${id} with collaborators`, 'success');

    // Notify backend & Supabase
    api.createRoom({
      id,
      name: newSession.name,
      language: newSession.language,
      is_private: newSession.isPrivate,
      host_id: CURRENT_USER.id
    });
    api.saveSnippet(id, {
      file_id: 'f-1',
      file_name: newSession.activeFile,
      content: `// ${newSession.name} (${id})\n// Live collaborative session connected to Supabase\n\nconsole.log("Connected to DevSync Room: ${id}");\n`,
      language: newSession.language
    });

    return id;
  };

  const leaveSession = () => {
    socketService.leaveRoom();
    setCurrentView('dashboard');
    addToast('Workspace Closed', 'Returned to DevSync dashboard', 'info');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentView,
        setCurrentView,
        sessions,
        activeSession,
        files,
        activeFileId,
        activeFile,
        setActiveFileId,
        updateFileContent,
        addNewFile,
        closeFile,
        handleCursorChange,
        isSocketConnected,
        editorTheme,
        setEditorTheme,
        colorTheme,
        setColorTheme,
        fontSize,
        setFontSize,
        changeLanguage,
        collaborators,
        chatMessages,
        sendChatMessage,
        toggleCollaboratorMute,
        isAudioCallActive,
        toggleAudioCall,
        aiReviews,
        isAiScanning,
        runAiScan,
        applyAiFix,
        explainBug,
        consoleLogs,
        isRunningCode,
        runCode,
        clearConsole,
        rightSidebarTab,
        setRightSidebarTab,
        isSidebarOpen,
        setIsSidebarOpen,
        isTerminalOpen,
        setIsTerminalOpen,
        isFileExplorerOpen,
        setIsFileExplorerOpen,
        joinSession,
        createSession,
        leaveSession,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
