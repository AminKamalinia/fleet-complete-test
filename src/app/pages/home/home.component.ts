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

  public latestData: any = [];
  public detail: any = [];
  public selectedId?: number | null;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.selectedId = null;
    this.subscription = new Subscription();
  }

  ngOnInit(): void {

    this.subscription = this.fleetCompleteService.keySubject.subscribe(() => {
      this.fleetCompleteService.getLastData().subscribe(result => {
        this.latestData = result.response;
      });
    });
  }

  public showDetail(objectId: number): void {
    this.selectedId = objectId;
    this.fleetCompleteService.getRawData(objectId, '', '').subscribe(result => {
      this.detail = result.response;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
