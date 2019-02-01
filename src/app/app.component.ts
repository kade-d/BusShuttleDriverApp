import { Component } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { NgForm } from '@angular/forms';
import { Stop } from './stop';
import { Loop } from './loop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logs: Log;
  error = '';
  success = '';
  total = 0;
  log = new Log(0, '', '', '', 0);
  stops = new Stop();
  loops = new Loop();
  stopDropdown = [];
  loopDropdown = [];
  errorMessageState = false;
  successMessageState = false;
  subscription: any;

  constructor(private logService: LogService) {
    this.log.stop = null;
    this.populateStopsDropdown();
    this.populateLoopsDropdown();
  }

  decreaseBoardedValueClicked(): void {
    if (this.log.boarded == 0 || this.log.boarded == undefined) {
      return;
    }
    else {
      this.log.boarded = this.log.boarded - 1;
    }
  }

  increaseBoardedValueClicked(): void {
    if (this.log.boarded == undefined) {
      this.log.boarded = 1;
    } else {
      this.log.boarded = this.log.boarded + 1;
    }
  }

  decreaseLeftBehindValueClicked(): void {
    if (this.log.leftBehind == 0 || this.log.leftBehind == undefined) {
      return;
    } else {
      this.log.leftBehind = this.log.leftBehind - 1;
    }
  }

  increaseLeftBehindValueClicked(): void {
    if (this.log.leftBehind == undefined) {
      this.log.leftBehind = 1;
    } else {
      this.log.leftBehind = this.log.leftBehind + 1;
    }
  }


  populateStopsDropdown() {
    this.logService.getAllStops()
      .subscribe(
        (data: Stop) => {
          this.stopDropdown.push("Select a stop")
          for (var x in data.data) {
            this.stopDropdown.push(data.data[x]);
          }
          console.log("Populated the Stops Dropdown");
        },
        (error: any) => {
          this.error = "Could not get stops. Please try refreshing the page.";
          this.errorMessageState = true;
        }
      )  
  }

  populateLoopsDropdown() {
    this.logService.getAllLoops()
      .subscribe(
        (data: Loop) => {
          this.loopDropdown.push("Select a loop")
          for (var x in data.data) {
            this.loopDropdown.push(data.data[x]);
          }
          console.log("Populated the Loops Dropdown");
        },
        (error: any) => {
          this.error = "Could not get loops. Please try refreshing the page.";
          this.errorMessageState = true;
        }
      )
  }

  submitLog(f: NgForm): void {
    this.resetErrors();
    if (this.log.loop == undefined || this.log.stop == undefined || this.log.stop == "Select a stop" || this.log.loop == "Select a loop") {
      this.errorMessageState = true;
      this.error = "Oops! Please select all necessary fields."
      return;
    } else if (this.log.leftBehind == undefined) {
      this.log.leftBehind = 0;
    }
    this.errorMessageState = false;
    var tempLog = new Log(0, '', '', '', 0);
    tempLog.boarded = this.log.boarded;
    tempLog.driver = this.log.driver;
    tempLog.loop = this.log.loop;
    tempLog.stop = this.log.stop;
    tempLog.leftBehind = this.log.leftBehind;
    this.logService.store(tempLog)
      .subscribe(
        (data: Log) => {
          this.success = "Entry has been logged."
          this.showSuccessMessage();
          console.log(data);
        },
        (error: any) => this.error = "Something went wrong, please try adding again shortly."
      );
    this.resetFormControls(f);
    console.log(tempLog);
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }

  private resetFormControls(f: NgForm) {
    f.controls['stop'].reset();
    f.controls['boarded'].reset();
    f.controls['leftBehind'].reset();
  }

  public showSuccessMessage(){
    this.successMessageState = true;
    let successTimer = timer(5000); //
    this.subscription = successTimer.subscribe(() => {
        this.successMessageState = false;
    });
  }
}
