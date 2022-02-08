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

  //#region Google map
  private markerCenter: google.maps.LatLngLiteral = { lat: 47.4073, lng: 7.76 };
  private mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    rotateControl: true,
    streetViewControl: true,
    zoomControl: true,
    fullscreenControl: true,
    mapTypeControl: true,
    zoom: 3,
    center: this.markerCenter
  }
  //#endregion

  public latestData: Array<any> = [];
  public detail: any = [];
  public selectedId?: number | null;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.selectedId = null;
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const map = new google.maps.Map(document.getElementById('map_driver') as HTMLElement, this.mapOptions);

    this.subscription = this.fleetCompleteService.keySubject.subscribe(() => {
      this.fleetCompleteService.getLastData().subscribe(result => {
        this.latestData = result.response;
        this.latestData.forEach(item => {
          new google.maps.Marker({
            position: {
              lat: item.latitude,
              lng: item.longitude
            },
            label: item.objectName,
            map: map
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
