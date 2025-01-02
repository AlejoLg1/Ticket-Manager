interface CommentBoxProps {
  isSupport: boolean;
  ticketId: number;
  onAddMessage: (newMessage: { id: string; text: string }) => void;
  onDeleteMessage: (id: string) => void;
}