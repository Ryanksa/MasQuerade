import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { getUsername } from 'src/app/utils/userUtils';

@Component({
  selector: 'app-unauth-view',
  templateUrl: './unauth-view.component.html',
  styleUrls: ['./unauth-view.component.css']
})
export class UnauthViewComponent {
  public dataSubscription: Subscription = new Subscription();
  public component: string = "";

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    if (getUsername()) {
      this.router.navigate(['/home']);
    }
    this.dataSubscription = this.route.data.subscribe((data: any) => {
      this.component = data.component;
    });
  }

  ngOnDestroy():void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
