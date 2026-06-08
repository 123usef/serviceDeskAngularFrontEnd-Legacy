import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ICategory } from '../models/category.model';
import { IDepartment } from '../models/department.model';
import { ITechnician } from '../models/user.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  private departmentsSubject = new BehaviorSubject<IDepartment[]>([]);
  private techniciansSubject = new BehaviorSubject<ITechnician[]>([]);

  private categoriesLoaded = false;
  private departmentsLoaded = false;
  private techniciansLoaded = false;

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

  getCategories(forceRefresh = false): Observable<ICategory[]> {
    if (this.categoriesLoaded && !forceRefresh) {
      return of(this.categoriesSubject.value);
    }

    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<ICategory[]>>(
      environment.apiUrl + API_ENDPOINTS.CATEGORIES.BASE,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(categories => {
        this.categoriesSubject.next(categories);
        this.categoriesLoaded = true;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load categories');
        return throwError(() => error);
      })
    );
  }

  getDepartments(forceRefresh = false): Observable<IDepartment[]> {
    if (this.departmentsLoaded && !forceRefresh) {
      return of(this.departmentsSubject.value);
    }

    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<IDepartment[]>>(
      environment.apiUrl + API_ENDPOINTS.DEPARTMENTS.BASE,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(departments => {
        this.departmentsSubject.next(departments);
        this.departmentsLoaded = true;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load departments');
        return throwError(() => error);
      })
    );
  }

  getTechnicians(forceRefresh = false): Observable<ITechnician[]> {
    if (this.techniciansLoaded && !forceRefresh) {
      return of(this.techniciansSubject.value);
    }

    // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
    return this.http.get<ApiResponse<ITechnician[]>>(
      environment.apiUrl + API_ENDPOINTS.USERS.TECHNICIANS,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(technicians => {
        this.techniciansSubject.next(technicians);
        this.techniciansLoaded = true;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load technicians');
        return throwError(() => error);
      })
    );
  }

  clearCache(): void {
    this.categoriesLoaded = false;
    this.departmentsLoaded = false;
    this.techniciansLoaded = false;
  }
}
