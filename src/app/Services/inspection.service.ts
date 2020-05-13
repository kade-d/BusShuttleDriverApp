
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

  getDBItems(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(environment.BASE_API_URL + `/getInspectionItem.php`);
  }
}
