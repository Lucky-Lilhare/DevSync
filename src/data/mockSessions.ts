import type { SessionMeta } from '../types';

export const RECENT_SESSIONS: SessionMeta[] = [
  {
    id: 'ROOM-8921',
    name: 'DevSync Workspace',
    language: 'javascript',
    description: 'Full-stack Node.js & React live collaborative workspace with automated AST security review.',
    createdAt: '2026-10-14 15:00',
    updatedAt: 'Live now',
    participantCount: 4,
    isPrivate: false,
    activeFile: 'index.js',
    tags: ['JavaScript', 'React', 'Security', 'Express'],
    healthScore: 78
  },
  {
    id: 'room-alpha-702',
    name: 'Auth Gateway & Token Security Audit',
    language: 'typescript',
    description: 'Real-time collaborative hardening of OAuth2 token verification and HMAC signatures.',
    createdAt: '2026-10-14 13:30',
    updatedAt: '2 mins ago',
    participantCount: 4,
    isPrivate: false,
    activeFile: 'auth.service.ts',
    tags: ['Auth', 'Security', 'TypeScript', 'Crypto'],
    healthScore: 84
  },
  {
    id: 'room-beta-914',
    name: 'Distributed Stream Pipeline',
    language: 'python',
    description: 'High-throughput telemetry ingestion batch processor and buffer leak mitigation.',
    createdAt: '2026-10-13 18:15',
    updatedAt: '1 hour ago',
    participantCount: 2,
    isPrivate: true,
    activeFile: 'data-pipeline.py',
    tags: ['DataPipeline', 'Python', 'AsyncIO'],
    healthScore: 92
  },
  {
    id: 'room-gamma-401',
    name: 'Realtime Sync Engine & OT Protocol',
    language: 'rust',
    description: 'Low-latency peer synchronization daemon with lock-free atomic buffers.',
    createdAt: '2026-10-12 11:00',
    updatedAt: 'Yesterday',
    participantCount: 3,
    isPrivate: false,
    activeFile: 'realtime_sync.rs',
    tags: ['Rust', 'Concurrency', 'WebRTC'],
    healthScore: 97
  },
  {
    id: 'room-delta-119',
    name: 'API Gateway GraphQL Resolvers',
    language: 'typescript',
    description: 'N+1 query resolution optimization with DataLoader batching.',
    createdAt: '2026-10-11 16:45',
    updatedAt: '3 days ago',
    participantCount: 1,
    isPrivate: false,
    activeFile: 'schema.graphql',
    tags: ['GraphQL', 'Backend', 'Apollo'],
    healthScore: 89
  }
];

export const ROOM_TEMPLATES = [
  {
    id: 'tpl-ts',
    name: 'TypeScript Microservice',
    language: 'typescript' as const,
    icon: 'FileCode',
    description: 'Modern Node.js & TypeScript service with auth & security guards.'
  },
  {
    id: 'tpl-py',
    name: 'Python Data & AI Worker',
    language: 'python' as const,
    icon: 'Cpu',
    description: 'Stream processing and machine learning inference pipeline.'
  },
  {
    id: 'tpl-rs',
    name: 'Rust Systems Engine',
    language: 'rust' as const,
    icon: 'Shield',
    description: 'Memory-safe low latency multi-threaded network core.'
  },
  {
    id: 'tpl-go',
    name: 'Go Web API',
    language: 'go' as const,
    icon: 'Layers',
    description: 'Concurrent gRPC & REST service with standard middleware.'
  }
];
