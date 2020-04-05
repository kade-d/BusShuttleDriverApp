import { PreInspectionComponent } from './../pre-inspection/pre-inspection.component';
import { InspectionLog } from './../Models/inspectionLog';
import { InspectionService } from './../Services/inspection.service';
import { Component, OnInit } from '@angular/core';
import { Inspection } from './../Models/inspection-item';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { InspectionLogService } from './../Services/inspection-log.service';
import { ConnectionService } from 'ng-connection-service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-post-inspection',
  templateUrl: './post-inspection.component.html',
  styleUrls: ['./post-inspection.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])
  ]
})
export class PostInspectionComponent implements OnInit {
  allItems = [];
  postItems = [];
  endMileage = '';
  strItem = '';

  status = 'ONLINE';
  isConnected = true;
  errMessage = '';

  constructor(
    private inspecService: InspectionService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private inspectionService: InspectionLogService,
    private connectionService: ConnectionService
  ) { }


  ngOnInit() {
    this.postItems = this.inspectionService.postItems;
    /*
    this.inspecService.getDBItems()
    .subscribe(
      (jsonData: Inspection) => {
        // tslint:disable-next-line:forin We know this already works.
        for (const x in jsonData.data) {
          this.allItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
            jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));

            if (jsonData.data[x].post_trip_inspection === '1') {
              this.postItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }
        }
      }
    );
    */

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });



  }

  validateStartButton() {
    this.router.navigate(['/form']);
  }
  buttonState() {
    return !((this.postItems.every(_ => _.state)) && (this.endMileage !== ''));
  }

  onKey(event: any) { // without type info
    this.endMileage = event.target.value;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  submitLog(): void {
    

      if (this.status === 'OFFLINE') {
        this.errMessage = 'Oops! There is no internet connection.';
        //this.status = true;
      } else {

      JSON.parse(localStorage.getItem('inspectionLogs'));
      this.inspectionService.inspectionLog.endingHours = this.inspectionService.getTimeStamp();
      this.createString();
      this.inspectionService.inspectionLog.endingMileage = this.endMileage;

      const copy = { ...this.inspectionService.inspectionLog }; // Creating a copy of the member 'log'.
      this.inspectionService.storeLogsLocally(copy);

      const inspectionLog = this.inspectionService.inspectionToSend[1];
      this.inspectionService.store(inspectionLog)
              .subscribe((success) => {
              localStorage.setItem('inspectionLogs', JSON.stringify(this.inspectionService.inspectionLog ));
              });
      this.inspectionService.inspectionToSend = [];
      this.inspectionService.allItems = [];
      this.inspectionService.preItems = [];
      this.inspectionService.postItems = [];
      this.router.navigate(['/configure']);
      // Subscribing to the timer. If undo pressed, we unsubscribe.
      }


  }

  createString() {
    for (let i = 0 ;  i < this.postItems.length ; i++) {
      if ( i === this.postItems.length - 1 ) {
        this.strItem = this.strItem + '' + this.postItems[i].id;

      } else {
          this.strItem = this.strItem + '' + this.postItems[i].id + ',';
        }
      }
      this.inspectionService.inspectionLog.postInspection = this.strItem;
    }

}
