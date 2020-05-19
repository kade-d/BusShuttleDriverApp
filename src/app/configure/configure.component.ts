import { Component, OnInit } from '@angular/core';
import { LogService } from '../Services/log.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { versionEnvironment } from 'src/environments/environment.prod';
import { DropdownsService } from '../Services/dropdowns.service';
import { Bus } from '../Models/bus';
import { User } from '../Models/user';
import { Loop } from '../Models/loop';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { SwUpdate } from '@angular/service-worker';
import { Inspection } from './../Models/inspection-item';
import { InspectionLogService } from './../Services/inspection-log.service';
import { InspectionService } from './../Services/inspection.service';
import { Stop } from '../Models/stop';
import { ConnectionService } from './../Services/connection.service';
import {Driver} from '../Models/driver';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css'],
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

export class ConfigureComponent implements OnInit {
  syncingMessage: string;
  syncingCount: number;
  didStartSync: boolean;
  version: string = versionEnvironment.version;

  busDropdown: Bus[];
  driverDropdown: Driver[];
  loopsDropdown: Loop[];

  errorMessage = '';

  selectedBus: Bus;
  selectedDriver: Driver;
  selectedLoop: Loop;

  errorMessageState = false;
  busDropdownState = true;
  driverDropdownState = true;
  loopDropdownState = true;
  noInternet = false;

  public onlineOffline: boolean = navigator.onLine;
  errMessage = 'Oops! There is no internet connection.';

