import { Component, OnInit } from '@angular/core';
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  maskIcon = faTheaterMasks;

  constructor(private userSerivce: UserService, private router: Router) {}

  ngOnInit(): void {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToChats() {
    this.router.navigate(['/chats']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  handleSignOut() {
    this.userSerivce.signout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
