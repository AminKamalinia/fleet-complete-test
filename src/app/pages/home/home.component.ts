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
    this.selected = {
      startDate: moment.utc(moment.now()).local().subtract(1, 'days'),
      endDate: moment.utc(moment.now()).local()
    };
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

  public onRowClicked(objectId: number): void {
    this.selectedId = objectId;
  }

  public showDetail(): void {
    if (this.selectedId !== null && this.selectedId !== undefined) {
      this.fleetCompleteService.getRawData(
        this.selectedId ?? 0,
        moment.utc(this.selected.startDate).local().format('YYYY-MM-DD'),
        moment.utc(this.selected.endDate).local().format('YYYY-MM-DD')).subscribe(result => {
          this.detail = result.response;
        });
    } else {
      alert('Please select a row from top table');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
