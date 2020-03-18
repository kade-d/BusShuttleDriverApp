import { InspectionLog } from './../Models/inspectionLog';
import { InspectionLogService } from './../Services/inspection-log.service';
import { Inspection } from './../Models/inspection-item';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from './../Services/inspection.service';
import { Bus } from '../Models/bus';
import { User } from '../Models/user';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-pre-inspection',
  templateUrl: './pre-inspection.component.html',
  styleUrls: ['./pre-inspection.component.css']
})
export class PreInspectionComponent implements OnInit {

  allItems = [];
  preItems = [];
  startMileage: string;
  inspectionLog = new InspectionLog('', '', '', '', '', '', '', '', '', '', '', '');

  constructor(
    private router: Router,
    private inspecService: InspectionService,
    private inspectionService: InspectionLogService ) {}

  buttonState() {
    return !this.preItems.every(_ => _.state);
  }

  ngOnInit() {
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
        }
      }
    );
  }

  validateStartButton() {
      this.router.navigate(['/form']);
    }

    submitLog(): void {
    this.inspectionLog.timestamp = this.inspectionService.getTimeStamp();
    this.inspectionLog.date = this.inspectionService.getDateStamp();
    this.inspectionLog.begining = this.inspectionService.getHourStamp();
    this.inspectionLog.driver = this.inspectionService.selectedDriver.id;
    this.inspectionLog.busNumber = this.inspectionService.selectedBus.id;
    this.inspectionLog.loop = this.inspectionService.selectedLoop.id;
    this.createString();
    this.inspectionLog.startMileage = this.startMileage;
    const copy = { ...this.inspectionLog }; // Creating a copy of the member 'log'.
    this.inspectionService.storeLogsLocally(copy);

    // Subscribing to the timer. If undo pressed, we unsubscribe.
  }

  createString() {
    for (const item of this.preItems) {
        this.inspectionLog.pre = '' + item.id + ',';
    }
    }

}


