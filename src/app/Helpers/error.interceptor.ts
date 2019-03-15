import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../Services/authentication.service';
import { stringify } from '@angular/core/src/util';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            let errorMessage: string;

            if (err.status === 401) {
                this.authenticationService.logout();
                // tslint:disable-next-line: deprecation
                location.reload(true);
            } else if (err.status === 403) {
                errorMessage = 'Your password or username is incorrect.'
            } else if (err.status === 504) {
                errorMessage = 'Oops, you don\'t have internet or the server is down. :/';
            } else {
                errorMessage = 'An unknown error has ocurred.';
            }
            return throwError(errorMessage);
        }));
    }
}
