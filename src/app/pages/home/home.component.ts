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

  public polygonCoords: Array<google.maps.LatLng> = [];
  public markerZoom = 12;
  public markerCirclePolygonZoom = 15;
  public markers: any = [];
  public markerCenter: google.maps.LatLngLiteral = { lat: 47.4073, lng: 7.76 };

  public latestData: Array<any> = [];
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
        this.latestData.forEach(item => {
          this.markerCenter = { lat: item.latitude, lng: item.longitude };
          this.markers.push({
            position: {
              lat: item.latitude,
              lng: item.longitude
            },
            options: {
              draggable: false
            },
            label: item.objectName
          });
        });
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
