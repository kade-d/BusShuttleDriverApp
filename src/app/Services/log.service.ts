import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retryWhen, catchError } from 'rxjs/operators';
import { Observable, throwError, timer, BehaviorSubject } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { Log } from '../Models/log';
import { Stop } from '../Models/stop';
import { Loop } from '../Models/loop';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseUrl = 'https://www.mildvariety.club/api';
  logsToSend: Log[] = [];
  stops: Stop[];
  loops: Loop[];

  private syncMessageSource = new BehaviorSubject<string>('Syncing, please do not close this page.');
  currentSyncMessage = this.syncMessageSource.asObservable();

  private syncCountSource = new BehaviorSubject<number>(0);
  currentSyncCount = this.syncCountSource.asObservable();

  constructor(private http: HttpClient) {
    const logs: Log[] = JSON.parse(localStorage.getItem('logs'));
    if (logs !== null) {
      this.changeSyncCount(logs.length);
    }

  }

  changeSyncMessage(message: string) {
    this.syncMessageSource.next(message);
  }

  changeSyncCount(count: number) {
    this.syncCountSource.next(count);
  }

  storeLogsLocally(log: Log) {
    this.logsToSend.push(log);
    localStorage.setItem('logs', JSON.stringify(this.logsToSend));
    if(this.logsToSend === null) {
      return;
    } else {
      this.changeSyncCount(this.logsToSend.length);
    }
  }

  syncLogs() {
    const logs: Log[] = JSON.parse(localStorage.getItem('logs'));
    
    if (logs === null || logs.length === 0 || logs === undefined) {
      this.changeSyncMessage('All caught up. Nothing to sync!');
      return;
    }
    this.changeSyncMessage('Syncing, please do not close this page.');

    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      this.store(log)
        .subscribe((success) => {
          console.log(success);
          logs.pop();
          this.changeSyncCount(logs.length);
          console.log("length is " + logs.length);

          console.log(logs.length);
          if (logs.length === 0) {
            this.changeSyncMessage('All done! Have a wonderful day!');
            localStorage.clear();
            this.logsToSend = [];
          }
        },
        (err: any) => {
          this.changeSyncMessage('There was an error. Please notify your supervisor.');
        });
    }
  }

  store(log: Log): Observable<Log> {
    return this.http.post<Log>(this.baseUrl + '/store', { data: log })
      .pipe(
        retryWhen(this.generateRetryStrategy()({
          scalingDuration: 1000,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError));
  }

  private generateRetryStrategy() {
    const retryStrategy = ({
      maxRetryAttempts = 50,
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
        finalize(() => console.log('Entry has been successfully added!'))
      );
    };
    return retryStrategy;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
}
