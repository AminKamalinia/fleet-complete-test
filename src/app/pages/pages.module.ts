import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { FleetCompleteService } from '../services';
import { HeaderComponent } from '../components';
import { DateConverterPipe } from '../pipes';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    PagesRoutingModule,
  ],
  declarations: [
    HomeComponent,
    MainComponent,
    HeaderComponent,
    DateConverterPipe
  ],
  providers: [
    FleetCompleteService
  ]
})
export class PagesModule {

}
