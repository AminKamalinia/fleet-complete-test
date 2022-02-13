import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public isChanged = false;

  constructor() { }

  ngOnInit(): void {
  }

  public googleApiHasChanged(isChanged: boolean): void {
    this.isChanged = isChanged;
  }
}
