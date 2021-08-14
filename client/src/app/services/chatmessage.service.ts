import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions } from './serviceHelper';
import ChatMessage from '../models/ChatMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatmessageService {
  private apiUrl = '/api/chat/message';

  constructor(private http: HttpClient) {}

  getChatMessages(roomId: string, page: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.apiUrl}/${roomId}?page=${page}`,
      httpOptions
    );
  }
}
