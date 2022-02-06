import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FleetCompleteService {

  private key: string;
  public keySubject: Subject<void>;

  constructor(private httpClient: HttpClient) {
    this.keySubject = new Subject<void>();
    this.key = '';
  }

  set setKey(key: string) {
    this.key = key;
    this.keySubject.next();
  }

  public getLastData(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}getLastData?key=${this.key}`);
  }

  public getLatest(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}getRawData?objectId=187286&begTimestamp=2019-09-30&endTimestamp=2019-10-01&key=${this.key}`);
  }
}
