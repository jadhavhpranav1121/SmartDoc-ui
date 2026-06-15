import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectMessages = createSelector(selectChatState, s => s.messages);
export const selectSessionId = createSelector(selectChatState, s => s.sessionId);
export const selectChatLoading = createSelector(selectChatState, s => s.loading);
export const selectChatError = createSelector(selectChatState, s => s.error);
export const selectMessageCount = createSelector(selectMessages, msgs => msgs.length);
