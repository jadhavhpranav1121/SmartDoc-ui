import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent {
  @Input() disabled = false;
  @Output() send = new EventEmitter<string>();

  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  text = '';

  onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.text = el.value;
    this.autoResize(el);
  }

  private autoResize(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const q = this.text.trim();
    if (!q || this.disabled) return;
    this.send.emit(q);
    this.text = '';
    if (this.textareaRef) {
      this.textareaRef.nativeElement.value = '';
      this.textareaRef.nativeElement.style.height = 'auto';
    }
  }
}
