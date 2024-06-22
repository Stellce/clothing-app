import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import {provideRouter} from "@angular/router";
import {routes} from "./app/routes";
import {importProvidersFrom} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatDialogModule),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));
