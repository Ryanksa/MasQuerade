import { Component, OnInit } from '@angular/core';
import Message from '../../models/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];

  constructor() { }

  ngOnInit(): void {
    this.messages = [
      {
        id: "ogj2pjmrpi3jg",
        author: "Ryan",
        chat: "89350935",
        content:
          "hello, hows it going there Bob",
        date: 1621692585520,
      },
      {
        id: "dfjgpifjdsklfds",
        author: "Bob",
        chat: "89350935",
        content: "hi Ryan, whats up?",
        date: 1621692785520,
      },
      {
        id: "fjdhnsfufdlskjhg",
        author: "Ryan",
        chat: "89350935",
        content: "nothing much, just wanted to msg u to test out my new app!",
        date: 1621692786520,
      },
      {
        id: "jfdiwhgkujwngbjwk",
        author: "Bob",
        chat: "89350935",
        content: "Link me ur new app pls, I want to check it out too",
        date: 1621692585620,
      },
    ];
  }

}
