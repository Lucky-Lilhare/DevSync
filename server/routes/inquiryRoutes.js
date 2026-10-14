import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  subscribeNewsletter,
  createFeedbackReport
} from '../supabaseClient.js';

export const inquiryRouter = Router();

/**
 * POST /api/inquiries
 * Save a new user inquiry / contact form submission to Supabase
 */
inquiryRouter.post('/', async (req, res) => {
  try {
    const { name, email, company, inquiry_type, team_size, message, metadata } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    const inquiry = await createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim(),
      inquiry_type: inquiry_type || 'general',
      team_size,
      message: message.trim(),
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully recorded in Supabase!',
      inquiry
    });
  } catch (err) {
    console.error('[Inquiry Route Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to submit inquiry' });
  }
});

/**
 * GET /api/inquiries
 * Retrieve recent inquiries from Supabase
 */
inquiryRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const inquiries = await getInquiries(limit);
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/inquiries/newsletter
 * Subscribe to DevSync updates
 */
inquiryRouter.post('/newsletter', async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email is required' });
    }

    const subscriber = await subscribeNewsletter(email.trim().toLowerCase(), source);
    res.status(201).json({
      success: true,
      message: 'Subscribed to DevSync early access updates!',
      subscriber
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/inquiries/feedback
 * Submit feedback or bug reports
 */
inquiryRouter.post('/feedback', async (req, res) => {
  try {
    const { name, email, category, rating, feedback, room_id } = req.body;
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ success: false, error: 'Feedback message is required' });
    }

    const report = await createFeedbackReport({
      name,
      email,
      category,
      rating,
      feedback: feedback.trim(),
      room_id
    });

    res.status(201).json({
      success: true,
      message: 'Feedback received and saved to Supabase!',
      report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
