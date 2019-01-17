import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Log } from './log';



@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseUrl = 'https://www.mildvariety.club/api';
  logs: Log[];


  
constructor(private http: HttpClient) { }

  store(log: Log): Observable<Log> {
    return this.http.post<Log>('https://www.mildvariety.club/api/store', { data: log })
    .pipe(catchError(this.handleError));
  }



  /** POST: add a new hero to the database */
// store (log: Log): Observable<Log[]> {
//   return this.http.post<Log[]>(`${this.baseUrl}/store`, log, httpOptions)
//     .pipe(
//       catchError(this.handleError)
//     );
// }

  // store(car: Log): Observable<Log[]> {
  //   return this.http.post(`${this.baseUrl}/store`, { data: car })
  //     .pipe(map((res) => {
  //       this.logs.push(res['data']);
  //       return this.logs;
  //     }),
  //     catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    console.log("there was an error")
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
