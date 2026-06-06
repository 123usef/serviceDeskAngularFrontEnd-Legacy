import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './pages/ticket-create/ticket-create.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { AssignedTicketsComponent } from './pages/assigned-tickets/assigned-tickets.component';

const routes: Routes = [
  { path: '', component: TicketListComponent },
  { path: 'create', component: TicketCreateComponent },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'assigned', component: AssignedTicketsComponent },
  { path: ':id', component: TicketDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
