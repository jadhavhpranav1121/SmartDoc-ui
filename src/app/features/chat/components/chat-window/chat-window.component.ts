import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { sendQuestion, clearConversation, startNewSession } from '../../store/chat.actions';
import {
  selectMessages,
  selectChatLoading,
  selectChatError,
  selectSessionId
} from '../../store/chat.selectors';
import { ChatMessage } from '../../models/chat.models';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList') messageListRef!: ElementRef<HTMLDivElement>;

  messages$!: Observable<ChatMessage[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  sessionId$!: Observable<string | null>;

  private shouldScroll = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.messages$ = this.store.select(selectMessages);
    this.loading$ = this.store.select(selectChatLoading);
    this.error$ = this.store.select(selectChatError);
    this.sessionId$ = this.store.select(selectSessionId);

    this.messages$.subscribe(() => {
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  onSend(question: string): void {
    this.store.dispatch(sendQuestion({ question }));
  }

  onClear(): void {
    this.store.dispatch(clearConversation());
  }

  onNewSession(): void {
    this.store.dispatch(startNewSession());
  }

  private scrollToBottom(): void {
    if (this.messageListRef) {
      const el = this.messageListRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  trackByMessage(_: number, msg: ChatMessage): string {
    return msg.id;
  }
}
