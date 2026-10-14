import { Router } from 'express';
import { getChatMessages, saveChatMessage } from '../supabaseClient.js';

export const chatRouter = Router();

/**
 * GET /api/chat/:roomId
 * Fetch chat message history for a room
 */
chatRouter.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const messages = await getChatMessages(roomId, limit);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/chat/:roomId
 * Post a new chat message
 */
chatRouter.post('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user_id, user_name, user_avatar, user_role, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    const savedMessage = await saveChatMessage({
      room_id: roomId,
      user_id,
      user_name,
      user_avatar,
      user_role,
      message
    });

    res.status(201).json({ success: true, message: savedMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
