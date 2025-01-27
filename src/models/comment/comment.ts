export interface CommentPayload {
    ticketId: number;
    supportId: number;
    message: string;
  }
  
  export interface CommentBoxProps {
    isSupport: boolean;
    ticketId: number;
    onAddMessage: (newMessage: { id: string; text: string }) => void;
    onDeleteMessage: (id: string) => void;
  }
  
  
  export interface Comment {
    id: number;
    ticketId: number;
    supportId: number;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }
  