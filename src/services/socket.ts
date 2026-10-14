import { io, Socket } from 'socket.io-client';
import type { Collaborator, ChatMessage } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private currentRoomId: string | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize or return the socket connection
   */
  public getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(BACKEND_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log(`⚡ [SocketClient] Connected to DevSync backend: ${this.socket?.id}`);
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log(`🔌 [SocketClient] Disconnected: ${reason}`);
      });

      this.socket.on('connect_error', (error) => {
        this.isConnected = false;
        console.warn(`⚠️ [SocketClient] Backend connection error (${error.message}). Operating in offline/local mode.`);
      });
    }

    return this.socket;
  }

  /**
   * Join a room with user identity
   */
  public joinRoom(
    roomId: string,
    user: { id: string; name: string; avatar: string; role: string; color: string }
  ) {
    const s = this.getSocket();
    if (!s.connected) {
      s.connect();
    }

    this.currentRoomId = roomId;
    s.emit('join-room', { roomId, user });
  }

  /**
   * Leave current room
   */
  public leaveRoom() {
    if (this.socket && this.socket.connected && this.currentRoomId) {
      this.socket.emit('leave-room');
    }
    this.currentRoomId = null;
  }

  /**
   * Emit code change to room peers
   */
  public emitCodeChange(roomId: string, fileId: string, fileName: string, content: string, language: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('code-change', {
        roomId,
        fileId,
        fileName,
        content,
        language
      });
    }
  }

  /**
   * Emit cursor position movement
   */
  public emitCursorMove(roomId: string, fileId: string, cursorLine: number, cursorColumn: number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('cursor-move', {
        roomId,
        fileId,
        cursorLine,
        cursorColumn
      });
    }
  }

  /**
   * Send chat message
   */
  public emitSendMessage(roomId: string, message: string, user: { id: string; name: string; avatar: string; role: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send-message', {
        roomId,
        message,
        user
      });
    }
  }

  /**
   * Broadcast code execution
   */
  public emitCodeRun(roomId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('code-run-broadcast', { roomId });
    }
  }

  /**
   * Subscribe to initial room state
   */
  public onRoomInit(callback: (data: { roomId: string; snippets: any[]; chatHistory: any[]; participants: any[] }) => void) {
    const s = this.getSocket();
    s.off('room-init');
    s.on('room-init', callback);
  }

  /**
   * Subscribe to peer code updates
   */
  public onCodeUpdate(callback: (data: { fileId: string; fileName: string; content: string; language: string; senderUser: string }) => void) {
    const s = this.getSocket();
    s.off('code-update');
    s.on('code-update', callback);
  }

  /**
   * Subscribe to peer cursor updates
   */
  public onCursorUpdate(callback: (data: { socketId: string; userId: string; userName: string; color: string; fileId: string; cursorLine: number; cursorColumn: number }) => void) {
    const s = this.getSocket();
    s.off('cursor-update');
    s.on('cursor-update', callback);
  }

  /**
   * Subscribe to new chat messages
   */
  public onNewMessage(callback: (message: ChatMessage) => void) {
    const s = this.getSocket();
    s.off('new-message');
    s.on('new-message', callback);
  }

  /**
   * Subscribe to participant updates
   */
  public onParticipantsUpdate(callback: (data: { roomId: string; participants: Collaborator[] }) => void) {
    const s = this.getSocket();
    s.off('participants-update');
    s.on('participants-update', callback);
  }

  /**
   * Subscribe to user joined alerts
   */
  public onUserJoined(callback: (data: { user: Collaborator }) => void) {
    const s = this.getSocket();
    s.off('user-joined');
    s.on('user-joined', callback);
  }

  /**
   * Subscribe to user left alerts
   */
  public onUserLeft(callback: (data: { socketId: string; user: Collaborator }) => void) {
    const s = this.getSocket();
    s.off('user-left');
    s.on('user-left', callback);
  }

  /**
   * Check connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
