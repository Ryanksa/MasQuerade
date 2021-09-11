import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPlusCircle,
  faChevronRight,
  faChevronLeft,
  faLevelUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import ChatRoom from 'src/app/models/ChatRoom';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { getUsername } from 'src/app/utils/userUtils';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  addRoomIcon = faPlusCircle;
  nextPageIcon = faChevronRight;
  prevPageIcon = faChevronLeft;
  pointToAddIcon = faLevelUpAlt;

  chatRooms: ChatRoom[] = [];
  page: number = 0;
  newRoomName: string = '';
  isLastPage: boolean = true;
  isInputOpen: boolean = false;
  isLoading: boolean = true;

  constructor(
    private chatRoomService: ChatroomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cachedPage = localStorage.getItem(getUsername() + '-chatlist-page');
    if (cachedPage) {
      this.page = +cachedPage;
    }

    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      if (rooms.length === 11) {
        this.isLastPage = false;
        this.chatRooms = rooms.slice(0, -1);
      } else {
        this.isLastPage = true;
        this.chatRooms = rooms;
      }
      this.isLoading = false;
    });
  }

  handlePrevPage(): void {
    if (this.page <= 0) return;
    this.page -= 1;
    localStorage.setItem(getUsername() + '-chatlist-page', '' + this.page);
    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      if (rooms.length === 11) {
        this.isLastPage = false;
        this.chatRooms = rooms.slice(0, -1);
      } else {
        this.isLastPage = true;
        this.chatRooms = rooms;
      }
    });
  }

  handleNextPage(): void {
    this.page += 1;
    localStorage.setItem(getUsername() + '-chatlist-page', '' + this.page);
    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      if (rooms.length === 11) {
        this.isLastPage = false;
        this.chatRooms = rooms.slice(0, -1);
      } else {
        this.isLastPage = true;
        this.chatRooms = rooms;
      }
    });
  }

  handleCreateRoom(): void {
    this.chatRoomService
      .createChatRoom(this.newRoomName)
      .subscribe((newRoom) => {
        this.chatRooms = [...this.chatRooms, newRoom];
        this.closeNewRoomInput();
      });
  }

  handleRoomClick(roomId: string): void {
    this.router.navigate([`/chat/${roomId}`]);
  }

  openNewRoomInput() {
    this.isInputOpen = true;
  }

  closeNewRoomInput() {
    this.isInputOpen = false;
    this.newRoomName = '';
  }
}
