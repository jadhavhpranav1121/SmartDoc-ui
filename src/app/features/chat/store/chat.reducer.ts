import { createReducer, on } from '@ngrx/store';
import { ChatMessage } from '../models/chat.models';
import * as ChatActions from './chat.actions';

export interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialChatState: ChatState = {
  messages: [],
  sessionId: 'new',
  loading: false,
  error: null
};

export const chatReducer = createReducer(
  initialChatState,

  on(ChatActions.addUserMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    loading: true,
    error: null
  })),

  on(ChatActions.askSuccess, (state, { message, sessionId }) => ({
    ...state,
    messages: [...state.messages, message],
    sessionId,
    loading: false,
    error: null
  })),

  on(ChatActions.askFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ChatActions.clearConversationSuccess, () => ({
    ...initialChatState
  })),

  on(ChatActions.startNewSession, () => ({
    ...initialChatState
  }))
);
