import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  isLoading = false;

  private loginSub?: Subscription;
  private loadingSub?: Subscription;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.loadingService.loading$.subscribe(
      loading => this.isLoading = loading
    );
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.notificationService.error('Please enter email and password');
      return;
    }

    this.loadingService.show();

    this.loginSub = this.authService.login({ email: this.email, password: this.password })
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          // error already surfaced by AuthService → NotificationService
        }
      });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
