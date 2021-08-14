import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions } from './serviceHelper';
import ChatRoom from '../models/ChatRoom';

@Injectable({
  providedIn: 'root',
})
export class ChatroomService {
  private apiUrl = '/api/chat/room';

  constructor(private http: HttpClient) {}

  getMyChatRooms(page: number): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(
      `${this.apiUrl}/list?page=${page}`,
      httpOptions
    );
  }

  createChatRoom(roomName: string): Observable<ChatRoom> {
    const createRoomRequestBody = { roomName };
    return this.http.post<ChatRoom>(
      `${this.apiUrl}/`,
      createRoomRequestBody,
      httpOptions
    );
  }
}
