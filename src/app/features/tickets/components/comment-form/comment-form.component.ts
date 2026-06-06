import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent {
  @Input() ticketId: number = 0;
  @Output() commentSubmit = new EventEmitter<string>();

  content = '';

  onSubmit(): void {
    if (!this.content.trim()) {
      return;
    }
    this.commentSubmit.emit(this.content);
    this.content = '';
  }
}
