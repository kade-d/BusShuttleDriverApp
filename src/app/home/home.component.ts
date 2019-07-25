import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Log } from '../Models/log';
import { LogService } from '../Services/log.service';
import { NgForm } from '@angular/forms';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';
import { timer, interval } from 'rxjs';
import { DropdownsService } from '../Services/dropdowns.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import { exit } from 'process';
import { switchMap, findIndex } from 'rxjs/operators';
import { Bus } from '../Models/bus';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(0, style({ opacity: 0 })))
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('form', { read: NgForm }) form: any;
  logs: Log;
  errorMessage = '';
  successMessage = '';
  isSyncingMessage = 'Sync in progress';
  log = new Log(0, null, '', '', '', 0, '');
  stops = new Stop();
  loops = new Loop();
  stopDropdown: Stop[];
  loopDropdown = [];
  driverDropdown = [];
  currentBusDropdown: Bus[];
  stop = null;

  stopName = 'No Stop Selected Yet'; // sets the value under the submit button

  errorMessageState = false;
  successMessageState = false;

  stopDropdownPosition: number;

  stopDropdownState: boolean;
  loopDropdownState: boolean;
  dropdownDisabled: boolean;

  selectedBus: Object;
  selectedDriver: Object;
  selectedLoop: Object;
  successTimer = timer(10000);
  syncTimer = timer(30000);

  successSubscription: any;
  submitSubscription: any;
  syncSubscription: any;

  constructor(public logService: LogService, private swUpdate: SwUpdate,
    public dropdownsService: DropdownsService, private router: Router) {

    this.log.stop = null;
    this.log.boarded = 0;
    this.log.leftBehind = 0;
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    this.dropdownsService.currentBusDropdown.subscribe(passedValue => this.currentBusDropdown = passedValue);
    this.dropdownsService.currentLoopDropdown.subscribe(passedValue => this.loopDropdown = passedValue);
    // this.populateLoopsDropdown();
    this.populateStopsDropdown();

    // If page is accessed without being configured, redirect to settings page.
    if (this.selectedLoop === 'Select a Loop') {
      this.router.navigateByUrl('/configure');
    }

    // Check if we have internet and attempt to sync logs.
    const obsTimer = this.syncTimer.pipe(switchMap(() => interval(30000)));
    this.syncSubscription = obsTimer.subscribe(() => {
      if ('onLine' in navigator) {
        if (!navigator.onLine) {
          console.log('offline');
          if (exit) {
            return;
          }
        } else {
          if (logService.logsToSend.length > 0) {
            console.log('online');
            logService.syncLogs();
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.syncSubscription.unsubscribe();
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
  }

  decreaseBoardedValueClicked(): void {
    if (this.log.boarded === 0 || this.log.boarded === undefined) {
      return;
    } else if (this.log.boarded <= 0) {
      this.log.boarded = 0;
    } else {
      this.log.boarded = this.log.boarded - 1;
    }
  }

  increaseBoardedValueClicked(): void {
    if (this.log.boarded === undefined) {
      this.log.boarded = 1;
    } else {
      this.log.boarded = this.log.boarded + 1;
    }
  }

  decreaseLeftBehindValueClicked(): void {
    if (this.log.leftBehind === 0 || this.log.leftBehind === undefined) {
      return;
    } else if (this.log.leftBehind <= 0) {
      this.log.leftBehind = 0;
    } else {
      this.log.leftBehind = this.log.leftBehind - 1;
    }
  }

  increaseLeftBehindValueClicked(): void {
    if (this.log.leftBehind === undefined) {
      this.log.leftBehind = 1;
    } else {
      this.log.leftBehind = this.log.leftBehind + 1;
    }
  }

  populateStopsDropdown(): void {
    this.dropdownDisabled = true;
    this.stopDropdown = [];
    this.log.stop = new Stop('Select a Stop', 0);

    // This actually handles putting the data in the stopdropdown to display to the user.
    this.dropdownsService.getAllStops(this.selectedLoop[0])
      .subscribe(
        (data: Stop) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in data.data) {
            this.stopDropdown.push(new Stop(data.data[x].id, data.data[x].stops));
          }
          console.log('Populated the Stops Dropdown');

          this.stopDropdownState = true;
          this.dropdownDisabled = false;
          this.errorMessageState = false;
        },
        (error: any) => {
          this.router.navigateByUrl('/configure');
          this.showErrorMessage('Could not get stops. Select a loop or try refreshing the page.');
        }
      );
  }

  submitLog(form: NgForm): void {
    if (this.validateForm(form) === false) { return; }
    this.log.timestamp = this.getTimeStamp();
    this.log.driver = this.selectedDriver[0];
    this.log.busNumber = this.selectedBus[0];
    this.log.loop = this.selectedLoop[0];
    this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x === this.log.stop)].name;
    this.errorMessageState = false;
    const copy = { ...this.log }; // Creating a copy of the member 'log'.
    this.showSuccessMessage(this.stopName);

    // Subscribing to the timer. If undo pressed, we unsubscribe.
    this.submitSubscription = this.successTimer.subscribe(() => {
      this.advanceStopToNextValue(this.form);
      this.resetFormControls(this.form);
      this.logService.storeLogsLocally(copy);
      console.log(copy);
      console.log('object stored locally');

          // if an item hasn't been selected in the stop dropdown, don't change stopName under submit button.
    if (this.stopDropdown[this.stopDropdown.findIndex(x => x === this.log.stop)] !== undefined) {
      this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x === this.log.stop)].name;
    }
      });
  }

  private validateForm(form: NgForm): boolean {
    this.resetErrors();
    if (this.log.stop === null || this.log.stop.name === 'Select a stop' || this.log.loop === 'Select a loop') {
      this.showErrorMessage('Oops! Please select a stop.');
      return false;
    } if (this.log.stop === undefined) {
      this.form.controls['stop'].setValue(this.stopDropdown[1]);
    }

    if (this.selectedDriver === 'Select Your Name' || this.selectedDriver === '' || this.selectedDriver === undefined) {
      this.showErrorMessage('Oops! Please select your name.');
      return false;
    }

    if (this.selectedBus === 'Select a Bus' || this.selectedBus === undefined || this.selectedBus === null) {
      this.showErrorMessage('Oops! Please select your bus number.');
      return false;
    }

    if (this.selectedLoop === 'Select a Loop' || this.selectedLoop === undefined || this.selectedLoop === null) {
      this.showErrorMessage('Oops! Please select your loop');
      return false;
    }

    if (this.log.boarded >= 65) {
      this.showErrorMessage('Oops! The number for "Boarded" is too large.');
      return false;
    }

    if (this.log.leftBehind >= 65) {
      this.showErrorMessage('Oops! The number for "Left Behind" is too large.');
      return false;
    }

    if (this.log.leftBehind === undefined || this.log.leftBehind === null) {
      this.log.leftBehind = 0;
    }

    if (this.log.boarded === undefined || this.log.boarded === null) {
      this.log.boarded = 0;
    }

    return true;
  }

  private resetErrors(): void {

    // if an item hasn't been selected in the stop dropdown, don't change stopName under submit button.
    if (this.stopDropdown[this.stopDropdown.findIndex(x => x === this.log.stop)] !== undefined) {
      this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x === this.log.stop)].name;
    }
    this.successMessage = '';
    this.errorMessage = '';
    this.successMessageState = false;
    this.errorMessageState = false;
  }

  private resetFormControls(form: NgForm) {
    // This handles the reseting of values
    this.log.boarded = 0;
    this.log.leftBehind = 0;
  }

  private advanceStopToNextValue(form: NgForm) {
    if (this.log.stop !== null && this.log.stop.name !== 'Select a stop'
      && this.stopDropdown.findIndex(x => x === this.log.stop) < this.stopDropdown.length - 1) {
      this.stopDropdownPosition = this.stopDropdown.findIndex(x => x === this.log.stop) + 1;
      form.controls['stop'].setValue(this.stopDropdown[this.stopDropdownPosition].id);
    } else if (this.stopDropdownPosition === this.stopDropdown.length - 1) {
      this.stopDropdownPosition = 1;
      form.controls['stop'].setValue(this.stopDropdown[this.stopDropdownPosition - 1].id);
    }
  }

  private showSuccessMessage(stop?: string ): void {
    this.successMessage = stop;
    this.successMessageState = true;
    this.successSubscription = this.successTimer.subscribe(() => {
    this.successMessageState = false;
    });
  }

  cancelSuccessMessage(): void {
    this.successMessageState = false;
    this.successSubscription.unsubscribe();
    this.submitSubscription.unsubscribe();
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

  private showErrorMessage(message: string): void {
    this.errorMessageState = true;
    this.errorMessage = message;
  }
}
