import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { IDashboardStats } from '../models/dashboard.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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

  getStats(): Observable<IDashboardStats> {
    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<IDashboardStats>>(
      environment.apiUrl + API_ENDPOINTS.DASHBOARD.STATS,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load dashboard stats');
        return throwError(() => error);
      })
    );
  }
}
