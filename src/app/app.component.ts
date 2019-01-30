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
  log = new Log(0, '', '', '');
  stops = new Stop();
  loops = new Loop();
  stopDropdown = [];
  loopDropdown = [];
  errorMessageState = false;
  successMessageState = false;
  subscription: any;

  constructor(private logService: LogService) {
    this.log.boarded = 0;
    this.log.stop = null;
    this.populateStopsDropdown();
    this.populateLoopsDropdown();
  }

  decreaseBoardedValueClicked(): void {
    if (this.log.boarded == 0) { return; }
    this.log.boarded = this.log.boarded - 1;
  }

  increaseBoardedValueClicked(): void {
    this.log.boarded = this.log.boarded + 1;
  }

  populateStopsDropdown() {
    console.log(this.logService.response);
    this.logService.getAllStops()
      .subscribe(
        (data: Stop) => {
          for (var x in data.data) {
            this.stopDropdown.push(data.data[x]);
          }
        },
        (error: any) => {
          this.error = "Could not get Stops, please try refreshing the page.";
          this.errorMessageState = true;
        }
      )
  }

  populateLoopsDropdown() {
    console.log(this.logService.response);
    this.logService.getAllLoops()
      .subscribe(
        (data: Stop) => {
          for (var x in data.data) {
            this.loopDropdown.push(data.data[x]);
          }
        },
        (error: any) => {
          this.error = "Could not get Loops, please try refreshing the page.";
          this.errorMessageState = true;
        }
      )
  }

  submitLog(f: NgForm): void {
    this.resetErrors();
    if (this.log.loop == undefined || this.log.stop == undefined) {
      this.errorMessageState = true;
      this.error = "Oops! Please select all necessary fields."
      return;
    }
    this.errorMessageState = false;
    var tempLog = new Log(0, '', '', '');
    tempLog.boarded = this.log.boarded;
    tempLog.driver = this.log.driver;
    tempLog.loop = this.log.loop;
    tempLog.stop = this.log.stop;
    this.logService.store(tempLog)
      .subscribe(
        (data: Log) => {
          this.success = "Entry has been logged."
          this.showSuccessMessage();
          console.log(data);
        },
        (error: any) => this.error = "Something went wrong, please try adding again shortly."
      );
    this.log.boarded = 0;
    this.resetFormControls(f);
    console.log(tempLog);
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }

  private resetFormControls(f: NgForm) {
    f.controls['stop'].reset();
  }

  public showSuccessMessage(){
    this.successMessageState = true;
    let successTimer = timer(5000); //
    this.subscription = successTimer.subscribe(() => {
        this.successMessageState = false;
    });
  }
}
