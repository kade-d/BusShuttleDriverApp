import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { routing } from './app.routing';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
// used to create fake backend
import { ErrorInterceptor } from './Helpers/error.interceptor';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ConfigureComponent } from './configure/configure.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PostInspectionComponent } from './post-inspection/post-inspection.component';
import { PreInspectionComponent } from './pre-inspection/pre-inspection.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ConfigureComponent,
    ConfirmationComponent,
    PostInspectionComponent,
    PreInspectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    routing,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
