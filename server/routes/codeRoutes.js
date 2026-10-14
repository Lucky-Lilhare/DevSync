import { Router } from 'express';
import { getCodeSnippets, saveCodeSnippet } from '../supabaseClient.js';

export const codeRouter = Router();

/**
 * GET /api/code/:roomId
 * Fetch all code snippets for a room
 */
codeRouter.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const snippets = await getCodeSnippets(roomId);
    res.json({ success: true, snippets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/code/:roomId
 * Save or update a code snippet for a room
 */
codeRouter.post('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { file_id, file_name, content, language } = req.body;

    if (!file_id) {
      return res.status(400).json({ success: false, error: 'file_id is required' });
    }

    const savedSnippet = await saveCodeSnippet(roomId, {
      file_id,
      file_name,
      content,
      language
    });

    res.json({ success: true, snippet: savedSnippet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
