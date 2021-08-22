import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { getUsername } from 'src/app/utils/userUtils';
import { ChatmessageService } from 'src/app/services/chatmessage.service';
import ChatMessage from 'src/app/models/ChatMessage';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css'],
})
export class AuthViewComponent {
  public dataSubscription: Subscription = new Subscription();
  public component: string = '';
  currRoom: string = '';
  newMessages: ChatMessage[] = [];
  eventsSubject: Subject<ChatMessage[]> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatMsgService: ChatmessageService
  ) {}

  ngOnInit(): void {
    if (!getUsername()) {
      this.router.navigate(['/login']);
    }
    this.dataSubscription = this.route.data.subscribe((data: any) => {
      this.component = data.component;
    });
    this.currRoom = window.location.href.split("/").slice(-1)[0];
    this.listenForChatMessages();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  listenForChatMessages(): void {
    this.chatMsgService.listenForNewMessages().subscribe((msgs) => {
      const newMessagesOut = [];
      const newMessagesIn = [];
      for (const msg of msgs) {
        if (msg.room !== this.currRoom) {
          newMessagesOut.push(msg);
        } else {
          newMessagesIn.push(msg);
        }
      }

      this.newMessages = newMessagesOut;
      setTimeout(() => {
        this.newMessages = this.newMessages.filter((msg) => !msgs.includes(msg));
      }, 3000);

      if (newMessagesIn.length > 0) {
        this.eventsSubject.next(newMessagesIn);
      }

      this.listenForChatMessages();
    });
  }
}
