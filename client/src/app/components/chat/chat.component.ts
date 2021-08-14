import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatmessageService } from 'src/app/services/chatmessage.service';
import ChatMessage from '../../models/ChatMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  room: string = '';
  page: number = 0;
  messages: ChatMessage[] = [];

  constructor(
    private chatMsgService: ChatmessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.room = paramMap.get('id') || '';
      this.chatMsgService
        .getChatMessages(this.room, this.page)
        .subscribe((msgs) => {
          this.messages = msgs.reverse();
        });
    });
  }
}
