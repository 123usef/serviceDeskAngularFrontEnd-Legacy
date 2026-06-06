import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { IDashboardStats } from '../../../../core/models/dashboard.model';
import { ITicket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  stats: IDashboardStats | null = null;
  recentTickets: ITicket[] = [];

  statCards: { title: string; value: number | string; color: string }[] = [];

  private statsSub?: Subscription;
  private ticketsSub?: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private ticketService: TicketService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentTickets();
  }

  loadStats(): void {
    this.loadingService.show();
    this.statsSub = this.dashboardService.getStats()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(stats => {
        this.stats = stats;
        this.buildStatCards(stats);
      });
  }

  loadRecentTickets(): void {
    this.ticketsSub = this.ticketService.getTickets({ page: 1, pageSize: 5 })
      .subscribe(tickets => this.recentTickets = tickets);
  }

  private buildStatCards(stats: IDashboardStats): void {
    this.statCards = [
      { title: 'Total Tickets', value: stats.totalTickets ?? 0, color: '#1a73e8' },
      { title: 'Open', value: stats.openTickets ?? 0, color: '#3b82f6' },
      { title: 'In Progress', value: stats.inProgressTickets ?? 0, color: '#f59e0b' },
      { title: 'Resolved', value: stats.resolvedTickets ?? 0, color: '#10b981' },
      { title: 'Closed', value: stats.closedTickets ?? 0, color: '#6b7280' },
      { title: 'Rejected', value: stats.rejectedTickets ?? 0, color: '#ef4444' },
      { title: 'Critical', value: stats.criticalTickets ?? 0, color: '#dc2626' },
      { title: 'Avg Resolution (hrs)', value: stats.averageResolutionTimeHours != null ? stats.averageResolutionTimeHours.toFixed(1) : '—', color: '#8b5cf6' }
    ];
  }

  ngOnDestroy(): void {
    this.statsSub?.unsubscribe();
    this.ticketsSub?.unsubscribe();
  }
}
