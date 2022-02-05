import { Component, OnInit, Input } from '@angular/core';

interface MasquerChar {
  char: string;
  class: string;
  flip: boolean;
  fontSize: string;
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

@Component({
  selector: 'app-masquer-text',
  templateUrl: './masquer-text.component.html',
  styleUrls: ['./masquer-text.component.css'],
})
export class MasquerTextComponent implements OnInit {
  @Input() text: string = '';
  @Input() flipIndices: number[] = [];
  @Input() leftFontSize: number = 48;
  @Input() fontSizeStep: number = 0;
  @Input() transform: string = '';
  @Input() transformOrigin: string = '';
  @Input() hoverInvert: boolean = false;
  @Input() hoverBackdrop: boolean = false;
  public charArray: MasquerChar[] = [];

  constructor() {}

  ngOnInit(): void {
    this.charArray = this.text.split('').map((c, idx) => {
      return {
        char: c,
        class: 'masquer-char-span' + getRandomInt(10),
        flip: this.flipIndices.includes(idx),
        fontSize: this.leftFontSize + idx * this.fontSizeStep + 'px',
      };
    });
  }
}
