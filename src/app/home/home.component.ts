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
  log = new Log(0, '', '', '', 0);
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


  populateStopsDropdown() {
    this.stopDropdownState = true;
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
          this.errorMessageState = false;
        },
        (error: any) => {
          this.errorMessage = 'Could not get stops. Enter a loop or try refreshing the page.';
          this.errorMessageState = true;
        }
      );
  }
  

  populateLoopsDropdown() {
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
          this.errorMessage = 'Could not get loops. Please try refreshing the page.';
          this.errorMessageState = true;
        }
      );
      
  }

  populateDriversDropdown() {
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
          this.errorMessage = 'Could not get driver names. Please try refreshing the page.';
          this.errorMessageState = true;
        }
      );
  }

  submitLog(form: NgForm): void {
    this.resetErrors();
    if (this.log.loop === undefined || this.log.stop === undefined || this.log.loop === null
          || this.log.stop === null || this.log.stop === 'Select a stop' || this.log.loop === 'Select a loop'
          || this.log.driver === 'Select your name') {
      this.errorMessageState = true;
      this.errorMessage = 'Oops! Please select all necessary fields.';
      return;
    } else if (this.log.leftBehind === undefined || this.log.leftBehind === null) {
      this.log.leftBehind = 0;
    }

    this.errorMessageState = false;
    this.logService.store(this.log)
      .subscribe(
        (data: Log) => {
          this.successMessage = 'Entry has been logged.';
          this.showSuccessMessage();
          console.log(data);
          this.resetFormControls(form);
        },
        (error: any) => this.errorMessage = 'Something went wrong, please try adding again shortly.'
      );
      console.log(this.log);
  }

  private resetErrors() {
    this.successMessage = '';
    this.errorMessage = '';
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

  public showSuccessMessage() {
    this.successMessageState = true;
    const successTimer = timer(5000);
    this.subscription = successTimer.subscribe(() => {
        this.successMessageState = false;
    });
  }
}
