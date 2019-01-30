import { Component, ViewChild } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Stop } from './stop';

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
  testDropdown = [];

  constructor(private logService: LogService, private titleService: Title) {
    this.log.boarded = 0;
    this.getStops();
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
          this.testDropdown.push(data.data[x]);
       }
      },
      (error: any) => console.log("Could not get stops")
    )
  }

  submitLog(f: NgForm): void {
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
      (error: any) => console.log("Could not add.")
    );
    this.log.boarded = 0;
    f.controls['stop'].reset();
    f.controls['loop'].reset();
    console.log(tempLog);
  }

  private resetErrors() {
    this.success = '';
    this.error = '';
  }

}
