import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface INotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new BehaviorSubject<INotification | null>(null);
  public notification$: Observable<INotification | null> = this.notificationSubject.asObservable();

  success(message: string): void {
    this.notificationSubject.next({ message, type: 'success' });
    setTimeout(() => this.clear(), 3000);
  }

  error(message: string): void {
    this.notificationSubject.next({ message, type: 'error' });
  }

  info(message: string): void {
    this.notificationSubject.next({ message, type: 'info' });
    setTimeout(() => this.clear(), 3000);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}
