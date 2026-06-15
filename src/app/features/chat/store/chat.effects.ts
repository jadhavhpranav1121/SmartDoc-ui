import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat.models';
import * as ChatActions from './chat.actions';
import { selectSessionId } from './chat.selectors';
import { AppState } from '../../../store/app.state';

@Injectable()
export class ChatEffects {
  constructor(
    private actions$: Actions,
    private chatService: ChatService,
    private store: Store<AppState>
  ) {}

  /**
   * sendQuestion -> addUserMessage immediately (optimistic UI), then POST /api/ask.
   * concatMap: queues requests - prevents out-of-order AI responses if user types fast.
   */
  sendQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendQuestion),
      withLatestFrom(this.store.select(selectSessionId)),
      concatMap(([{ question, topK }, sessionId]) => {
        const userMsg: ChatMessage = {
          id: uuidv4(),
          role: 'user',
          text: question,
          timestamp: new Date()
        };
        this.store.dispatch(ChatActions.addUserMessage({ message: userMsg }));

        return this.chatService.ask({ question, topK: topK ?? 3, sessionId }).pipe(
          map(response => {
            const aiMsg: ChatMessage = {
              id: uuidv4(),
              role: 'ai',
              text: response.answer,
              timeTakenMs: response.timeTakenMs,
              sourcesUsed: response.sourcesUsed,
              sourceFile: response.sourceFile,
              timestamp: new Date()
            };
            return ChatActions.askSuccess({
              message: aiMsg,
              sessionId: response.sessionId
            });
          }),
          catchError(err => {
            const msg = err?.error?.error ?? 'Failed to get a response. Try again.';
            return of(ChatActions.askFailure({ error: msg }));
          })
        );
      })
    )
  );

  /**
   * clearConversation -> DELETE /api/conversation/:sessionId
   * concatMap keeps clear requests ordered.
   */
  clearConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.clearConversation),
      withLatestFrom(this.store.select(selectSessionId)),
      concatMap(([, sessionId]) => {
        if (!sessionId || sessionId === 'new') {
          return of(ChatActions.clearConversationSuccess());
        }

        return this.chatService.clearSession(sessionId).pipe(
          map(() => ChatActions.clearConversationSuccess()),
          catchError(err => {
            const msg = err?.error?.error ?? 'Could not clear conversation on server.';
            return of(ChatActions.clearConversationFailure({ error: msg }));
          })
        );
      })
    )
  );
}
