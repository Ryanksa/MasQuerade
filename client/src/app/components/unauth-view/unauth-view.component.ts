import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unauth-view',
  templateUrl: './unauth-view.component.html',
  styleUrls: ['./unauth-view.component.css']
})
export class UnauthViewComponent {
  public dataSubscription: Subscription = new Subscription();
  public component: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
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
