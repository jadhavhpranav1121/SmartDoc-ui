export type MessageRole = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timeTakenMs?: number;
  sourcesUsed?: number;
  sourceFile?: string;
  timestamp: Date;
}

/** Maps to Spring Boot AskRequest */
export interface AskRequest {
  question: string;
  topK: number;
  sessionId: string | null;
}

/** Maps to Spring Boot AskResponse */
export interface AskResponse {
  answer: string;
  sourcesUsed: number;
  sourceFile: string;
  timeTakenMs: number;
  sessionId: string | null;
}
