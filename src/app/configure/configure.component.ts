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
  driverDropdown: User[];
  loopsDropdown: Loop[];

  errorMessage = '';

  selectedBus: Object;
  selectedDriver: Object;
  selectedLoop: Object;

  errorMessageState = false;
  busDropdownState = true;
  driverDropdownState = true;
  loopDropdownState = true;
  noInternet = false;

  constructor(public logService: LogService, public dropdownsService: DropdownsService,
    private router: Router, private swUpdate: SwUpdate, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {

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
      if (passedMessage === 'There was an error. Please ensure you have a stable WiFi connection and try again.') {
        this.noInternet = true;
      } else {
        this.noInternet = false;
      }
    });

    this.logService.currentSyncCount.subscribe(passedCount => this.syncingCount = passedCount);
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    this.dropdownsService.currentBusDropdown.subscribe(passedValue => this.busDropdown = passedValue);
    this.dropdownsService.currentDriverDropdown.subscribe(passedValue => this.driverDropdown = passedValue);
    this.dropdownsService.currentLoopDropdown.subscribe(passedValue => this.loopsDropdown = passedValue);

    this.verifyDropDownsAreNotEmpty();

  }

  validateStartButton() {
    if (this.selectedBus === 'Select a Bus' || this.selectedDriver === 'Select Your Name' || this.selectedLoop === 'Select a Loop') {
      this.errorMessage = 'Oops! Select all choices above.';
      this.errorMessageState = true;
    } else {
      this.router.navigate(['/form']);
    }
  }

  startSync() {
    this.didStartSync = true;
    this.logService.syncLogs();
    this.dropdownsService.changeBus('Select a Bus');
    this.dropdownsService.changeDriver('Select Your Name');
    this.dropdownsService.changeLoop('Select a Loop');
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
          this.busDropdown = [];
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.busDropdown.push([jsonData.data[x].id, jsonData.data[x].busIdentifier]);
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
        (jsonData: User) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.driverDropdown.push([jsonData.data[x].id, (jsonData.data[x].firstname) + ' ' + (jsonData.data[x].lastname)]);
          }
          console.log('Populated the Drivers Dropdown');
          this.driverDropdownState = true;
        },
        (error: any) => {
          this.showErrorMessage('Could not get driver names. Please try refreshing the page.');
        }
      );
  }

  private populateLoopsDropdown(): void {
    this.loopDropdownState = false;
    this.dropdownsService.getAllLoops()
      .subscribe(
        (jsonData: Loop) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.loopsDropdown.push([jsonData.data[x].id, jsonData.data[x].loopName]);
          }
          console.log('Populated the Loops Dropdown');
          for (let i = 1; i < this.loopsDropdown.length + 1; i++) {
            this.dropdownsService.getAllStops(this.loopsDropdown[i - 1][0])
              .subscribe((a) => {
                if (i === this.loopsDropdown.length - 1) {
                  this.loopDropdownState = true; // enable loop dropdown only after ALL stops are cached.
                }
              });
            // console.log('caching stops for ' + this.loopsDropdown[i] );
          }
        },
        (error: any) => {
          this.showErrorMessage('Could not get loops. Please try refreshing the page.');
        }
      );
  }

  logout() {
    this.dropdownsService.changeBus('Select a Bus');
    this.dropdownsService.changeDriver('Select Your Name');
    this.dropdownsService.changeLoop('Select a Loop');
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
}
