import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retryWhen, catchError, map } from 'rxjs/operators';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { Log } from './log';
import { Stop } from './stop';
import { Loop } from './loop';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseUrl = 'https://www.mildvariety.club/api';
  log: Log[];
  stops: Stop[];
  loops: Loop[];


constructor(private http: HttpClient) { }

  store(log: Log): Observable<Log> {
    return this.http.post<Log>(this.baseUrl +'/store', { data: log })
    .pipe(
      retryWhen(this.generateRetryStrategy()({
        scalingDuration: 2000,
        excludedStatusCodes: [500]
      })),
      catchError(this.handleError));
  }

  getAllStops() {
    return this.http.get(this.baseUrl + '/getStops.php')
  }

  getAllLoops() {
    return this.http.get(this.baseUrl + '/getLoops.php')
  }

  private generateRetryStrategy() {
    var retryStrategy = ({
      maxRetryAttempts = 15,
      scalingDuration = 1000,
      excludedStatusCodes = []
    }: {
      maxRetryAttempts?: number,
      scalingDuration?: number,
      excludedStatusCodes?: number[]
    } = {}) => (attempts: Observable<any>) => {
      return attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          // if maximum number of retries have been met
          // or response is a status code we don't wish to retry, throw error
          if (
            retryAttempt > maxRetryAttempts ||
            excludedStatusCodes.find(e => e == error.status)
          ) {
            return this.handleError(error);
          }
          // console.log( //uncomment for demonstration
          //   `Attempt ${retryAttempt}: retrying in ${retryAttempt *
          //     scalingDuration}ms`
          // );
          return timer(retryAttempt * scalingDuration);
        }),
        finalize(() => console.log('Entry has been successfully added!'))
      );
    };
    return retryStrategy;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
}
