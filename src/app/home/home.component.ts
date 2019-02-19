import { Component } from '@angular/core';
import { Log } from '../Models/log';
import { LogService } from '../Services/log.service';
import { NgForm } from '@angular/forms';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';
import { timer } from 'rxjs';
import { User } from '../Models/user';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  logs: Log;
  errorMessage = '';
  successMessage = '';
  total = 0;
  log = new Log(0, '', '', '', '', 0);
  stops = new Stop();
  loops = new Loop();
  stopDropdown = [];
  loopDropdown = [];
  driverDropdown = [];
  errorMessageState = false;
  successMessageState = false;
  subscription: any;
  stopDropdownPosition: number;
  stopDropdownState: boolean;

  constructor(private logService: LogService) {
    this.log.stop = null;
    this.populateLoopsDropdown();
    this.populateDriversDropdown();
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
    this.stopDropdown = [];
    this.logService.getAllStops(this.log.loop)
      .subscribe(
        (data: Stop) => {
          console.log(data);
          this.stopDropdown.push('Select a stop');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in data.data) {
            this.stopDropdown.push(data.data[x]);
          }
          console.log('Populated the Stops Dropdown');
          this.stopDropdownState = true;
          this.errorMessageState = false;
        },
        (error: any) => {
          this.showErrorMessage('Could not get stops. Select a loop or try refreshing the page.');
        }
      );
  }

  private populateLoopsDropdown(): void {
    this.logService.getAllLoops()
      .subscribe(
        (jsonData: Loop) => {
          this.loopDropdown.push('Select a loop');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.loopDropdown.push(jsonData.data[x]);
          }
          console.log('Populated the Loops Dropdown');
        },
        (error: any) => {
          this.showErrorMessage('Could not get loops. Please try refreshing the page.');
        }
      );
  }

  private populateDriversDropdown(): void {
    this.logService.getDrivers()
      .subscribe(
        (jsonData: User) => {
          this.driverDropdown.push('Select your name');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.driverDropdown.push((jsonData.data[x].firstname) + ' ' + (jsonData.data[x].lastname) );
          }
          console.log('Populated the Drivers Dropdown');
        },
        (error: any) => {
          this.showErrorMessage('Could not get driver names. Please try refreshing the page.');
        }
      );
  }

  submitLog(form: NgForm): void {
    if (this.validateForm(form) === false) { return; }
    this.log.timestamp = this.getTimeStamp();
    this.errorMessageState = false;
    const copy = { ...this.log }; // Creating a copy of the member 'log'.
    console.log(copy);
    this.logService.storeLogsLocally(copy);
    this.showSuccessMessage();
    this.resetFormControls(form);
  }

  private validateForm (form: NgForm): boolean {
    this.resetErrors();
    if (this.log.loop === undefined || this.log.stop === undefined || this.log.loop === null
      || this.log.stop === null || this.log.stop === 'Select a stop' || this.log.loop === 'Select a loop'
      || this.log.driver === 'Select your name') {
      this.showErrorMessage('Oops! Please select all necessary fields.');
      return false;
    } else if (this.log.leftBehind === undefined || this.log.leftBehind === null) {
      this.log.leftBehind = 0;
    }
    return true;
  }

  private resetErrors(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.successMessageState = false;
    this.errorMessageState = false;
  }

  private resetFormControls(form: NgForm) {
    console.log(this.stopDropdown.length);
    if (this.stopDropdownPosition === this.stopDropdown.length - 2) {
      this.stopDropdownPosition = 1;
      form.controls['stop'].setValue(this.stopDropdown[this.stopDropdownPosition]);
    } else {
      this.stopDropdownPosition = this.stopDropdown.indexOf(this.log.stop);
      form.controls['stop'].setValue(this.stopDropdown[this.stopDropdownPosition + 1]);
    }
    console.log(this.stopDropdownPosition);
    form.controls['boarded'].reset();
    form.controls['leftBehind'].reset();
  }

  private showSuccessMessage(): void {
    this.successMessage = 'Success! Your entry has been added to the queue.';
    this.successMessageState = true;
    const successTimer = timer(5000);
    this.subscription = successTimer.subscribe(() => {
        this.successMessageState = false;
    });
  }

  private showErrorMessage(message: string): void {
    this.errorMessageState = true;
    this.errorMessage = message;
  }

  pad(n) { // function for adding leading zeros to dates/times
    return n < 10 ? '0' + n : n;
}

getTimeStamp(): string {
  const date = new Date();
  const timestamp = (date.getFullYear() + '/'
  + this.pad((date.getMonth()) + 1) + '/'
  + this.pad(date.getUTCDate()) + ' '
  + this.pad(date.getHours()) + ':'
  + this.pad(date.getMinutes()) + ':'
  + this.pad(date.getSeconds()));
  return timestamp;
}
}
