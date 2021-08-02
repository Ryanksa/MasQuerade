import { Component, OnInit } from '@angular/core';
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { getUsername } from 'src/app/utils/userUtils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  maskIcon = faTheaterMasks;
  
  constructor(
    private userSerivce: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!getUsername()) {
      this.router.navigate(['/login']);
    }
  }

  handleSignOut() {
    this.userSerivce.signout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
