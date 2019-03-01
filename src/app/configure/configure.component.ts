import { Component, OnInit } from '@angular/core';
import { LogService } from '../Services/log.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { versionEnvironment } from 'src/environments/environment.prod';
import { DropdownsService } from '../Services/dropdowns.service';
import { Bus } from '../Models/bus';
import { User } from '../Models/user';
import { Loop } from '../Models/loop';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),
        transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class ConfigureComponent implements OnInit {
  syncingMessage: string;
  syncingCount: number;
  didStartSync: boolean;
  version: string = versionEnvironment.version;
  busDropdown = [];
  driverDropdown = [];
  loopsDropdown = [];
  errorMessage = '';
  selectedBus: string;
  selectedDriver: string;
  selectedLoop: string;

  constructor(public logService: LogService, public dropdownsService: DropdownsService) {
   }

  ngOnInit() {
    this.logService.currentSyncMessage.subscribe(passedMessage => this.syncingMessage = passedMessage);
    this.logService.currentSyncCount.subscribe(passedCount => this.syncingCount = passedCount);
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    this.populateBusDropdown();
    this.populateDriversDropdown();
    this.populateLoopsDropdown();
  }

displayConfirmation() {
  this.didStartSync = true;
  this.logService.syncLogs();
  }

  private populateBusDropdown(): void {
    this.dropdownsService.getBusNumbers()
      .subscribe(
        (jsonData: Bus) => {
          this.busDropdown.push('Select a Bus');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.busDropdown.push(jsonData.data[x]);
          }
          console.log('Populated the Buses Dropdown');
        },
        (error: any) => {
          location.reload();
          this.showErrorMessage('Could not get buses. Please try refreshing the page.');
        }
      );
  }

  private populateDriversDropdown(): void {
    this.dropdownsService.getDrivers()
      .subscribe(
        (jsonData: User) => {
          this.driverDropdown.push('Select Your Name');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.driverDropdown.push((jsonData.data[x].firstname) + ' ' + (jsonData.data[x].lastname));
          }
          console.log('Populated the Drivers Dropdown');
        },
        (error: any) => {
          location.reload();
          this.showErrorMessage('Could not get driver names. Please try refreshing the page.');
        }
      );
  }

  private populateLoopsDropdown(): void {
    this.dropdownsService.getAllLoops()
      .subscribe(
        (jsonData: Loop) => {
          this.loopsDropdown.push('Select a Loop');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.loopsDropdown.push(jsonData.data[x]);
          }
          console.log('Populated the Loops Dropdown');
        },
        (error: any) => {
          location.reload();
          this.showErrorMessage('Could not get loops. Please try refreshing the page.');
        }
      );
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
  }
}
