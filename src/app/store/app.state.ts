export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timeTakenMs: number | null;
  sourcesUsed: string[];
}

export interface AppState {
  auth: {
    token: string | null;
    loading: boolean;
    error: string | null;
  };
  upload: {
    status: 'idle' | 'uploading' | 'success' | 'error';
    fileName: string | null;
    totalChunks: number;
    error: string | null;
  };
  chat: {
    messages: ChatMessage[];
    sessionId: string | null;
    loading: boolean;
    error: string | null;
  };
}
