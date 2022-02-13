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
  private directionsDisplay: google.maps.DirectionsRenderer;
  private markerCenter: google.maps.LatLngLiteral = { lat: 47.4073, lng: 7.76 };
  private mapOptions: google.maps.MapOptions;
  //#endregion

  public latestData: Array<any> = [];
  public detail: Array<any> = [];
  public selectedId?: number | null;
  public totalDistance: number;
  public numberOfStops: number;
  public shortestPossibleDistance: number;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.selectedId = null;
    this.subscription = new Subscription();
    this.selected = {
      startDate: moment.utc(moment.now()).local().subtract(1, 'days'),
      endDate: moment.utc(moment.now()).local()
    };
    this.mapOptions = {
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
    this.map = null;
    this.vehiclePath = new google.maps.Polyline();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: '#0000ff',
        strokeOpacity: 0.3,
        strokeWeight: 3
      }
    });
    this.totalDistance = 0;
    this.numberOfStops = 0;
    this.shortestPossibleDistance = 0;
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
      this.directionsDisplay.setMap(null);

      this.fleetCompleteService.getRawData(
        this.selectedId ?? 0,
        moment.utc(this.selected.startDate).local().format('YYYY-MM-DD'),
        moment.utc(this.selected.endDate).local().format('YYYY-MM-DD')).subscribe(result => {
          this.detail = result.response;

          this.totalDistance = 0;
          this.shortestPossibleDistance = 0;
          let pathCoordinates: Array<google.maps.LatLng> = [];
          const waypoints = new Array<google.maps.DirectionsWaypoint>();
          let origin: any = null;
          let destination = new google.maps.LatLng(0, 0);
          let tempEngineStatus = false;

          this.detail.forEach(item => {
            const latLng = new google.maps.LatLng(item.Latitude, item.Longitude);
            destination = latLng;
            if (item.EngineStatus === true) {
              tempEngineStatus = true;
            }
            if (origin == null) {
              origin = latLng;
              tempEngineStatus = false;
            }
            else if (item.EngineStatus === false && tempEngineStatus === true) {
              tempEngineStatus = false;
              waypoints.push({
                location: latLng,
                stopover: true
              });
            }
            pathCoordinates.push(latLng);
          });
          this.numberOfStops = waypoints.length;

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

          const temp = this.vehiclePath.getPath();
          let tempDistance = 0;
          for (let i = 0; i < temp.getLength() - 2; i++) {
            tempDistance += google.maps.geometry.spherical.computeDistanceBetween(temp.getAt(i), temp.getAt(i + 1));
          }
          this.totalDistance = (tempDistance / 1000);

          if (waypoints.length > 0) {
            const directionsService = new google.maps.DirectionsService();
            const request: google.maps.DirectionsRequest = {
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: true,
              waypoints: waypoints,
              optimizeWaypoints: true
            };

            this.directionsDisplay.setMap(this.map);

            directionsService.route(request, (response: any, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
                response.routes[0].legs.forEach((item: any) => {
                  this.shortestPossibleDistance += item.distance.value;
                });
              }
              this.shortestPossibleDistance = this.shortestPossibleDistance / 1000;
            });
          }
        });
    } else {
      alert('Please select a row from top data grid.');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
