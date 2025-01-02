export interface CommentPayload {
    ticketId: number;
    supportId: number;
    message: string;
  }
  
  export interface Comment {
    id: number;
    ticketId: number;
    supportId: number;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }
  