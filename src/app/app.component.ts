import { Component } from '@angular/core';

import { Log } from './log';
import { LogService } from './log.service';

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

  constructor(private logService: LogService) {
  }

  addLog(f): void {
    this.logService.store(this.log).subscribe(
      (data: Log) => {
        console.log(data);
    
        f.controls['boarded'].reset();
        f.controls['stop'].reset();
        f.controls['loop'].reset();
      },
      (error: any) => console.log("Could not add bitch")
      
    );
  }

  // addCar(log: Log) {
  //   this.resetErrors();

  //   this.logService.store(this.log)
  //     .subscribe(
  //       (res: Log) => {
  //         // Update the list of cars
  //         this.logs = res;

  //         // Inform the user
  //         this.success = 'Created successfully';

  //         // Reset the form
  //         f.reset();
  //       },
  //       (err) => this.error = err
  //     );
  // }

  private resetErrors(){
    this.success = '';
    this.error   = '';
  }

}
