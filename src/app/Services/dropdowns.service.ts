import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, catchError } from 'rxjs/operators';
import { Bus } from '../Models/bus';
import { Loop } from '../Models/loop';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class DropdownsService {
  baseUrl: string;

  // These behavior subjects communicate the data between components.
  // When one is updated, it's reflected in all places it's used.
  private busNumberSource = new BehaviorSubject<Bus>(new Bus('0', 'Select a Bus'));
  currentBusNumber = this.busNumberSource.asObservable();

  private driverNameSource = new BehaviorSubject<User>(new User('0', 'Select your Name'));
  currentDriver = this.driverNameSource.asObservable();

  private loopNameSource = new BehaviorSubject<Loop>(new Loop('Select a loop', '0'));
  currentLoop = this.loopNameSource.asObservable();

  private busDropdownSource = new BehaviorSubject<Bus[]>([]);
  currentBusDropdown = this.busDropdownSource.asObservable();

  private loopDropdownSource = new BehaviorSubject<Loop[]>([]);
  currentLoopDropdown = this.loopDropdownSource.asObservable();

  private driverDropdownSource = new BehaviorSubject<User[]>([]);
  currentDriverDropdown = this.driverDropdownSource.asObservable();

  constructor(private logService: LogService, private http: HttpClient) {
    this.baseUrl = this.logService.baseUrl;
  }

  // These handle modifications to the behavior subjects
  changeBus(message: Bus) {
    this.busNumberSource.next(message);
  }

  changeDriver(message: User) {
    this.driverNameSource.next(message);
  }

  changeLoop(message: Loop) {
    this.loopNameSource.next(message);
  }

  changeBusDropdown(message: Bus[]) {
    this.busDropdownSource.next(message);
  }

  changeLoopDropdown(message: Loop[]) {
    this.loopDropdownSource.next(message);
  }

  changeDriverDropdown(message: User[]) {
    this.driverDropdownSource.next(message);
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
