import { Component, OnInit } from '@angular/core';

import { Log } from './log';
import { LogService } from './log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  logs: Log[];
  error = '';
  success = '';
  total = 0;

  log = new Log(0, '', '', '', '', '');

  constructor(private logService: LogService) {
  }

  ngOnInit() {
    this.getCars();
    
  }

  calculateTotal(): void {
    this.total = 0;
    for(let i = 0; i < this.logs.length; i++){
      this.total = this.total + Number(this.logs[i].boarded);
      console.log(this.total);
    }
  }
  getCars(): void {
    this.logService.getAll().subscribe(
      (res: Log[]) => {
        this.logs = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getGreen(): void {
    this.logService.getAllGreen().subscribe(
      (res: Log[]) => {
        this.logs = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getRed(): void {
    this.logService.getAllRed().subscribe(
      (res: Log[]) => {
        this.logs = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  addCar(f) {
    this.resetErrors();

    this.logService.store(this.log)
      .subscribe(
        (res: Log[]) => {
          // Update the list of cars
          this.logs = res;

          // Inform the user
          this.success = 'Created successfully';

          // Reset the form
          f.reset();
        },
        (err) => this.error = err
      );
  }

  private resetErrors(){
    this.success = '';
    this.error   = '';
  }

}
