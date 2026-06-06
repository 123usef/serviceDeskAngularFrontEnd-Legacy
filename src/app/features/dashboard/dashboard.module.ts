import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { RecentTicketsComponent } from './components/recent-tickets/recent-tickets.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    StatsCardComponent,
    RecentTicketsComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
