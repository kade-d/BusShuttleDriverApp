import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inspection } from '../Models/inspection-item';
@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Inspection[]>(environment.BASE_API_URL+ `/getInspectionItem.php`);
}
}
