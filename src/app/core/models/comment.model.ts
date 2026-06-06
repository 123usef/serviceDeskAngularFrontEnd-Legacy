export interface IComment {
  id: number;
  ticketId: number;
  content: string;
  createdByName: string;
  createdAt: string;
}

export interface ICommentCreate {
  content: string;
}
