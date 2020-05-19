import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {LogService} from './log.service';
import {BehaviorSubject, Observable, throwError, timer} from 'rxjs';
import {catchError, mergeMap, retryWhen} from 'rxjs/operators';
import {Bus} from '../Models/bus';
import {Loop} from '../Models/loop';
import {User} from '../Models/user';
import {Driver} from '../Models/driver';

@Injectable({
  providedIn: 'root'
})

export class DropdownsService {
  baseUrl: string;

  currentUser = <User> JSON.parse(localStorage.getItem('currentUser'));

  options = {
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.currentUser.token),
  };

  stops = [];

  private busNumberSource = new BehaviorSubject<Bus>(new Bus('0', 'Select a Bus'));
  currentBusNumber = this.busNumberSource.asObservable();

  private driverNameSource = new BehaviorSubject<Driver>(new Driver(0, 'Select your Name', ''));
  currentDriver = this.driverNameSource.asObservable();

  private loopNameSource = new BehaviorSubject<Loop>(new Loop('Select a loop', '0'));
  currentLoop = this.loopNameSource.asObservable();

  private busDropdownSource = new BehaviorSubject<Bus[]>([]);
  currentBusDropdown = this.busDropdownSource.asObservable();

  private loopDropdownSource = new BehaviorSubject<Loop[]>([]);
  currentLoopDropdown = this.loopDropdownSource.asObservable();

  private driverDropdownSource = new BehaviorSubject<Driver[]>([]);
  currentDriverDropdown = this.driverDropdownSource.asObservable();

  constructor(private logService: LogService, private http: HttpClient) {
    this.baseUrl = this.logService.baseUrl;
  }

  changeBus(message: Bus) {
    this.busNumberSource.next(message);
  }

  changeDriver(message: Driver) {
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

  changeDriverDropdown(message: Driver[]) {
    this.driverDropdownSource.next(message);
  }

  getAllStops(selectedLoop: string) {
    return this.http.get(this.baseUrl + '/api/loops/' + selectedLoop + '/stops', this.options)
      .pipe(
        retryWhen(this.generateRetryStrategy()({
          scalingDuration: 1000,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError));
  }

  getAllLoops() {
    return this.http.get(this.baseUrl + '/api/loops', this.options)
      .pipe(
        retryWhen(this.generateRetryStrategy()({
          scalingDuration: 1000,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError));
  }

  getDrivers() {
    return this.http.get(this.baseUrl + '/api/drivers', this.options)
      .pipe(
        retryWhen(this.generateRetryStrategy()({
          scalingDuration: 1000,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError));
  }

  getBusNumbers() {
    return this.http.get(this.baseUrl + '/api/buses', this.options)
      .pipe(
        retryWhen(this.generateRetryStrategy()({
          scalingDuration: 1000,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError));
  }

  private generateRetryStrategy() {
    return ({
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
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
}
