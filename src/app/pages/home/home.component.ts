import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FleetCompleteService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {

    this.subscription = this.fleetCompleteService.keySubject.subscribe(() => {
      this.fleetCompleteService.getLastData().subscribe(result => {

      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
