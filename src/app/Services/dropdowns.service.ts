import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownsService {
  baseUrl: string;

  private busNumberSource = new BehaviorSubject<string>('Select a Bus');
  currentBusNumber = this.busNumberSource.asObservable();

  private driverNameSource = new BehaviorSubject<string>('Select Your Name');
  currentDriver = this.driverNameSource.asObservable();

  private loopNameSource = new BehaviorSubject<string>('Select a Loop');
  currentLoop = this.loopNameSource.asObservable();

  constructor(private logService: LogService, private http: HttpClient) {
    this.baseUrl = this.logService.baseUrl;
   }

  getAllStops(selectedLoop: string) {
    return this.http.get(this.baseUrl + '/getStops.php?searchTerm=' + selectedLoop)
    .pipe(
      retryWhen(this.generateRetryStrategy()({
        scalingDuration: 1000,
        excludedStatusCodes: [500]
      })),
      catchError(this.handleError));
  }

  getAllLoops() {
    return this.http.get(this.baseUrl + '/getLoops.php')
    .pipe(
      retryWhen(this.generateRetryStrategy()({
        scalingDuration: 1000,
        excludedStatusCodes: [500]
      })),
      catchError(this.handleError));
  }

  getDrivers() {
    return this.http.get(this.baseUrl + '/getUsers.php')
    .pipe(
      retryWhen(this.generateRetryStrategy()({
        scalingDuration: 1000,
        excludedStatusCodes: [500]
      })),
      catchError(this.handleError));
  }

  getBusNumbers() {
    return this.http.get(this.baseUrl + '/getBusNumbers.php')
    .pipe(
      retryWhen(this.generateRetryStrategy()({
        scalingDuration: 1000,
        excludedStatusCodes: [500]
      })),
      catchError(this.handleError));
  }

  changeBus(message: string) {
    this.busNumberSource.next(message);
  }

  changeDriver(message: string) {
    this.driverNameSource.next(message);
  }

  changeLoop(message: string) {
    this.loopNameSource.next(message);
  }

  private generateRetryStrategy() {
    const retryStrategy = ({
      maxRetryAttempts = 3,
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
            retryAttempt === maxRetryAttempts ||
            excludedStatusCodes.find(e => e === error.status)
          ) {
            return this.handleError(error);
          }
          console.log( // uncomment for demonstration
            `Attempt ${retryAttempt}: retrying in ${retryAttempt *
            scalingDuration}ms`
          );
          return timer(retryAttempt * scalingDuration);
        }),
        // finalize(() => (console.log('Error! something went wrong.')))
      );
    };
    return retryStrategy;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
}