  constructor(public logService: LogService, public dropdownsService: DropdownsService,
    private router: Router, private swUpdate: SwUpdate, private authenticationService: AuthenticationService,
    private inspecService: InspectionService, public inspectionService: InspectionLogService,
    private connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.connectionService.createOnline$().subscribe(isOnline => this.onlineOffline = isOnline);
        // Prompt reload if Service Worker detects new files.
        if (this.swUpdate.isEnabled) {
          this.swUpdate.available.subscribe(() => {
            if (confirm('There is a new version available. Load New Version?')) {
              window.location.reload();
            }
          });
        } else {
          console.log('swUpdate is not available.');
        }

    this.logService.currentSyncMessage.subscribe(passedMessage => {
      this.syncingMessage = passedMessage;
      this.noInternet = passedMessage === 'There was an error. Please ensure you have a stable WiFi connection and try again.';
    });

    this.logService.currentSyncCount.subscribe(passedCount => this.syncingCount = passedCount);
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    this.dropdownsService.currentBusDropdown.subscribe(passedValue => this.busDropdown = passedValue);
    this.dropdownsService.currentDriverDropdown.subscribe(passedValue => this.driverDropdown = passedValue);
    this.dropdownsService.currentLoopDropdown.subscribe(passedValue => this.loopsDropdown = passedValue);

    this.verifyDropDownsAreNotEmpty();

    this.inspectionService.allItems = [];
    this.inspectionService.preItems = [];
    this.inspectionService.postItems = [];

    this.inspecService.getDBItems()
    .subscribe(
      (jsonData: Inspection) => {
        // tslint:disable-next-line:forin We know this already works.
        for (const x in jsonData.data) {
          this.inspectionService.allItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].name,
            jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));

            if (jsonData.data[x].pre_trip_inspection === 1) {
              this.inspectionService.preItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }

            if (jsonData.data[x].post_trip_inspection === 1) {
              this.inspectionService.postItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }
        }
      }
    );

    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.inspectionService.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.inspectionService.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.inspectionService.selectedLoop = passedValue);
  }

  validateStartButton() {
    if (!this.onlineOffline) {
      this.errMessage = 'Oops! There is no internet connection.';
    } else {

      if (this.selectedDriver.firstname === 'Select your Name' || this.selectedBus.name === 'Select a Bus'
        || this.selectedDriver.firstname === '' || this.selectedDriver.firstname === undefined || this.selectedDriver.firstname === null
        || this.selectedLoop.name === 'Select a loop' || this.selectedLoop.name === '' || this.selectedLoop.name === undefined
        || this.selectedBus.name === '' || this.selectedBus.name === undefined) {
        this.errorMessage = 'Oops! Select all choices above.';
        this.errorMessageState = true;
      } else {
        this.getStopsFromDropdownService();
        this.router.navigate(['/pre-inspection']);
      }
    }

  }

  startSync() {
    this.didStartSync = true;
    this.logService.syncLogs();
  }

  private clearCacheByNameOrAll(allKeys: boolean) {
    caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.filter(function (cacheName) {
                if (allKeys) { return true; }
            }).map(function (cacheName) {
                return caches.delete(cacheName);
            })
        );
    }).finally(() => {
      this.populateBusDropdown();
      this.populateDriversDropdown();
      this.populateLoopsDropdown(); });
}

  refreshDropdowns() {
    this.driverDropdown = [];
    this.busDropdown = [];
    this.loopsDropdown = [];
    this.clearCacheByNameOrAll(true);

  }

  private populateBusDropdown(): void {
    this.busDropdownState = false;
    this.dropdownsService.getBusNumbers()
      .subscribe(
        (jsonData: Bus) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.busDropdown.push(new Bus(jsonData.data[x].id, jsonData.data[x].name));
          }
          this.dropdownsService.changeBusDropdown(this.busDropdown);
          console.log('Populated the Buses Dropdown');
          this.busDropdownState = true;
        },
        (error: any) => {
          this.showErrorMessage('Could not get buses. Please try refreshing the page.');
        }
      );
  }

  private populateDriversDropdown(): void {
    this.driverDropdownState = false;
    this.dropdownsService.getDrivers()
      .subscribe(
        (jsonData: Driver) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.driverDropdown.push(new Driver(jsonData.data[x].id, jsonData.data[x].first_name, jsonData.data[x].last_name));
          }
          this.dropdownsService.changeDriverDropdown(this.driverDropdown);
          console.log('Populated the Drivers Dropdown');
          this.driverDropdownState = true;
        },
        (error: any) => {
          this.showErrorMessage('Could not get buses. Please try refreshing the page.');
        }
      );
  }

  private populateLoopsDropdown(): void {
    this.loopDropdownState = false;
    this.dropdownsService.getAllLoops()
      .subscribe(
        (jsonData: Loop) => {
          this.loopsDropdown = [];
          for (const x in jsonData.data) {
            this.loopsDropdown.push(new Loop(jsonData.data[x].name, jsonData.data[x].id));
          }
          this.dropdownsService.changeLoopDropdown(this.loopsDropdown);
          console.log('Populated the Loops Dropdown');
          this.loopDropdownState = true;
        },
        (error: any) => {
          this.showErrorMessage('Could not get loops. Please try refreshing the page.');
        }
      );
  }

  logout() {
    this.dropdownsService.changeBus(new Bus('0', 'Select a Bus'));
    this.dropdownsService.changeDriver(new Driver(0, 'Select your Name', ''));
    this.dropdownsService.changeLoop(new Loop('Select a loop', '0'));
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  // If dropdowns are empty, populate the dropdowns
  verifyDropDownsAreNotEmpty() {
    if (this.busDropdown[0] === undefined) {
      this.populateBusDropdown();
    }
    if (this.driverDropdown[0] === undefined) {
      this.populateDriversDropdown();
    }
    if (this.loopsDropdown[0] === undefined) {
      this.populateLoopsDropdown();
    }

    if (this.logService.logsToSend.length > 0) {
      this.logService.changeSyncMessage('syncStarted');
    }
  }

  getSyncMessage(): string {
    if (this.syncingCount === 1) {
      return (this.syncingCount + ' ' + 'item');
    } if (this.syncingCount > 1) {
      return (this.syncingCount + ' ' + 'items');
    } else {
      return ('All done! There is nothing');
    }
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  private getStopsFromDropdownService() {
    this.dropdownsService.stops = [];
    this.dropdownsService.getAllStops(this.selectedLoop.id)
      .subscribe(
        (jsonData: Stop) => {
          for (const x in jsonData.data) {
            this.dropdownsService.stops.push(new Stop(jsonData.data[x].id, jsonData.data[x].name));
            console.log(this.dropdownsService.stops);
          }
       }
      );
    }
}
