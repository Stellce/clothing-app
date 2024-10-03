import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.tokenInfo;
    if (!token) return next.handle(req);

    const authBearerToken = 'Bearer ' + token().access_token;
    const authReq = req.clone({setHeaders: { Authorization: authBearerToken }});

    return next.handle(authReq);
  }
}
