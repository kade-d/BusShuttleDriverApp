import { Component } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { Title }     from '@angular/platform-browser';

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

  constructor(private logService: LogService, private titleService: Title ) {
    console.log(this.getTitle());
  }

  getTitle(): string {
    var value: string = this.titleService.getTitle()
    return value;
  }

  addLog(f): void {
    
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
    f.controls['boarded'].reset();
    f.controls['stop'].reset();
    f.controls['loop'].reset();
    console.log(tempLog);
  }

  private resetErrors(){
    this.success = '';
    this.error   = '';
  }

}
