import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { getUsername } from 'src/app/utils/userUtils';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css'],
})
export class AuthViewComponent {
  public dataSubscription: Subscription = new Subscription();
  public component: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.dataSubscription = this.route.data.subscribe((data: any) => {
      this.component = data.component;
    });
    if (!getUsername()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
