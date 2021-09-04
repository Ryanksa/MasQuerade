import { Component, OnInit, Input } from '@angular/core';
import ChatMessage from '../../models/ChatMessage';
import { getNumberOfLines } from 'src/app/utils/generalUtils';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css'],
})
export class NewMessageComponent implements OnInit {
  @Input() message: ChatMessage = {
    id: "",
    author: "",
    room: "",
    content: "",
    posted_on: "",
  };
  private lines: number = 1;
  public height: number = 45;
  userIcon = faUser;

  constructor() {}

  ngOnInit(): void {
    this.lines = getNumberOfLines(this.message.content);
    this.height = 50 + this.lines * 25;
  }

  getOuterPolygonPoints(): string {
    return `350,40 340,23 330,30 322,24 325,0 0,10 0,${35 + this.lines * 25} 315,${40 + this.lines * 25} 318,45 328,48 341,36`;     
  }

  getInnerPolygonPoints(): string {
    return `350,40 340,25 330,33 318,24 320,5 5,15 9,${30 + this.lines * 25} 312,${35 + this.lines * 25} 315,40 328,45 341,35`;
  }
}
