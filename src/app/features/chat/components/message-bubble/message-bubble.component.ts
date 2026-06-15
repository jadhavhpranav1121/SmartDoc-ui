import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../models/chat.models';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss']
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;
}
