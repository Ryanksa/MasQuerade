import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ChatRoom from 'src/app/models/ChatRoom';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  nextPageIcon = faChevronRight;
  prevPageIcon = faChevronLeft;

  chatRooms: ChatRoom[] = [];
  page: number = 0;
  newRoomName: string = '';

  constructor(
    private chatRoomService: ChatroomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      this.chatRooms = rooms;
    });
  }

  handlePrevPage(): void {
    if (this.page <= 0) return;
    this.page -= 1;
    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      this.chatRooms = rooms;
    });
  }

  handleNextPage(): void {
    this.page += 1;
    this.chatRoomService.getMyChatRooms(this.page).subscribe((rooms) => {
      this.chatRooms = rooms;
    });
  }

  handleCreateRoom(): void {
    this.chatRoomService
      .createChatRoom(this.newRoomName)
      .subscribe((newRoom) => {
        this.chatRooms = [...this.chatRooms, newRoom];
      });
  }

  handleRoomClick(roomId: string): void {
    this.router.navigate([`/chat/${roomId}`]);
  }
}
