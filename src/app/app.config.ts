import {importProvidersFrom, provideExperimentalZonelessChangeDetection} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth.interceptor";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {provideClientHydration} from "@angular/platform-browser";
import {provideAnimations} from "@angular/platform-browser/animations";

//delete stroke-dasharray: 0 !important; and animation:none !important

export const appConfig = {
  providers: [
    importProvidersFrom(MatDialogModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideExperimentalZonelessChangeDetection()
  ]
}
