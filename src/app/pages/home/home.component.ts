import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FleetCompleteService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public selected: { startDate: moment.Moment, endDate: moment.Moment };
  //#region Google map
  private map: any;
  private vehiclePath: google.maps.Polyline;
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
  public detail: Array<any> = [];
  public selectedId?: number | null;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.selectedId = null;
    this.subscription = new Subscription();
    this.selected = {
      startDate: moment.utc(moment.now()).local().subtract(1, 'days'),
      endDate: moment.utc(moment.now()).local()
    };
    this.map = null;
    this.vehiclePath = new google.maps.Polyline();
  }

  ngOnInit(): void {
    this.map = new google.maps.Map(document.getElementById('map_driver') as HTMLElement, this.mapOptions);

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
            map: this.map
          });
        });
      });
    });
  }

  public onRowClicked(objectId: number): void {
    this.selectedId = objectId;
  }

  public showDetail(): void {
    if (this.selectedId !== null && this.selectedId !== undefined) {
      this.vehiclePath.setMap(null);
      this.fleetCompleteService.getRawData(
        this.selectedId ?? 0,
        moment.utc(this.selected.startDate).local().format('YYYY-MM-DD'),
        moment.utc(this.selected.endDate).local().format('YYYY-MM-DD')).subscribe(result => {
          this.detail = result.response;
          let pathCoordinates: Array<google.maps.LatLng> = [];
          this.detail.forEach(item => {
            pathCoordinates.push(new google.maps.LatLng(item.Latitude, item.Longitude));
          });

          this.vehiclePath = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [{
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: '',
                fillOpacity: 1,
                scale: 3,
              },
              repeat: '100px'
            }]
          });

          this.vehiclePath.setMap(this.map);
        });
    } else {
      alert('Please select a row from top table');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
