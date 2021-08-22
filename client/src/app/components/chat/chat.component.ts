import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChatmessageService } from 'src/app/services/chatmessage.service';
import ChatMessage from '../../models/ChatMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private eventsSubscription: Subscription = new Subscription();
  @Input() events: Observable<ChatMessage[]> = new Observable();
  room: string = '';
  page: number = 0;
  messages: ChatMessage[] = [];
  currMsg: string = '';

  constructor(
    private chatMsgService: ChatmessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.room = paramMap.get('id') || '';
      this.getMessages();
    });
    this.eventsSubscription = this.events.subscribe((newMessages) => {
      this.messages = [...newMessages, ...this.messages];
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getMessages(): void {
    this.chatMsgService
      .getChatMessages(this.room, this.page)
      .subscribe((msgs) => {
        this.messages = msgs;
      });
  }

  sendMessage(): void {
    this.chatMsgService
      .postChatMessage(this.room, this.currMsg)
      .subscribe((msg) => {
        this.messages.unshift(msg);
        this.currMsg = '';
      });
  }

  sendOnEnter(event: any) {
    this.sendMessage();
  }
}
