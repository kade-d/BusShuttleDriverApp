import { Component, OnInit } from '@angular/core';
import { LogService } from '../Services/log.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { versionEnvironment } from 'src/environments/environment.prod';
import { DropdownsService } from '../Services/dropdowns.service';
import { Bus } from '../Models/bus';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class ConfigureComponent implements OnInit {
  syncingMessage: string;
  syncingCount: number;
  didStartSync: boolean;
  version: string = versionEnvironment.version;
  busDropdown = [];
  errorMessage = '';
  selectedBus: string;

  constructor(public logService: LogService, public dropdownsService: DropdownsService) {
   }

  ngOnInit() {
    this.logService.currentSyncMessage.subscribe(passedMessage => this.syncingMessage = passedMessage);
    this.logService.currentSyncCount.subscribe(passedCount => this.syncingCount = passedCount);
    this.dropdownsService.currentBusNumber.subscribe(passedValue => this.selectedBus = passedValue);
    this.populateBusDropdown();
  }

displayConfirmation() {
  this.didStartSync = true;
  this.logService.syncLogs();
  }

  private populateBusDropdown(): void {
    this.dropdownsService.getBusNumbers()
      .subscribe(
        (jsonData: Bus) => {
          this.busDropdown.push('Select a Bus');
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.busDropdown.push(jsonData.data[x]);
          }
          console.log('Populated the Buses Dropdown');
        },
        (error: any) => {
          this.showErrorMessage('Could not get buses. Please try refreshing the page.');
        }
      );
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
  }
}
