import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ITicket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-recent-tickets',
  templateUrl: './recent-tickets.component.html',
  styleUrls: ['./recent-tickets.component.scss']
})
export class RecentTicketsComponent {
  @Input() tickets: ITicket[] = [];

  constructor(private router: Router) { }

  onRowClick(ticket: ITicket): void {
    this.router.navigate(['/tickets', ticket.id]);
  }
}
