import { Component, OnInit, Input } from '@angular/core';
import Message from '../../models/Message';

const getNumberOfLines = (text: string): number => {
  const words = text.split(' ');
  let word: string;
  let currLineChars = 0;
  let numLines = 1;
  for (word of words) {
    // a line can fit at most 35 chars or so
    if (currLineChars + word.length > 35) {
      numLines++;
      if (word.length > 35 && currLineChars > 0) numLines++;
      currLineChars = word.length > 35 ? 0 : word.length + 1;
    } else {
      currLineChars += word.length + 1;
    }
  }
  return numLines;
};

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message = {
    id: '',
    chat: '',
    author: '',
    content: '',
    date: new Date().getTime(),
  };
  private lines: number = 1;
  public height: number = 45;
  public mine: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.lines = getNumberOfLines(this.message.content);
    this.height = 50 + this.lines * 25;
    this.mine = this.message.author === 'Ryan';
  }

  getOuterPolygonPoints(): string {
    if (this.mine) {
      return `350,40 340,23 330,30 322,24 325,0 0,10 0,${45 + this.lines * 25} 315,${50 + this.lines * 25} 318,45 328,48 341,36`;     
    } else {
      return `5,55 25,38 35,42 45,35 50,5 350,0 340,${50 + this.lines * 25} 42,${45 + this.lines * 25} 43,55 35,57 25,52`;
    }
  }

  getInnerPolygonPoints(): string {
    if (this.mine) {
      return `350,40 340,25 330,33 318,24 320,5 7,15 5,${40 + this.lines * 25} 312,${45 + this.lines * 25} 315,40 328,45 341,35`;
    } else {
      return `5,55 25,40 35,45 50,35 53,10 340,5 335,${45 + this.lines * 25} 45,${40 + this.lines * 25} 48,50 35,55 25,50`;
    }
  }
}
