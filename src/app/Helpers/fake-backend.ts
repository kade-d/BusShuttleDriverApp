import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../Models/user';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, username: 'shuttle', password: 'bus', firstName: 'Test', lastName: 'User' }
        ];

        const loops = {'data': ['Green Loop', 'Red Loop', 'Blue Loop', 'Orange Loop', 'Demand Response', 'Sunday Orange']};
        const stops = {'data': ['North Shelter - N', 'Anthony - N', 'Alumni', 'Stadium', 'Scheidler 1', 'Scheidler 2', 'Scheidler 3',
        'Baseball Field', 'Anthony - South', 'North Shelter - South', 'LaFollette - South', 'Shafer Tower - South', 'AJ', 'Burkhardt',
        'South Shelter', 'Ashland', 'MU', 'Shafer Tower - North', 'LaFollette - North']};

        const drivers = {'data': [{'firstname': 'Ron', 'lastname': 'Swanson'}, {'firstname': 'Steven', 'lastname': 'Meyers'},
        {'firstname': 'Sarah', 'lastname': 'Thompson'}, {'firstname': 'Jeff', 'lastname': 'Bezos'}]};

        const log = {stop: 'Burkhardt', timestamp:'asdfasf', loop: 'Red Loop', driver: 'Steven Meyers', boarded: 1, leftBehind: 0, busNumber: 903};
        const buses = {'data': ['930', '931', '935']};

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        console.log('BACKEND-LESS BUILD - FOR PRODUCTION, DISABLE THE BACKEND INTERCEPTOR');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) { return error('Username or password is incorrect'); }
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: `fake-jwt-token`
                });
            }

            // // get all users
            // if (request.url.endsWith('/users') && request.method === 'GET') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(users);
            // }

            // // get all loops
            // if (request.url.endsWith('/getLoops.php') && request.method === 'GET') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(loops);
            // }

            // // get all stops
            // if (request.url.endsWith('/getStops.php?searchTerm=Green Loop') && request.method === 'GET') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(stops);
            // }

            // // get all drivers
            // if (request.url.endsWith('/getUsers.php') && request.method === 'GET') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(drivers);
            // }

            // // get all buses
            // if (request.url.endsWith('/getBusNumbers.php') && request.method === 'GET') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(buses);
            // }

            // // Store Log
            // if (request.url.endsWith('/store') && request.method === 'POST') {
            //     if (!isLoggedIn) { return unauthorised(); }
            //     return ok(log);
            // }

            // pass through any requests not handled above
            return next.handle(request);
        }))
        // call materialize and dematerialize to ensure delay even if an
        // error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
