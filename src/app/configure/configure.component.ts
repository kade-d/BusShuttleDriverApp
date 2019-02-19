import { Component, OnInit } from '@angular/core';
import { LogService } from '../Services/log.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {
  syncingMessage: string;
  didStartSync: boolean;

  constructor(public logService: LogService) { }

  ngOnInit() {
    this.logService.currentSyncMessage.subscribe(passedMessage => this.syncingMessage = passedMessage);
  }

displayConfirmation() {
  this.didStartSync = true;
  this.logService.syncLogs();
  }
}
