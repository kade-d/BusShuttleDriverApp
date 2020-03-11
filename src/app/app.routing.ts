import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ConfigureComponent } from './configure/configure.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guards/auth.guard';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PostInspectionComponent } from './post-inspection/post-inspection.component';

const appRoutes: Routes = [
    {
        path: '',
        component: ConfigureComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'configure',
        component: ConfigureComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'form',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'confirmation',
        component: ConfirmationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post-inspection',
        component: PostInspectionComponent,
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
