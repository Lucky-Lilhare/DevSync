import { Router } from 'express';
import {
  getRoom,
  createOrUpdateRoom,
  getCodeSnippets,
  getChatMessages
} from '../supabaseClient.js';

export const roomRouter = Router();

/**
 * GET /api/rooms/:id
 * Fetch room metadata
 */
roomRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await getRoom(id);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/rooms
 * Create or initialize a new room
 */
roomRouter.post('/', async (req, res) => {
  try {
    const { id, name, language, is_private, host_id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Room ID is required' });
    }
    const room = await createOrUpdateRoom({
      id,
      name,
      language,
      is_private,
      host_id
    });
    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/rooms/:id/history
 * Fetch complete room snapshot (metadata + code snippets + chat messages)
 */
roomRouter.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const [room, snippets, chatMessages] = await Promise.all([
      getRoom(id),
      getCodeSnippets(id),
      getChatMessages(id, 100)
    ]);

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({
      success: true,
      room,
      snippets,
      chatMessages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
