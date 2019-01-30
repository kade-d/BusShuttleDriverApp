import { Component, ViewChild } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Stop } from './stop';
import { Loop } from './loop';

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
  stops = new Stop("","");
  loops = new Loop("", "");
  stopDropdown = [];
  loopDropdown = [];
  isHidden = false;

  constructor(private logService: LogService, private titleService: Title) {
    this.log.boarded = 0;
    this.log.stop = null;
    this.getStops();
    this.getLoops();
  }

  decreaseBoardedValueClicked(): void {
    if (this.log.boarded == 0) { return; }
    this.log.boarded = this.log.boarded - 1;
  }

  increaseBoardedValueClicked(): void {
    this.log.boarded = this.log.boarded + 1;
  }

  getStops() {
    console.log(this.logService.response);
    this.logService.getAllStops().subscribe(
      (data: Stop) => {
        for (var x in data.data){
          this.stopDropdown.push(data.data[x]);
       }
      },
      (error: any) => console.log("Could not get stops")
    )
  }

  getLoops() {
    console.log(this.logService.response);
    this.logService.getAllLoops().subscribe(
      (data: Stop) => {
        for (var x in data.data){
          this.loopDropdown.push(data.data[x]);
       }
      },
      (error: any) => console.log("Could not get Loops")
    )
  }

  submitLog(f: NgForm): void {
    this.resetErrors();
    if(this.log.loop == undefined || this.log.stop == undefined){
      this.isHidden = true;
      this.error = "Oops! You didn't select all necessary fields."
      return;
    }
    this.isHidden = false;
    var tempLog = new Log(0, '', '', '');
    tempLog.boarded = this.log.boarded;
    tempLog.driver = this.log.driver;
    tempLog.loop = this.log.loop;
    tempLog.stop = this.log.stop;

    console.log(tempLog);
    this.logService.store(tempLog).subscribe(
      (data: Log) => {

        console.log(data);
        
      },
      (error: any) => this.error = "Something went wrong, please try adding again shortly."
    );
    this.log.boarded = 0;
    f.controls['stop'].reset();
    console.log(tempLog);
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }

}
