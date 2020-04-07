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
import { InspectionService } from './../Services/inspection.service';


@Injectable({
  providedIn: 'root'
})
export class InspectionLogService {

  inspectionToSend: InspectionLog[] = [];
  allItems = [];
  preItems = [];
  postItems = [];

  selectedBus: Bus;
  selectedDriver: User;
  selectedLoop: Loop;
  
  inspectionLog = new InspectionLog('', '', '', '', '', '', '', '', '', '', '');

  constructor(private http: HttpClient, private inspecService: InspectionService) {
    const inspectionLogs: InspectionLog[] = JSON.parse(localStorage.getItem('inspectionLogs'));
  }

  storeLogsLocally(inspectionLog: InspectionLog) {
    this.inspectionToSend.push(inspectionLog);
    localStorage.setItem('inspectionLogs', JSON.stringify(this.inspectionToSend));
  }

  /*
  laodInspectionItems() {
    this.inspecService.getDBItems()
    .subscribe(
      (jsonData: Inspection) => {
        // tslint:disable-next-line:forin We know this already works.
        for (const x in jsonData.data) {
          this.allItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
            jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));

            if (jsonData.data[x].pre_trip_inspection === '1') {
              this.preItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }

            if (jsonData.data[x].post_trip_inspection === '1') {
              this.postItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }
        }
      }
    );
  }
*/

  store(inspectionLog: InspectionLog): Observable<InspectionLog> {
    return this.http.post<InspectionLog>(environment.BASE_API_URL + '/storeInspection.php', { data: inspectionLog });
}

postEndHour(){
  this.inspectionLog.endingHours = this.getTimeStamp();
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
