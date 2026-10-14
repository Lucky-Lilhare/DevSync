const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface RoomHistoryResponse {
  success: boolean;
  room: {
    id: string;
    name: string;
    language: string;
    is_private: boolean;
    host_id: string;
    created_at: string;
  };
  snippets: Array<{
    room_id: string;
    file_id: string;
    file_name: string;
    content: string;
    language: string;
    updated_at: string;
  }>;
  chatMessages: Array<{
    id: string;
    room_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    user_role: string;
    message: string;
    timestamp: string;
  }>;
}

export interface InquiryPayload {
  name: string;
  email: string;
  company?: string;
  inquiry_type?: string;
  team_size?: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface FeedbackPayload {
  name?: string;
  email?: string;
  category?: 'bug' | 'feature_request' | 'ai_accuracy' | 'security' | 'general';
  rating?: number;
  feedback: string;
  room_id?: string;
}

export const api = {
  /**
   * Check backend server health
   */
  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Fetch room history including snippets and chat
   */
  async getRoomHistory(roomId: string): Promise<RoomHistoryResponse | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/rooms/${encodeURIComponent(roomId)}/history`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('[DevSync API] Could not connect to backend server, falling back to local state:', err);
      return null;
    }
  },

  /**
   * Create a new room in backend & Supabase
   */
  async createRoom(data: { id: string; name: string; language: string; is_private: boolean; host_id?: string }) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      console.warn('[DevSync API] Failed to create room on backend:', err);
      return null;
    }
  },

  /**
   * Save a code snippet to backend
   */
  async saveSnippet(roomId: string, data: { file_id: string; file_name: string; content: string; language: string }) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/code/${encodeURIComponent(roomId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      console.warn('[DevSync API] Failed to persist snippet:', err);
      return null;
    }
  },

  /**
   * Post a chat message
   */
  async sendChatMessage(roomId: string, messageData: { user_id: string; user_name: string; user_avatar?: string; user_role?: string; message: string }) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/${encodeURIComponent(roomId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[DevSync API] Failed to post message:', err);
      return null;
    }
  },

  /**
   * Submit an inquiry / contact form to Supabase
   */
  async submitInquiry(data: InquiryPayload) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit inquiry');
      return json;
    } catch (err: any) {
      console.error('[DevSync API] Submit inquiry error:', err);
      throw err;
    }
  },

  /**
   * Subscribe to newsletter / early access in Supabase
   */
  async subscribeNewsletter(email: string, source: string = 'website_landing') {
    try {
      const res = await fetch(`${BACKEND_URL}/api/inquiries/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to subscribe');
      return json;
    } catch (err: any) {
      console.error('[DevSync API] Newsletter subscription error:', err);
      throw err;
    }
  },

  /**
   * Submit user feedback or bug report to Supabase
   */
  async submitFeedback(data: FeedbackPayload) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/inquiries/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit feedback');
      return json;
    } catch (err: any) {
      console.error('[DevSync API] Feedback submission error:', err);
      throw err;
    }
  }
};
