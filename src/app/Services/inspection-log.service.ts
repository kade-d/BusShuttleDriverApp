import { environment } from './../../environments/environment';
import { InspectionLog } from './../Models/inspectionLog';
import { Inspection } from './../Models/inspection-item';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError, timer, BehaviorSubject } from 'rxjs';
import { Bus } from '../Models/bus';
import { User } from '../Models/user';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';
import { InspectionService } from './../Services/inspection.service';
import {Driver} from '../Models/driver';


@Injectable({
  providedIn: 'root'
})
export class InspectionLogService {

  currentUser = <User> JSON.parse(localStorage.getItem('currentUser'));

  options = {
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.currentUser.token),
  };

  inspectionToSend: InspectionLog[] = [];
  allItems = [];
  preItems = [];
  postItems = [];

  selectedBus: Bus;
  selectedDriver: Driver;
  selectedLoop: Loop;

  inspectionLog = new InspectionLog('', '', '', '', '', '', '', '', '', '', '');

  constructor(private http: HttpClient, private inspecService: InspectionService) {
    const inspectionLogs: InspectionLog[] = JSON.parse(localStorage.getItem('inspectionLogs'));
  }

  storeLogsLocally(inspectionLog: InspectionLog) {
    this.inspectionToSend.push(inspectionLog);
    localStorage.setItem('inspectionLogs', JSON.stringify(this.inspectionToSend));
  }

  store(inspectionLog: InspectionLog): Observable<InspectionLog> {

    const body = {
      data: {
        'driver_id': inspectionLog.driver,
        'loop_id': inspectionLog.loop,
        'bus_id': inspectionLog.busNumber,
        't_stamp': inspectionLog.timestamp,
        'date_added': inspectionLog.date,
        'beginning_hours': inspectionLog.beginningHours,
        'ending_hours': inspectionLog.endingHours,
        'starting_mileage': inspectionLog.startingMileage,
        'ending_mileage': inspectionLog.endingMileage,
        'pre_trip_inspection': inspectionLog.preInspection,
        'post_trip_inspection': inspectionLog.postInspection
      }
    };

    return this.http.post<InspectionLog>(environment.BASE_API_URL + '/api/inspections', body, this.options);
}

postEndHour() {
  this.inspectionLog.endingHours = this.getTimeStamp();
}

pad(n: any) { // function for adding leading zeros to dates/times
  return n < 10 ? '0' + n : n;
}

getTimeStamp(): string {
  const date = new Date();
  const timestamp = (date.getFullYear() + '-'
    + this.pad((date.getMonth()) + 1) + '-'
    + this.pad(date.getDate()) + ' '
    + this.pad(date.getHours()) + ':'
    + this.pad(date.getMinutes()) + ':'
    + this.pad(date.getSeconds()));
  return timestamp;
}

getDateStamp(): string {
  const date = new Date();
  const datestamp = (date.getFullYear() + '/'
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
