import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private userSerivce: UserService, private router: Router) {}

  ngOnInit(): void {}

  handleSignIn() {
    this.userSerivce.signin(this.username, this.password).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
