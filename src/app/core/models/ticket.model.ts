import { IComment } from './comment.model';

export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
  Rejected = 4
}

export enum TicketPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface ITicket {
  id: number;
  referenceNumber: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  categoryName: string;
  categoryNameAr: string;
  createdByName: string;
  assignedToName?: string;
  departmentName: string;
  departmentNameAr: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionNotes?: string;
  commentCount: number;
}

export interface ITicketDetail extends ITicket {
  comments: IComment[];
}

export interface ITicketCreate {
  title: string;
  description: string;
  categoryId: number;
  priority: TicketPriority;
  departmentId?: number;
}

export interface ITicketUpdate {
  title: string;
  description: string;
  categoryId: number;
  priority: TicketPriority;
}
