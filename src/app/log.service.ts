import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Log } from './log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseUrl = 'https://www.buslog.info/api';
logs: Log[];

constructor(private http: HttpClient) { }

  getAll(): Observable<Log[]> {
    // const params = new HttpParams()
    // .set('loop', loop.toString());

    return this.http.get(`${this.baseUrl}/list `).pipe(
      map((res) => {
        this.logs = res['data'];
        console.log('cars array returned');
        return this.logs;
    }),
    catchError(this.handleError));
  }

  getAllGreen(): Observable<Log[]> {
    // const params = new HttpParams()
    // .set('loop', loop.toString());

    return this.http.get(`${this.baseUrl}/getGreen `).pipe(
      map((res) => {
        this.logs = res['data'];
        console.log('cars array returned');
        return this.logs;
    }),
    catchError(this.handleError));
  }

  getAllRed(): Observable<Log[]> {
    // const params = new HttpParams()
    // .set('loop', loop.toString());

    return this.http.get(`${this.baseUrl}/getRed `).pipe(
      map((res) => {
        this.logs = res['data'];
        console.log('cars array returned');
        return this.logs;
    }),
    catchError(this.handleError));
  }



  store(car: Log): Observable<Log[]> {
    return this.http.post(`${this.baseUrl}/store`, { data: car })
      .pipe(map((res) => {
        this.logs.push(res['data']);
        return this.logs;
      }),
      catchError(this.handleError));
  }

  update(car: Log): Observable<Log[]> {
    return this.http.put(`${this.baseUrl}/update`, { data: car })
      .pipe(map((res) => {
        const theCar = this.logs.find((item) => {
          return +item['id'] === +car['id'];
        });
        if (theCar) {
          theCar['price'] = +car['price'];
          theCar['model'] = car['model'];
        }
        return this.logs;
      }),
      catchError(this.handleError));
  }

  delete(id: number): Observable<Log[]> {
    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.delete(`${this.baseUrl}/delete`, { params: params })
      .pipe(map(res => {
        const filteredCars = this.logs.filter((car) => {
          return +car['id'] !== +id;
        });
        return this.logs = filteredCars;
      }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
