import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { IUser, UserRole } from '../../../core/models/user.model';
import { ICategory } from '../../../core/models/category.model';
import { IDepartment } from '../../../core/models/department.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  // Users
  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  getUsers(page?: number, pageSize?: number): Observable<IUser[]> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<ApiResponse<IUser[]>>(
      environment.apiUrl + API_ENDPOINTS.USERS.BASE,
      { headers: this.getAuthHeaders(), params }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load users');
        return throwError(() => error);
      })
    );
  }

  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  changeUserRole(userId: number, role: UserRole): Observable<void> {
    return this.http.patch<ApiResponse<void>>(
      environment.apiUrl + API_ENDPOINTS.USERS.ROLE(userId),
      { role },
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('User role updated')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to update role');
        return throwError(() => error);
      })
    );
  }

  // Categories
  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  createCategory(category: { name: string; nameAr: string; description?: string }): Observable<ICategory> {
    return this.http.post<ApiResponse<ICategory>>(
      environment.apiUrl + API_ENDPOINTS.CATEGORIES.BASE,
      category,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Category created')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to create category');
        return throwError(() => error);
      })
    );
  }

  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  updateCategory(id: number, category: { name: string; nameAr: string; description?: string }): Observable<ICategory> {
    return this.http.put<ApiResponse<ICategory>>(
      environment.apiUrl + API_ENDPOINTS.CATEGORIES.BASE + '/' + id,
      category,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Category updated')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to update category');
        return throwError(() => error);
      })
    );
  }

  // Departments
  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  createDepartment(department: { name: string; nameAr: string; description?: string }): Observable<IDepartment> {
    return this.http.post<ApiResponse<IDepartment>>(
      environment.apiUrl + API_ENDPOINTS.DEPARTMENTS.BASE,
      department,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Department created')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to create department');
        return throwError(() => error);
      })
    );
  }

  // LEGACY: duplicated error handling — centralized in Day 3 error interceptor
  updateDepartment(id: number, department: { name: string; nameAr: string; description?: string }): Observable<IDepartment> {
    return this.http.put<ApiResponse<IDepartment>>(
      environment.apiUrl + API_ENDPOINTS.DEPARTMENTS.BASE + '/' + id,
      department,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Department updated')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to update department');
        return throwError(() => error);
      })
    );
  }
}
