import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../Models/user';
import {printLine} from 'tslint/lib/verify/lines';
import {emit} from 'cluster';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        const body = {
            'grant_type': 'password',
            'client_id': 2,
            'client_secret': 'kUltLEB0nM9pEQfIFNd7BSrWycDp0DPM1Fq6kQ2T',
            'username': email,
            'password': password,
            'scope': '*'
        };
        const url = environment.BASE_API_URL + '/oauth/token';
        return this.http.post<any>(
            url,
            body
            )
            .pipe(map(response => {
                if ('access_token' in response) {
                    const user = new User(email, password, response['access_token']);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);

                } else {
                    return null;
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
