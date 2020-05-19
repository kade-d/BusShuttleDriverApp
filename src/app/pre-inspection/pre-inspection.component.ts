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
  strItem = '0';
  startMileage = '';
  checkMileage;
  selectedBus: Bus;
  selectedDriver: User;
  selectedLoop: Loop;

  errorMessageState = false;

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
    if (this.validateMileage()) {
      this.errorMessageState = true;
    } else {
      this.errorMessageState = false;
     }
  }

  ngOnInit() {
    this.preItems = this.inspectionService.preItems;
  }

  validateStartButton() {
      this.router.navigate(['/form']);
    }

    submitLog(): void {
      if (this.validateMileage()) {
          this.errorMessageState = true;
      } else {
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
  }

  validateMileage(): boolean {
    this.checkMileage = Number(this.startMileage);
    return isNaN(this.checkMileage);
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


