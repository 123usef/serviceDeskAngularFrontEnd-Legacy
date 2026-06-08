import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { IUser, ILoginRequest, ILoginResponse, UserRole } from '../models/user.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { NotificationService } from './notification.service';

const TOKEN_KEY = 'sd_token';
const USER_KEY = 'sd_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<IUser | null>;
  public currentUser$: Observable<IUser | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<IUser | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(request: ILoginRequest): Observable<ILoginResponse> {
    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.post<ApiResponse<ILoginResponse>>(
      environment.apiUrl + API_ENDPOINTS.AUTH.LOGIN,
      request
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(data => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        this.currentUserSubject.next(data.user);
      }),
      catchError(error => {
        const message = error?.error?.message || error?.message || 'Login failed';
        this.notificationService.error(message);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  me(): Observable<IUser> {
    // LEGACY: manual auth header — interceptor added in Day 3
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getToken()
    });

    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<IUser>>(
      environment.apiUrl + API_ENDPOINTS.AUTH.ME,
      { headers }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(user => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        const message = error?.error?.message || error?.message || 'Failed to fetch user';
        this.notificationService.error(message);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): IUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as IUser;
    } catch {
      return null;
    }
  }
}
