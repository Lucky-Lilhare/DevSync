import type { CodeFile, AiReviewItem } from '../types';

export const INITIAL_FILES: CodeFile[] = [
  {
    id: 'file-index-js',
    name: 'index.js',
    language: 'javascript',
    content: `// DevSync Node.js Data Gateway & User Queries
import express from 'express';
import { Pool } from 'pg';

const app = express();
const dbPool = new Pool();
app.use(express.json());

// ⚠️ Line 8: Unused token salt secret
const UNUSED_LEGACY_SALT = "deprecated_auth_salt_v1";

app.get('/api/users/search', async (req, res) => {
  const { role, username } = req.query;

  // ⚠️ CRITICAL VULNERABILITY (Line 14): SQL Injection Risk via unsanitized string concatenation
  const query = "SELECT id, username, email, role FROM users WHERE role = '" + role + "' AND active = true";
  
  try {
    const result = await dbPool.query(query);
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('[DevSync Gateway] Server listening on port 3000');
});
`
  },
  {
    id: 'file-app-jsx',
    name: 'App.jsx',
    language: 'javascript',
    content: `import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [collaborators, setCollaborators] = useState(['Alex', 'Sarah', 'Marcus']);
  const [activeSession, setActiveSession] = useState('ROOM-8921');
  
  // ⚠️ Line 8: Unused variable warning detected by AI review
  const unusedDebugPayload = { timestamp: Date.now(), mode: 'strict' };

  return (
    <div className="devsync-app-container">
      <header className="workspace-header">
        <h1>DevSync Real-Time Editor</h1>
        <span className="room-badge">#{activeSession}</span>
      </header>
      <main className="collaborators-grid">
        <p>Active Collaborators: {collaborators.join(', ')}</p>
      </main>
    </div>
  );
}
`
  },
  {
    id: 'file-styles-css',
    name: 'styles.css',
    language: 'html',
    content: `/* DevSync Workspace Global Styles */
.devsync-app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #090d16;
  color: #e6edf3;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #0d1220;
}

.room-badge {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 0.875rem;
}
`
  },
  {
    id: 'file-auth-ts',
    name: 'auth.service.ts',
    language: 'typescript',
    content: `import { createHash, timingSafeEqual } from 'crypto';

interface UserSession {
  userId: string;
  role: 'admin' | 'dev' | 'guest';
}

const activeSessions = new Map<string, UserSession>();

/**
 * Validates a user authentication token.
 * Warning: Potential timing attack detected in direct string comparison!
 */
export async function verifyUserToken(
  token: string, 
  expectedSignature: string
): Promise<boolean> {
  if (!token || !expectedSignature) {
    return false;
  }

  // ⚠️ CRITICAL: Direct comparison allows side-channel timing attack
  const isValid = token === expectedSignature;
  
  if (isValid) {
    const session = activeSessions.get(token);
    if (!session) {
      console.warn('[DevSync Auth] Session not found.');
      return false;
    }
    console.log(\`[DevSync Auth] User \${session.userId} authenticated successfully.\`);
    return true;
  }

  return false;
}
`
  },
  {
    id: 'file-data-py',
    name: 'data-pipeline.py',
    language: 'python',
    content: `import time
from typing import List, Dict, Any

class StreamProcessor:
    def __init__(self, batch_size: int = 100):
        self.batch_size = batch_size
        self.buffer: List[Dict[str, Any]] = []

    def ingest_event(self, event: Dict[str, Any]) -> None:
        """Appends event and triggers batch processing when buffer threshold reached."""
        self.buffer.append(event)
        
        # ⚠️ BUG: Buffer is never cleared after batch run, causing memory leak
        if len(self.buffer) >= self.batch_size:
            self.process_batch(self.buffer)

    def process_batch(self, batch: List[Dict[str, Any]]) -> int:
        print(f"[Pipeline] Processing {len(batch)} event items...")
        return len(batch)
`
  }
];

export const MOCK_AI_REVIEWS: AiReviewItem[] = [
  {
    id: 'rev-sql-injection',
    type: 'security',
    title: 'SQL Injection Risk detected at Line 14',
    description: 'Dynamic raw string concatenation in SQL query allows arbitrary SQL execution via unescaped role query parameter.',
    severity: 'critical',
    lineNumber: 14,
    endLineNumber: 15,
    originalSnippet: '  const query = "SELECT id, username, email, role FROM users WHERE role = \'" + role + "\' AND active = true";',
    suggestedSnippet: '  const query = "SELECT id, username, email, role FROM users WHERE role = $1 AND active = true";\n  const result = await dbPool.query(query, [role]);',
    explanation: 'Using parameterized queries ($1, $2) forces the database driver to separate query structure from user data, neutralizing SQL injection vectors completely.',
    applied: false
  },
  {
    id: 'rev-unused-var',
    type: 'style',
    title: 'Unused Variable Warning at Line 8',
    description: 'Variable "UNUSED_LEGACY_SALT" is declared but its value is never evaluated or referenced in the module scope.',
    severity: 'warning',
    lineNumber: 8,
    endLineNumber: 9,
    originalSnippet: 'const UNUSED_LEGACY_SALT = "deprecated_auth_salt_v1";',
    suggestedSnippet: '// Cleaned up unused legacy salt constant',
    explanation: 'Removing dead code and unreferenced credentials prevents accidental exposure and reduces bundle size.',
    applied: false
  },
  {
    id: 'rev-timing-attack',
    type: 'security',
    title: 'Timing Attack in Signature Check',
    description: 'Direct string comparison (===) leaks length and byte equality via execution timing variations, enabling side-channel attacks on tokens.',
    severity: 'critical',
    lineNumber: 26,
    endLineNumber: 27,
    originalSnippet: '  const isValid = token === expectedSignature;',
    suggestedSnippet: '  const isValid = token.length === expectedSignature.length &&\n    timingSafeEqual(Buffer.from(token), Buffer.from(expectedSignature));',
    explanation: 'crypto.timingSafeEqual computes comparison in constant time, preventing microsecond timing delta measurement by attackers.',
    applied: false
  }
];
