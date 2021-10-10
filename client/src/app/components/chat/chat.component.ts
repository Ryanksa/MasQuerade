import { Component, OnInit, AfterViewInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChatmessageService } from 'src/app/services/chatmessage.service';
import ChatMessage from '../../models/ChatMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  private eventsSubscription: Subscription = new Subscription();
  @Input() events: Observable<ChatMessage[]> = new Observable();

  @ViewChildren('messages', { read: ElementRef })
  messagesRef!: QueryList<ElementRef>;
  observer!: IntersectionObserver;
  lastMessage!: Element;

  room: string = '';
  page: number = 0;
  messages: ChatMessage[] = [];
  latestMessages: ChatMessage[] = [];
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
      this.messages = [...this.latestMessages, ...this.messages];
      this.latestMessages = newMessages;
    });

    this.setupObserver();
  }

  ngAfterViewInit() {
    this.messagesRef.changes.subscribe((d) => {
      if (d.last) {
        this.observer.observe(d.last.nativeElement);
        this.lastMessage = d.last.nativeElement;
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getMessages(): void {
    this.chatMsgService
      .getChatMessages(this.room, this.page)
      .subscribe((msgs) => {
        this.messages = [...this.messages, ...msgs];
      });
  }

  sendMessage(): void {
    this.chatMsgService
      .postChatMessage(this.room, this.currMsg)
      .subscribe((msg) => {
        this.messages = [...this.latestMessages, ...this.messages];
        this.latestMessages = [msg];
        this.currMsg = '';
      });
  }

  sendOnEnter(event: any) {
    this.sendMessage();
  }

  setupObserver() {
    let options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === this.lastMessage && entry.isIntersecting) {
          observer.unobserve(this.lastMessage);
          this.page += 1;
          this.getMessages();
        }
      });
    }, options);
  }
}
