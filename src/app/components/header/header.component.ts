import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FleetCompleteService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public key: string;
  public googleApikey: string;
  public hasGoogleApi: boolean | null;
  @Output()
  private googleApiHasChanged: EventEmitter<boolean>;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.hasGoogleApi = false;
    this.key = '';
    this.googleApikey = '';
    this.googleApiHasChanged = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
  }

  public onClicked(): void {
    this.fleetCompleteService.setKey = this.key;
  }

  public onGoogleApiClicked(): void {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.googleApikey;
    const head = document.getElementsByTagName('head')[0];
    head.prepend(node);
    this.hasGoogleApi = null;
    setInterval(() => {
      this.hasGoogleApi = true;
      this.googleApiHasChanged.emit(true);
    }, 3000);
  }
}
