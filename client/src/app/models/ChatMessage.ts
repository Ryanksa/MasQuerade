export default interface ChatMessage {
  id: string;
  author: string;
  room: string;
  content: string;
  posted_on: string;
}