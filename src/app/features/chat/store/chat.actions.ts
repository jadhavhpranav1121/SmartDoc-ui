import { createAction, props } from '@ngrx/store';
import { ChatMessage } from '../models/chat.models';

export const sendQuestion = createAction(
  '[Chat] Send Question',
  props<{ question: string; topK?: number }>()
);

export const addUserMessage = createAction(
  '[Chat] Add User Message',
  props<{ message: ChatMessage }>()
);

export const askSuccess = createAction(
  '[Chat] Ask Success',
  props<{ message: ChatMessage; sessionId: string | null }>()
);

export const askFailure = createAction(
  '[Chat] Ask Failure',
  props<{ error: string }>()
);

export const clearConversation = createAction('[Chat] Clear Conversation');

export const clearConversationSuccess = createAction('[Chat] Clear Conversation Success');

export const clearConversationFailure = createAction(
  '[Chat] Clear Conversation Failure',
  props<{ error: string }>()
);

export const startNewSession = createAction('[Chat] Start New Session');
