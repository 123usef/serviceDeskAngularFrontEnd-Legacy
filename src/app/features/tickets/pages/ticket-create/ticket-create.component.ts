import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../../core/services/ticket.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ITicketCreate } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnDestroy {
  private createSub?: Subscription;

  constructor(
    private ticketService: TicketService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  onSubmit(data: ITicketCreate): void {
    this.loadingService.show();
    this.createSub = this.ticketService.createTicket(data)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(() => this.router.navigate(['/tickets']));
  }

  onCancel(): void {
    this.router.navigate(['/tickets']);
  }

  ngOnDestroy(): void {
    this.createSub?.unsubscribe();
  }
}
