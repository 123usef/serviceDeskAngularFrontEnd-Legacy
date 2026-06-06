import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './pages/ticket-create/ticket-create.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { AssignedTicketsComponent } from './pages/assigned-tickets/assigned-tickets.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';

@NgModule({
  declarations: [
    TicketListComponent,
    TicketDetailComponent,
    TicketCreateComponent,
    MyTicketsComponent,
    AssignedTicketsComponent,
    TicketFormComponent,
    CommentListComponent,
    CommentFormComponent
  ],
  imports: [
    SharedModule,
    TicketsRoutingModule
  ]
})
export class TicketsModule { }
