import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IComment } from '../../../../core/models/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent {
  @Input() comments: IComment[] = [];
  @Input() currentUserName = '';
  @Output() deleteComment = new EventEmitter<number>();

  canDelete(comment: IComment): boolean {
    return comment.createdByName === this.currentUserName;
  }

  onDelete(commentId: number): void {
    this.deleteComment.emit(commentId);
  }
}
