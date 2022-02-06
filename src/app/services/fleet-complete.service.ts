import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
    return this.httpClient.get(`/getLastData?key=${this.key}&json`);
  }

  public getRawData(objectId: number, begTimestamp: string, endTimestamp: string): Observable<any> {
    return this.httpClient.get(`/getRawData?objectId=${objectId}&begTimestamp=${begTimestamp}&endTimestamp=${endTimestamp}&key=${this.key}&json`);
  }
}
