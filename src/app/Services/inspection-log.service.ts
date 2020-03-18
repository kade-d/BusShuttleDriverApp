import { environment } from './../../environments/environment';
import { InspectionLog } from './../Models/inspectionLog';
import { Inspection } from './../Models/inspection-item';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, BehaviorSubject } from 'rxjs';
import { Bus } from '../Models/bus';
import { User } from '../Models/user';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';



@Injectable({
  providedIn: 'root'
})
export class InspectionLogService {

  inspectionToSend: InspectionLog[] = [];


  selectedBus: Bus;
  selectedDriver: User;
  selectedLoop: Loop;


  constructor(private http: HttpClient) {
    const inspectionLogs: InspectionLog[] = JSON.parse(localStorage.getItem('inspectionLogs'));
  }

  storeLogsLocally(inspectionLog: InspectionLog) {
    this.inspectionToSend.push(inspectionLog);
    localStorage.setItem('inspectionLogs', JSON.stringify(this.inspectionToSend));
  }

  store(inspectionLog: InspectionLog): Observable<InspectionLog> {
    return this.http.post<InspectionLog>(environment.BASE_API_URL + '/storeInspection.php', { data: inspectionLog });
}

pad(n: any) { // function for adding leading zeros to dates/times
  return n < 10 ? '0' + n : n;
}

getTimeStamp(): string {
  const date = new Date();
  const timestamp = (date.getFullYear() + '/'
    + this.pad((date.getMonth()) + 1) + '/'
    + this.pad(date.getDate()) + ' '
    + this.pad(date.getHours()) + ':'
    + this.pad(date.getMinutes()) + ':'
    + this.pad(date.getSeconds()));
  return timestamp;
}

getDateStamp(): string {
  const date = new Date();
  const datestamp =(date.getFullYear() + '/'
    + this.pad((date.getMonth()) + 1) + '/'
    + this.pad(date.getDate()) + ' ');
  return datestamp;
}

getHourStamp(): string {
  const date = new Date();
  const hourstamp = this.pad(date.getHours()) + ':'
    + this.pad(date.getMinutes()) + ':'
    + this.pad(date.getSeconds());
  return hourstamp;
}

}
