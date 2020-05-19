import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../Services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            let errorMessage: string;

            if (err.status === 401) {
                errorMessage = 'You aren\'t authorized to see that';
            } else if (err.status === 403) {
                errorMessage = 'Your password or username is incorrect.';
            } else if (err.status === 504) {
                errorMessage = 'Oops, it looks like you don\'t have internet.';
            } else {
                errorMessage = 'An unknown error has occurred.';
            }
            return throwError(errorMessage);
        }));
    }
}
