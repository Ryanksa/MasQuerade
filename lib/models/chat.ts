export type ChatRoom = {
  id: string;
  room: string;
  lastActive: string;
  seenLatest?: boolean;
};

export type ChatMessage = {
  id: string;
  username: string;
  name: string;
  roomId: string;
  content: string;
  postedOn: string;
};
