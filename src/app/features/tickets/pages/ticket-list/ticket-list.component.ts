import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TicketService, TicketFilter } from '../../../../core/services/ticket.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ITicket } from '../../../../core/models/ticket.model';
import { ICategory } from '../../../../core/models/category.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, OnDestroy {
  tickets: ITicket[] = [];
  categories: ICategory[] = [];

  filterStatus: number | null = null;
  filterPriority: number | null = null;
  filterCategoryId: number | null = null;
  filterSearch = '';

  private ticketsSub?: Subscription;
  private categoriesSub?: Subscription;

  constructor(
    private ticketService: TicketService,
    private lookupService: LookupService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTickets();
  }

  loadCategories(): void {
    this.categoriesSub = this.lookupService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  loadTickets(): void {
    const filter: TicketFilter = {};
    if (this.filterStatus !== null) {
      filter.status = this.filterStatus;
    }
    if (this.filterPriority !== null) {
      filter.priority = this.filterPriority;
    }
    if (this.filterCategoryId !== null) {
      filter.categoryId = this.filterCategoryId;
    }
    if (this.filterSearch) {
      filter.search = this.filterSearch;
    }

    this.loadingService.show();
    this.ticketsSub?.unsubscribe();
    this.ticketsSub = this.ticketService.getTickets(filter)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(tickets => this.tickets = tickets);
  }

  onFilterChange(): void {
    this.loadTickets();
  }

  clearFilters(): void {
    this.filterStatus = null;
    this.filterPriority = null;
    this.filterCategoryId = null;
    this.filterSearch = '';
    this.loadTickets();
  }

  onRowClick(ticket: ITicket): void {
    this.router.navigate(['/tickets', ticket.id]);
  }

  ngOnDestroy(): void {
    this.ticketsSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
  }
}
