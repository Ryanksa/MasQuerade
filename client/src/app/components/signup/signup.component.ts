import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  name: string = "";
  username: string = "";
  password: string = "";

  constructor(
    private userSerivce: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleSignUp() {
    this.userSerivce.signup(this.name, this.username, this.password).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
