import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inspection } from '../Models/inspection-item';
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
    return this.http.get<Inspection[]>(environment.BASE_API_URL+ `/getInspectionItem.php`);
  }

  addInspecReport(xItem){
    this.report.push(xItem);
  }

  getDBItems(): void {
    //this.clearItems()
    this.getAll()
      .subscribe(
        (jsonData: Inspection) => {
          // tslint:disable-next-line:forin We know this already works.
          for (const x in jsonData.data) {
            this.items.push(new Inspection( jsonData.data[x].id, jsonData.data[x].name, jsonData.data[x].pre, jsonData.data[x].post));
          }
        }
      );
  }
}
