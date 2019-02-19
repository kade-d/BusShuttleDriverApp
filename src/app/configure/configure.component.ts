import { Component, OnInit } from '@angular/core';
import { LogService } from '../Services/log.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {
  syncingMessage: string;
  syncingCount: number;
  didStartSync: boolean;

  constructor(public logService: LogService) {
   }

  ngOnInit() {
    this.logService.currentSyncMessage.subscribe(passedMessage => this.syncingMessage = passedMessage);
    this.logService.currentSyncCount.subscribe(passedCount => this.syncingCount = passedCount);
  }

displayConfirmation() {
  this.didStartSync = true;
  this.logService.syncLogs();
  }
}
