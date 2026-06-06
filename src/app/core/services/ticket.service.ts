import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ITicket, ITicketDetail, ITicketCreate, ITicketUpdate } from '../models/ticket.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface TicketFilter {
  status?: number;
  priority?: number;
  categoryId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private ticketsSubject = new BehaviorSubject<ITicket[]>([]);
  public tickets$: Observable<ITicket[]> = this.ticketsSubject.asObservable();

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

  private buildParams(filter?: TicketFilter): HttpParams {
    let params = new HttpParams();
    if (!filter) {
      return params;
    }
    if (filter.status !== undefined && filter.status !== null) {
      params = params.set('status', filter.status.toString());
    }
    if (filter.priority !== undefined && filter.priority !== null) {
      params = params.set('priority', filter.priority.toString());
    }
    if (filter.categoryId !== undefined && filter.categoryId !== null) {
      params = params.set('categoryId', filter.categoryId.toString());
    }
    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.pageSize !== undefined) {
      params = params.set('pageSize', filter.pageSize.toString());
    }
    return params;
  }

  getTickets(filter?: TicketFilter): Observable<ITicket[]> {
    // LEGACY: duplicated error handling
    return this.http.get<ApiResponse<ITicket[]>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.BASE,
      { headers: this.getAuthHeaders(), params: this.buildParams(filter) }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(tickets => this.ticketsSubject.next(tickets)),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load tickets');
        return throwError(() => error);
      })
    );
  }

  getMyTickets(page?: number, pageSize?: number): Observable<ITicket[]> {
    // LEGACY: duplicated error handling
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<ApiResponse<ITicket[]>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.MY_TICKETS,
      { headers: this.getAuthHeaders(), params }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load your tickets');
        return throwError(() => error);
      })
    );
  }

  getAssignedTickets(page?: number, pageSize?: number): Observable<ITicket[]> {
    // LEGACY: duplicated error handling
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<ApiResponse<ITicket[]>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.ASSIGNED,
      { headers: this.getAuthHeaders(), params }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load assigned tickets');
        return throwError(() => error);
      })
    );
  }

  getTicketById(id: number): Observable<ITicketDetail> {
    // LEGACY: duplicated error handling
    return this.http.get<ApiResponse<ITicketDetail>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.BY_ID(id),
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to load ticket');
        return throwError(() => error);
      })
    );
  }

  createTicket(ticket: ITicketCreate): Observable<ITicket> {
    // LEGACY: duplicated error handling
    return this.http.post<ApiResponse<ITicket>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.BASE,
      ticket,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Ticket created successfully')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to create ticket');
        return throwError(() => error);
      })
    );
  }

  updateTicket(id: number, ticket: ITicketUpdate): Observable<ITicket> {
    // LEGACY: duplicated error handling
    return this.http.put<ApiResponse<ITicket>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.BY_ID(id),
      ticket,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Ticket updated successfully')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to update ticket');
        return throwError(() => error);
      })
    );
  }

  assignTicket(id: number, technicianId: number): Observable<void> {
    // LEGACY: duplicated error handling
    return this.http.patch<ApiResponse<void>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.ASSIGN(id),
      { technicianId },
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Ticket assigned successfully')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to assign ticket');
        return throwError(() => error);
      })
    );
  }

  changeStatus(id: number, status: number, resolutionNotes?: string): Observable<void> {
    // LEGACY: duplicated error handling
    const body: any = { status };
    if (resolutionNotes) {
      body.resolutionNotes = resolutionNotes;
    }

    return this.http.patch<ApiResponse<void>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.STATUS(id),
      body,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Status updated successfully')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to update status');
        return throwError(() => error);
      })
    );
  }

  deleteTicket(id: number): Observable<void> {
    // LEGACY: duplicated error handling
    return this.http.delete<ApiResponse<void>>(
      environment.apiUrl + API_ENDPOINTS.TICKETS.BY_ID(id),
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(() => this.notificationService.success('Ticket deleted successfully')),
      catchError(error => {
        this.notificationService.error(error?.error?.message || 'Failed to delete ticket');
        return throwError(() => error);
      })
    );
  }
}
