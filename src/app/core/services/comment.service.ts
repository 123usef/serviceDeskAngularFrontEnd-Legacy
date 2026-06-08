import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { IComment, ICommentCreate } from '../models/comment.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  // LEGACY: manual auth header — interceptor added in Day 3
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
    });
  }

  getComments(ticketId: number): Observable<IComment[]> {
    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<IComment[]>>(
      environment.apiUrl + API_ENDPOINTS.COMMENTS.BY_TICKET(ticketId),
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load comments');
        return throwError(() => error);
      })
    );
  }

  addComment(ticketId: number, comment: ICommentCreate): Observable<IComment> {
    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.post<ApiResponse<IComment>>(
      environment.apiUrl + API_ENDPOINTS.COMMENTS.BY_TICKET(ticketId),
      comment,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Comment added')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to add comment');
        return throwError(() => error);
      })
    );
  }

  deleteComment(ticketId: number, commentId: number): Observable<void> {
    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.delete<ApiResponse<void>>(
      environment.apiUrl + API_ENDPOINTS.COMMENTS.BY_ID(ticketId, commentId),
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Comment deleted')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to delete comment');
        return throwError(() => error);
      })
    );
  }
}
