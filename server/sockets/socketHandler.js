import {
  getRoom,
  createOrUpdateRoom,
  getCodeSnippets,
  saveCodeSnippet,
  getChatMessages,
  saveChatMessage
} from '../supabaseClient.js';

// Map of roomId -> Map(socketId -> userData)
const activeRoomParticipants = new Map();

// Map of roomId:fileId -> NodeJS timeout (for debounce saving)
const saveDebounceTimers = new Map();

/**
 * Configure and register all Socket.io event listeners
 * @param {import('socket.io').Server} io
 */
export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    let currentRoomId = null;
    let currentUser = null;

    console.log(`🔌 [Socket.io] New client connected: ${socket.id}`);

    /**
     * Event: join-room
     * Handles user joining a collaborative session
     */
    socket.on('join-room', async (payload = {}) => {
      const { roomId, user = {} } = payload;
      if (!roomId) return;

      currentRoomId = roomId;
      currentUser = {
        id: user.id || socket.id,
        name: user.name || `Dev-${socket.id.slice(0, 4)}`,
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${socket.id}`,
        role: user.role || 'Editor',
        color: user.color || '#86c33a',
        cursorLine: 1,
        cursorColumn: 1,
        currentFile: 'index.js',
        socketId: socket.id,
        status: 'online'
      };

      socket.join(roomId);

      // Track active participants in memory
      if (!activeRoomParticipants.has(roomId)) {
        activeRoomParticipants.set(roomId, new Map());
      }
      activeRoomParticipants.get(roomId).set(socket.id, currentUser);

      // Fetch or auto-create room in Supabase / DB
      let roomData = await getRoom(roomId);
      if (!roomData) {
        roomData = await createOrUpdateRoom({
          id: roomId,
          name: `DevSync Workspace - ${roomId}`,
          host_id: currentUser.id
        });
      }

      // Fetch existing code snippets and chat messages
      const [snippets, chatHistory] = await Promise.all([
        getCodeSnippets(roomId),
        getChatMessages(roomId, 50)
      ]);

      const participantsList = Array.from(activeRoomParticipants.get(roomId).values());

      // Send initial room snapshot to joining user
      socket.emit('room-init', {
        roomId,
        roomData,
        snippets,
        chatHistory,
        participants: participantsList
      });

      // Broadcast new participant to other peers
      socket.to(roomId).emit('user-joined', {
        user: currentUser,
        timestamp: new Date().toISOString()
      });

      // Broadcast updated participants list to everyone in room
      io.to(roomId).emit('participants-update', {
        roomId,
        participants: participantsList
      });

      console.log(`👤 [Socket.io] ${currentUser.name} joined room ${roomId} (Total: ${participantsList.length})`);
    });

    /**
     * Event: code-change
     * Handles real-time collaborative text synchronization
     */
    socket.on('code-change', (data = {}) => {
      const { roomId, fileId, fileName, content, language } = data;
      if (!roomId || content === undefined) return;

      // Broadcast changes to all other peers in the room immediately
      socket.to(roomId).emit('code-update', {
        fileId,
        fileName,
        content,
        language,
        senderSocketId: socket.id,
        senderUser: currentUser?.name || 'Collaborator',
        timestamp: new Date().toISOString()
      });

      // Debounce saving to Supabase / persistent DB (500ms delay)
      const timerKey = `${roomId}:${fileId || 'default'}`;
      if (saveDebounceTimers.has(timerKey)) {
        clearTimeout(saveDebounceTimers.get(timerKey));
      }

      const timer = setTimeout(async () => {
        try {
          await saveCodeSnippet(roomId, {
            file_id: fileId,
            file_name: fileName,
            content,
            language
          });
          saveDebounceTimers.delete(timerKey);
        } catch (err) {
          console.error('[Socket.io] Error auto-saving snippet:', err);
        }
      }, 500);

      saveDebounceTimers.set(timerKey, timer);
    });

    /**
     * Event: cursor-move
     * Broadcasts live cursor position & line tracking
     */
    socket.on('cursor-move', (data = {}) => {
      const { roomId, fileId, cursorLine, cursorColumn } = data;
      if (!roomId) return;

      if (currentUser) {
        currentUser.cursorLine = cursorLine || 1;
        currentUser.cursorColumn = cursorColumn || 1;
        if (fileId) currentUser.currentFile = fileId;
      }

      // Broadcast to other peers
      socket.to(roomId).emit('cursor-update', {
        socketId: socket.id,
        userId: currentUser?.id,
        userName: currentUser?.name,
        color: currentUser?.color,
        fileId,
        cursorLine,
        cursorColumn
      });
    });

    /**
     * Event: send-message
     * Handles collaborative chat messages
     */
    socket.on('send-message', async (data = {}) => {
      const { roomId, message, user } = data;
      if (!roomId || !message?.trim()) return;

      const messageSender = user || currentUser || {};
      const savedMessage = await saveChatMessage({
        room_id: roomId,
        user_id: messageSender.id || socket.id,
        user_name: messageSender.name || 'Developer',
        user_avatar: messageSender.avatar || currentUser?.avatar,
        user_role: messageSender.role || 'Editor',
        message: message.trim()
      });

      // Broadcast message to everyone in the room (including sender)
      io.to(roomId).emit('new-message', savedMessage);
    });

    /**
     * Event: code-run-broadcast
     * Informs peers when a user runs code
     */
    socket.on('code-run-broadcast', (data = {}) => {
      const { roomId } = data;
      if (!roomId) return;

      socket.to(roomId).emit('peer-running-code', {
        userName: currentUser?.name || 'A teammate',
        timestamp: new Date().toISOString()
      });
    });

    /**
     * Event: leave-room
     */
    socket.on('leave-room', () => {
      handleUserLeave();
    });

    /**
     * Event: disconnect
     */
    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
      handleUserLeave();
    });

    function handleUserLeave() {
      if (!currentRoomId) return;

      const roomParticipants = activeRoomParticipants.get(currentRoomId);
      if (roomParticipants && roomParticipants.has(socket.id)) {
        const departedUser = roomParticipants.get(socket.id);
        roomParticipants.delete(socket.id);

        socket.to(currentRoomId).emit('user-left', {
          socketId: socket.id,
          user: departedUser,
          timestamp: new Date().toISOString()
        });

        const remainingParticipants = Array.from(roomParticipants.values());
        io.to(currentRoomId).emit('participants-update', {
          roomId: currentRoomId,
          participants: remainingParticipants
        });

        if (roomParticipants.size === 0) {
          activeRoomParticipants.delete(currentRoomId);
        }
      }

      socket.leave(currentRoomId);
      currentRoomId = null;
      currentUser = null;
    }
  });
}
