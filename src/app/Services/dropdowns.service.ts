import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DropdownsService {
  baseUrl: string;

  constructor(private logService: LogService, private http: HttpClient) {
    this.baseUrl = this.logService.baseUrl;
   }

  getAllStops(selectedLoop: string) {
    return this.http.get(this.baseUrl + '/getStops.php?searchTerm=' + selectedLoop);
  }

  getAllLoops() {
    return this.http.get(this.baseUrl + '/getLoops.php');
  }

  getDrivers() {
    return this.http.get(this.baseUrl + '/getUsers.php');
  }






}
