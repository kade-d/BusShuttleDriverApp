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
import { DropdownsService } from '../Services/dropdowns.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-pre-inspection',
  templateUrl: './pre-inspection.component.html',
  styleUrls: ['./pre-inspection.component.css']
})

export class PreInspectionComponent implements OnInit {

  allItems = [];
  preItems = [];
  //startMileage: string;
  strItem = '';
  startMileage = '';
  selectedBus: Bus;
  selectedDriver: User;
  selectedLoop: Loop;

  constructor(
    private router: Router,
    private inspecService: InspectionService,
    public dropdownsService: DropdownsService,
    public inspectionService: InspectionLogService ) {

      /*
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    */
    }

  buttonState() {
    return !((this.preItems.every(_ => _.state)) && (this.startMileage !== ''));
  }

  onKey(event: any) { // without type info
    this.startMileage = event.target.value;
  }

  ngOnInit() {
    this.preItems = this.inspectionService.preItems;
    
    /*
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
    */
  }

  validateStartButton() {
      this.router.navigate(['/form']);
    }

    submitLog(): void {
    this.inspectionService.inspectionLog.timestamp = this.inspectionService.getTimeStamp();
    this.inspectionService.inspectionLog.date = this.inspectionService.getDateStamp();
    this.inspectionService.inspectionLog.beginningHours = this.inspectionService.getTimeStamp();
    this.inspectionService.inspectionLog.driver = this.inspectionService.selectedDriver.id;
    this.inspectionService.inspectionLog.busNumber = this.inspectionService.selectedBus.id;
    this.inspectionService.inspectionLog.loop = this.inspectionService.selectedLoop.id;
    this.createString();
    this.inspectionService.inspectionLog.startingMileage = this.startMileage;

    const copy = { ...this.inspectionService.inspectionLog }; // Creating a copy of the member 'log'.
    this.inspectionService.storeLogsLocally(copy);

    this.router.navigate(['/form']);
    // Subscribing to the timer. If undo pressed, we unsubscribe.
  }

  createString() {
    for (let i = 0 ;  i < this.preItems.length ; i++) {
      if ( i === this.preItems.length - 1 ) {
        this.strItem = this.strItem + '' + this.preItems[i].id;

      } else {
          this.strItem = this.strItem + '' + this.preItems[i].id + ',';
        }
      }
      this.inspectionService.inspectionLog.preInspection = this.strItem;
    }

}


