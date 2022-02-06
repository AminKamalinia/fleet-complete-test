import { Component, OnInit } from '@angular/core';
import { FleetCompleteService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public key: string;

  constructor(private fleetCompleteService: FleetCompleteService) {
    this.key = 'home.assignment-699172';
  }

  ngOnInit(): void {
  }

  public onClicked(): void {
    this.fleetCompleteService.setKey = this.key;
  }
}
