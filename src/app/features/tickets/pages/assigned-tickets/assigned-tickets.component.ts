import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../../core/services/ticket.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ITicket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-assigned-tickets',
  templateUrl: './assigned-tickets.component.html',
  styleUrls: ['./assigned-tickets.component.scss']
})
export class AssignedTicketsComponent implements OnInit, OnDestroy {
  tickets: ITicket[] = [];
  currentPage = 1;
  pageSize = 10;

  private ticketsSub?: Subscription;

  constructor(
    private ticketService: TicketService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loadingService.show();
    this.ticketsSub?.unsubscribe();
    this.ticketsSub = this.ticketService.getAssignedTickets(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(tickets => this.tickets = tickets);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTickets();
  }

  onRowClick(ticket: ITicket): void {
    this.router.navigate(['/tickets', ticket.id]);
  }

  ngOnDestroy(): void {
    this.ticketsSub?.unsubscribe();
  }
}
