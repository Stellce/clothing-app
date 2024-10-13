import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, signal, WritableSignal } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogData } from "../dialogs/dialog/dialog-data.model";
import { DialogComponent } from "../dialogs/dialog/dialog.component";
import { GoogleJwtDecoded, JwtDecoded } from "./jwt-decoded.model";
import { LoginUser } from "./login/login-user.model";
import { RefreshTokenReq } from "./refresh-token-req.model";
import { RegisterUser } from "./register/register-user.model";
import { TokenInfo } from "./token-info.model";
import { User } from "./user.model";
import {PurchaseData} from "./purchase-data.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  purchaseData: WritableSignal<PurchaseData> = signal({
    deliveryAddress: 'st. ExampleStreet, 12/3 45-678, ExmpleCity, ExampleWoiwodeship',
    deliveryMethod: 'Parcel locker',
    paymentMethod: 'Card',
    discountCode: '2547',
    wishes: 'Fragile'
  });
  googleLoginUrl = environment.backendUrl + '/oauth2/login/google';

  user: WritableSignal<User> = signal<User>(null);
  tokenInfo: WritableSignal<TokenInfo> = signal<TokenInfo>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  loginGoogle(code: string) {
    const formData = new FormData();
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    this.http.post<TokenInfo>(this.googleLoginUrl, formData).subscribe(
      tokenInfo => this.authUser({...tokenInfo, access_token: tokenInfo.id_token})
    );
  }

  autoAuth() {
    let tokenInfo: TokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
    if (!tokenInfo) return;
    let decodedToken = jwtDecode(tokenInfo.access_token);
    let tokenTimeoutInMs = decodedToken.exp * 1000 - (new Date()).getTime();
    if (tokenTimeoutInMs > 0) {
      this.authUser(tokenInfo);
    } else {
      localStorage.removeItem("tokenInfo");
      this.tokenInfo.set(null);
      this.user.set(null);
    }
  }

  register(registerUser: RegisterUser) {
    return this.http.post(environment.backendUrl + '/oauth2/registration/customer', registerUser).pipe(tap(() => {
      let dialogData: DialogData = {
        title: 'Registration completed!',
        description: 'Please, check your email'
      };
      this.dialog.open(DialogComponent, {data: dialogData});
    }), catchError(() => {
      let dialogData: DialogData = {
        title: 'Registration failed!',
        description: ''
      };
      this.dialog.open(DialogComponent, {data: dialogData});
      return of('something happened');
    }));
  }

  activationResend(email: string): Observable<Object> {
    let resend = (email: string) => {
      let params = new HttpParams();
      params = params.append('email', email);
      return this.http.post(environment.backendUrl + '/oauth2/registration/customer/resend-email', {}, {params})
    }

    if (email) return resend(email);
    let dialogData: DialogData = {
      title: 'Please, provide your email',
      description: 'You will receive a new email with an activation link',
      inputs: [{name: 'email'}],
      buttonName: 'Resend'
    }
    const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});
    return dialogRef.afterClosed().pipe(switchMap(
      (form: NgForm) => {
        return resend(form.value.email);
      }
    ));
  }

  activateAccount(token: string) {
    let httpParams = new HttpParams()
      .set('token', token);
    let options = {params: httpParams};
    return this.http.post<TokenInfo>(environment.backendUrl + '/oauth2/registration/customer/activate-account', {}, options)
      .pipe(tap(tokenInfo => this.authUser(tokenInfo)));
  }

  login(loginUser: LoginUser) {
    loginUser = {
      username: loginUser.username,
      password: loginUser.password,
      grant_type: 'password'
    }
    let body = new URLSearchParams();
    Object.entries(loginUser).forEach(([name, value]) => body.set(name, value));
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    let options = { headers: headers };

    this.http.post<TokenInfo>(environment.backendUrl + '/oauth2/login/basic', body, options)
      .subscribe(tokenInfo => this.authUser(tokenInfo));
  }

  resetPassword() {
    const dialogData: DialogData = {
      title: 'Password reset',
      description: '',
      note: 'After clicking “Reset”, you will receive an email with following steps',
      inputs: [{name: 'email'}],
      buttonName: 'Reset'
    }
    const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((form: NgForm) => {
      console.log('result', form.value);
    });
  }

  logout() {
    this.user.set(null);
    this.tokenInfo.set(null);
    localStorage.removeItem("tokenInfo");
    this.router.navigate(['/', 'account', 'login']);
  }



  private authUser(tokenInfo: TokenInfo) {
    this.tokenInfo.set(tokenInfo);
    let decodedToken: JwtDecoded | GoogleJwtDecoded = this.getDecodedAccessToken(tokenInfo.access_token);
    console.log('decodedToken', decodedToken);
    let tokenTimeoutInMs = decodedToken.exp * 1000 - (new Date()).getTime();

    this.setTokenRefresh(tokenTimeoutInMs);
    this.setAutoLogout(tokenTimeoutInMs);

    localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));

    const user: User = {
      name: decodedToken['name'],
      lastname: decodedToken['lastname'],
      email: decodedToken['email'],
      roles: decodedToken.realm_access?.['roles'] || null,
    }

    this.user.set(user);
    this.router.navigate(['/', 'account']);
  }

  private setTokenRefresh(tokenTimeoutInMs: number) {
    setTimeout(() => {
      let refreshTokenReq: RefreshTokenReq = {
        grant_type: "refresh_token",
        refresh_token: this.tokenInfo().refresh_token
      }
      let body = new URLSearchParams();
      Object.entries(refreshTokenReq).forEach(([name, value]) => body.set(name, value));
      let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
      let options = { headers: headers };
      let decodedToken: JwtDecoded = this.getDecodedAccessToken(this.tokenInfo().access_token);
      if (decodedToken.iss.includes('google')) {
        this.refreshGoogleToken();
      } else {
        this.http.post<TokenInfo>(environment.backendUrl + '/oauth2/login/basic', body, options)
          .subscribe(tokenInfo => this.authUser(tokenInfo));
      }
    }, tokenTimeoutInMs - 120_000)
  }

  private setAutoLogout(tokenTimeoutInMs: number) {
    let oldToken = this.tokenInfo().access_token;
    setTimeout(() => {
      if (oldToken === this.tokenInfo().access_token) {
        let dialogData: DialogData = {
          title: 'Token expiration',
          description: 'You will be logged out in 60 seconds, unless you relogin'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
        setTimeout(() => oldToken === this.tokenInfo().access_token ? this.logout() : 0, 60_000);
      }
    }, tokenTimeoutInMs - 60_000);
  }

  private getDecodedAccessToken(token: string) {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private refreshGoogleToken() {
    const formData = new FormData();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', this.tokenInfo().refresh_token);
    return this.http.post<TokenInfo>(this.googleLoginUrl, formData)
      .pipe(
        tap(
          tokenInfo => this.authUser({...tokenInfo, access_token: tokenInfo.id_token})
        )
      );
  }
}
