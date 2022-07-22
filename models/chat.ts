export interface ChatRoom {
  id: string;
  room: string;
  lastActive: Date;
  seenLatest?: boolean;
}

export interface ChatMessage {
  id: string;
  username: string;
  name: string;
  roomId: string;
  room: string;
  content: string;
  postedOn: Date;
}
