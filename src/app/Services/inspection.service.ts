
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inspection } from '../Models/inspection-item';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(private http: HttpClient) { }

  public items = [];
  private report =[];

  UpdateItems(obj) {
    this.items.push(obj);
  }

  getItems() {
    return this.items;
  }

  clearItems() {
    this.items = [];
    return this.items;
  }

  getAll() {
    return this.http.get<Inspection[]>(environment.BASE_API_URL + `/getInspectionItem.php`);
  }

  addInspecReport(xItem){
    this.report.push(xItem);
  }
 /* errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || 'Server Error');
  }*/

  getDBItems(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(environment.BASE_API_URL + `/getInspectionItem.php`);
  }
}
