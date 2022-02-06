import { Component, OnInit, Input } from '@angular/core';
import ChatMessage from '../../models/ChatMessage';
import { getUsername } from 'src/app/utils/userUtils';
import { getNumberOfLines } from 'src/app/utils/generalUtils';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: ChatMessage = {
    id: '',
    author: '',
    room: '',
    content: '',
    posted_on: '',
  };
  @Input() initAnimation: boolean = true;
  private lines: number = 1;
  public height: number = 45;
  public mine: boolean = false;
  public postedDate: string = '';
  public postedTime: string = '';
  userIcon = faUser;

  constructor() {}

  ngOnInit(): void {
    this.lines = getNumberOfLines(this.message.content);
    this.height = 50 + this.lines * 25;
    this.mine = this.message.author === getUsername();
    const postedOn = new Date(this.message.posted_on);
    this.postedDate = postedOn.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    this.postedTime = postedOn.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getOuterPolygonPoints(): string {
    if (this.mine) {
      return `350,40 340,23 330,30 322,24 325,0 0,10 0,${
        35 + this.lines * 25
      } 315,${40 + this.lines * 25} 318,45 328,48 341,36`;
    } else {
      return `5,55 25,38 35,42 45,35 48,5 350,0 340,${
        40 + this.lines * 25
      } 40,${35 + this.lines * 25} 43,55 35,57 25,52`;
    }
  }

  getInnerPolygonPoints(): string {
    if (this.mine) {
      return `350,40 340,25 330,33 318,24 320,5 5,15 9,${
        30 + this.lines * 25
      } 312,${35 + this.lines * 25} 315,40 328,45 341,35`;
    } else {
      return `5,55 25,40 35,45 50,35 52,10 340,5 335,${
        35 + this.lines * 25
      } 47,${30 + this.lines * 25} 48,50 35,55 25,50`;
    }
  }
}
