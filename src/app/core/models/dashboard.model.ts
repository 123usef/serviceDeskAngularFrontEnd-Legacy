export interface IDashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  rejectedTickets: number;
  criticalTickets: number;
  averageResolutionTimeHours: number;
  [key: string]: number;
}
