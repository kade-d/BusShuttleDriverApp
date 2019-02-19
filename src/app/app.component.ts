import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './Services/authentication.service';
import { User } from './Models/user';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private swUpdate: SwUpdate
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    OnInit() {
        if (this.swUpdate.isEnabled) {

            this.swUpdate.available.subscribe(() => {

                if(confirm("New version available. Load New Version?")) {

                    window.location.reload();
                }
            });
        }        
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
