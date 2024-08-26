import {Injectable} from '@angular/core';
import {User} from "./user.model";
import {LoginUser} from "./login/login-user.model";
import {RegisterUser} from "./register/register-user.model";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {DialogData} from "../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogData} from "../dialogs/error-dialog/error-dialog-data.model";
import {NgForm} from "@angular/forms";
import {environment} from 'src/environments/environment';
import {tap} from 'rxjs';
import {TokenInfo} from "./token-info.model";
import {jwtDecode} from "jwt-decode";
import {JwtDecoded} from "./jwt-decoded.model";
import {RefreshTokenReq} from "./refresh-token-req.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersUrl = environment.backendUrl + '/users';

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  private _user: User;
  private _tokenInfo: TokenInfo;

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  get tokenInfo() {
    return this._tokenInfo;
  }

  set tokenInfo(token: TokenInfo) {
    this._tokenInfo = token;
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
      this.tokenInfo = null;
      this.user = null;
    }
  }

  register(registerUser: RegisterUser) {
    return this.http.post(this.usersUrl + '/registration/customer', registerUser).pipe(tap(() => {
      let dialogData: DialogData = {
        title: 'Registration completed!',
        description: 'Please, check your email'
      };
      this.dialog.open(DialogComponent, {data: dialogData});
    }));
  }

  activateAccount(token: string) {
    let httpParams = new HttpParams()
      .set('token', token);
    let options = {params: httpParams};
    return this.http.post<TokenInfo>(environment.backendUrl + '/keycloak/realms/e-commerce/users/enable', {}, options)
      .pipe(tap(tokenInfo => this.authUser(tokenInfo)));
  }

  login(loginUser: LoginUser) {
    loginUser = {
      username: loginUser.username,
      password: loginUser.password,
      grant_type: 'password',
      client_id: 'ecommerce-api',
      client_secret: 'ecommerce-api-secret'
    }
    let body = new URLSearchParams();
    Object.entries(loginUser).forEach(([name, value]) => body.set(name, value));
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    let options = { headers: headers };

    this.http.post<TokenInfo>(environment.backendUrl + '/keycloak/realms/e-commerce/protocol/openid-connect/token', body, options)
      .subscribe(tokenInfo => this.authUser(tokenInfo));
  }

  resetPassword() {
    const dialogData: DialogData = {
      title: 'Password reset',
      description: '',
      note: 'After clicking “Reset”, you will receive an email with following steps',
      inputs: ['email'],
      buttonName: 'Reset'
    }
    const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((form: NgForm) => {
      console.log('result', form.value);
    });
  }

  logout() {
    this.user = null;
    this.tokenInfo = null;
    localStorage.removeItem("tokenInfo");
    this.router.navigate(['/', 'account', 'login']);
  }



  private authUser(tokenInfo: TokenInfo) {
    this.tokenInfo = tokenInfo;
    let decodedToken: JwtDecoded = this.getDecodedAccessToken(tokenInfo.access_token);
    let tokenTimeoutInMs = decodedToken.exp * 1000 - (new Date()).getTime();

    this.setTokenRefresh(tokenTimeoutInMs);
    this.setAutoLogout(tokenTimeoutInMs);

    localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));

    this.user = {
      name: '',
      surname: '',
      email: decodedToken.preferred_username,
      roles: decodedToken.realm_access.roles
    };

    this.router.navigate(['/', 'account']);
  }

  private setTokenRefresh(tokenTimeoutInMs: number) {
    setTimeout(() => {
      //refresh token
      let refreshTokenReq: RefreshTokenReq = {
        grant_type: "refresh_token",
        refresh_token: this.tokenInfo.refresh_token,
        client_id: 'ecommerce-api',
        client_secret: 'ecommerce-api-secret'
      }
      let body = new URLSearchParams();
      Object.entries(refreshTokenReq).forEach(([name, value]) => body.set(name, value));
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
      let options = { headers: headers };
      this.http.post<TokenInfo>(environment.backendUrl + '/keycloak/embedded/realms/e-commerce/protocol/openid-connect/token', body, options)
        .subscribe(tokenInfo => this.authUser(tokenInfo));
    }, tokenTimeoutInMs - 120_000)
  }

  private setAutoLogout(tokenTimeoutInMs: number) {
    let oldToken = this.tokenInfo.access_token;
    setTimeout(() => {
      if (oldToken === this.tokenInfo.access_token) {
        let dialogData: DialogData = {
          title: 'Token expiration',
          description: 'You will be logged out in 60 seconds, unless you relogin'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
        setTimeout(() => oldToken === this.tokenInfo.access_token ? this.logout() : 0, 60_000);
      }
    }, tokenTimeoutInMs - 60_000);
  }

  private getDecodedAccessToken(token: string) {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
}
