import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-unauth-header',
  templateUrl: './unauth-header.component.html',
  styleUrls: ['./unauth-header.component.css'],
})
export class UnauthHeaderComponent implements OnInit {
  maskIcon = faTheaterMasks;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToLanding() {
    this.router.navigate(['/']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
