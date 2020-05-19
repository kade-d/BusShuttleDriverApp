
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inspection } from '../Models/inspection-item';
import { Observable } from 'rxjs';
import {User} from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(private http: HttpClient) { }

  currentUser = <User> JSON.parse(localStorage.getItem('currentUser'));

  options = {
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.currentUser.token),
  };

  getDBItems(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(environment.BASE_API_URL + `/api/inspection-items`, this.options);
  }

}
