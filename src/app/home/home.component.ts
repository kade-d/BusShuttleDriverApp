﻿import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { User } from '../Models/user';
import { ConnectionService } from '../Services/connection.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import {Driver} from '../Models/driver';

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
  log = new Log(0, '', '', '', '', 0, '');
  stops = new Stop(null, null);
  loops = new Loop(null, null);
  stopDropdown: Stop[];
  loopDropdown = [];
  driverDropdown = [];
  currentBusDropdown: Bus[];
  stop = null;
  cancelClicked = false;

  stopName = 'No Stop Selected Yet'; // sets the value under the submit button

  errorMessageState = false;
  successMessageState = false;

  stopDropdownPosition: number;

  stopDropdownState: boolean;
  loopDropdownState: boolean;
  dropdownDisabled: boolean;

  selectedBus: Bus;
  selectedDriver: Driver;
  selectedLoop: Loop;
  successTimer = timer(10000);
  syncTimer = timer(30000);
  timeForRest = timer(10);
  timerId: any;

  successSubscription: any;
  submitSubscription: any;
  syncSubscription: any;
  resetForm: any;

  public onlineOffline: boolean = navigator.onLine;

  constructor(public logService: LogService, private swUpdate: SwUpdate,
    public dropdownsService: DropdownsService, private router: Router,
    private connectionService: ConnectionService) {

    this.log.stop = null;
    this.log.boarded = 0;
    this.log.leftBehind = 0;
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.dropdownsService.currentDriver.subscribe(passedValue => this.selectedDriver = passedValue);
    this.dropdownsService.currentLoop.subscribe(passedValue => this.selectedLoop = passedValue);
    this.dropdownsService.currentBusDropdown.subscribe(passedValue => this.currentBusDropdown = passedValue);
    this.dropdownsService.currentLoopDropdown.subscribe(passedValue => this.loopDropdown = passedValue);
    // this.populateLoopsDropdown();
    this.populateStopsDropdown2();

    // If page is accessed without being configured, redirect to settings page.
    if (this.selectedLoop.name === 'Select a loop') {
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
    this.log.stop = 'Select a stop';
    this.stopDropdown = [];

    // This actually handles putting the data in the stopdropdown to display to the user.
    this.dropdownsService.getAllStops(this.selectedLoop.id)
      .subscribe(
        (data: Stop) => {
          // this.stopDropdown.push(new Stop(null, 'Select a Stop'));
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

  populateStopsDropdown2(): void {
    this.dropdownDisabled = true;
    this.log.stop = 'Select a stop';
    this.stopDropdownState = true;
          this.dropdownDisabled = false;
          this.errorMessageState = false;
    this.stopDropdown = [];

    // This actually handles putting the data in the stopdropdown to display to the user.

    this.stopDropdown =  this.dropdownsService.stops;
          console.log('Populated the Stops Dropdown');

  }


  submitLog(form: NgForm): void {
    if (this.validateForm(form) === false) { return; }
    this.log.timestamp = this.getTimeStamp();
    this.log.driver = this.selectedDriver.id;
    this.log.busNumber = this.selectedBus.id;
    this.log.loop = this.selectedLoop.id;
    this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)].name;
    this.errorMessageState = false;
    const copy = { ...this.log }; // Creating a copy of the member 'log'.
    this.cancelClicked = false;
    this.showSuccessMessage(this.stopName);

    // check for the success message to disapper then try to either submit data directly or put it in the local storage.
    this.timerId = setInterval(() => this.subscribe(copy), 1000);
    setTimeout(() => clearInterval(this.timerId), 12000);
  }

  private subscribe (copy: Log): void {
    if (!this.successMessageState) {
      if (!this.cancelClicked) {

        // Try to either submit data directly or put it in the local storage.
        this.submitSubscription = this.timeForRest.subscribe(() => {
        this.advanceStopToNextValue(this.form);
        this.resetFormControls(this.form);
        if (this.onlineOffline) {
          this.logService.directSubmit(copy)
          .subscribe((success) => {
            console.log('object strored in Database');
            }, (error: any) => {
              this.logService.storeLogsLocally(copy);
              console.log(copy);
              console.log('object stored locally');
            });
        } else {
              this.logService.storeLogsLocally(copy);
              console.log(copy);
              console.log('object stored locally');
          }

        // if an item hasn't been selected in the stop dropdown, don't change stopName under submit button.
        if (this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)] !== undefined) {
          this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)].name;
        }
          });
        clearInterval(this.timerId);
       }

    }

  }

  private validateForm(form: NgForm): boolean {
    this.resetErrors();
    if (this.log.stop === null || this.log.stop === 'Select a stop' || this.log.loop === 'Select a loop') {
      this.showErrorMessage('Oops! Please select a stop.');
      return false;
    } if (this.log.stop === undefined) {
      this.form.controls['stop'].setValue(this.stopDropdown[1]);
    }

    if (this.selectedDriver.firstname === 'Select your Name' || this.selectedDriver.firstname === '' || this.selectedDriver.firstname === undefined) {
      this.showErrorMessage('Oops! Please select your name.');
      return false;
    }

    if (this.selectedBus.name === 'Select a Bus' || this.selectedBus.name === undefined || this.selectedBus.name === null) {
      this.showErrorMessage('Oops! Please select your bus number.');
      return false;
    }

    if (this.selectedLoop.name === 'Select a loop' || this.selectedLoop.name === undefined || this.selectedLoop.name === null) {
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

  public resetErrors(): void {

    // if an item hasn't been selected in the stop dropdown, don't change stopName under submit button.
    if (this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)] !== undefined) {
      this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)].name;
    }
    this.successMessage = '';
    this.errorMessage = '';
    this.successMessageState = false;
    this.errorMessageState = false;
  }

  private resetFormControls(form: NgForm) {
    // This handles the resetting of values
    this.log.boarded = 0;
    this.log.leftBehind = 0;
  }

  private advanceStopToNextValue(form: NgForm) {
    if (this.log.stop !== null && this.log.stop !== 'Select a stop'
      && this.stopDropdown.findIndex(x => x.id === this.log.stop) < this.stopDropdown.length - 1) {
      this.stopDropdownPosition = this.stopDropdown.findIndex(x => x.id === this.log.stop) + 1;
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

  closeSuccessMessage(): void {
    this.successMessageState = false;
    this.cancelClicked = false;
  }

  submitIfConnected(log: Log) {
    const resetTime = timer(10);
    this.resetForm = resetTime.subscribe(() => {
      this.advanceStopToNextValue(this.form);
      this.resetFormControls(this.form);
             // if an item hasn't been selected in the stop dropdown, don't change stopName under submit button.
    if (this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)] !== undefined) {
      this.stopName = this.stopDropdown[this.stopDropdown.findIndex(x => x.id === this.log.stop)].name;
    }
      });

    if (this.onlineOffline) {
      this.logService.directSubmit(log)
      .subscribe((success) => {
        localStorage.setItem('log', JSON.stringify(log ));
        this.successSubscription.unsubscribe();
        this.submitSubscription.unsubscribe();
        });
    }
  }

  cancelSuccessMessage(): void {
    this.successMessageState = false;
    this.cancelClicked = true;
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

  private showErrorMessage(message: string): void {
    this.errorMessageState = true;
    this.errorMessage = message;
  }
}
