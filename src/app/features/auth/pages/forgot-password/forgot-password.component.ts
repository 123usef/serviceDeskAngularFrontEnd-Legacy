import { Component } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;

  constructor(private notificationService: NotificationService) { }

  onSubmit(): void {
    if (!this.email) {
      this.notificationService.error('Please enter your email');
      return;
    }
    // LEGACY: placeholder, no API endpoint for password reset
    this.submitted = true;
  }
}
