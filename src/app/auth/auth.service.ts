import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {afterNextRender, inject, Injectable, Injector, signal, WritableSignal} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {finalize, firstValueFrom, Observable, switchMap, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {DialogData} from "../shared/dialog/dialog-data.model";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {GoogleJwtDecoded, JwtDecoded} from "./jwt-decoded.model";
import {LoginUser} from "./login/login-user.model";
import {RefreshTokenReq} from "./refresh-token-req.model";
import {RegisterUser} from "./register/register-user.model";
import {TokenInfo} from "./token-info.model";
import {User} from "./user.model";
import {DialogService} from "../shared/dialog/dialog.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleLoginUrl = environment.backendUrl + '/oauth2/login/google';

  user: WritableSignal<User> = signal<User>(null);
  tokenInfo: WritableSignal<TokenInfo> = signal<TokenInfo>(null);
  passwordRecoveryTimeout = 0;
  private injector = inject(Injector);

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  loginGoogle(code: string) {
    const formData = new FormData();
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    this.http.post<TokenInfo>(this.googleLoginUrl, formData).subscribe({
      next: tokenInfo => this.authUser({...tokenInfo, access_token: tokenInfo.id_token}),
      error: err => {
        const data: DialogData = {
          title: 'Error on login occurred',
          description: `Please, try again later`
        }
        this.dialog.open(DialogComponent, {data});
        console.error(err['status'], err);
      }
    });
  }

  autoAuth() {
    let tokenInfo: TokenInfo = JSON.parse(localStorage?.getItem("tokenInfo"));
    if (!tokenInfo) return;
    let decodedToken = jwtDecode(tokenInfo.access_token);
    let tokenTimeoutInMs = decodedToken.exp * 1000 - (new Date()).getTime();
    if (tokenTimeoutInMs > 0) {
      this.authUser(tokenInfo);
    } else {
      localStorage?.removeItem("tokenInfo");
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
    }));
  }

  activationResend(email: string): Observable<Object> {
    let resend = (email: string) => {
      let params = new HttpParams();
      params = params.append('email', email);
      return this.http.post(environment.backendUrl + '/oauth2/registration/customer/resend-email', {}, {params})
    }

    let dialogData: DialogData = {
      title: 'Please, provide your email',
      description: 'You will receive a new email with an activation link',
      inputs: [{name: 'email', defaultValue: email}],
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

    return this.http.post<TokenInfo>(environment.backendUrl + '/oauth2/login/basic', body, options)
      .pipe(tap(tokenInfo => this.authUser(tokenInfo)));
  }

  async sendPasswordRecovery(defaultEmail: string | undefined) {
    if (this.passwordRecoveryTimeout) {
      const data: DialogData = {
        title: 'Password recovery',
        description: `Password recovery will be available in ${this.passwordRecoveryTimeout} seconds`
      }
      this.dialog.open(DialogComponent, {data});
      return;
    }

    const askForEmail = async () => {
      const dialogData: DialogData = {
        title: 'Password reset',
        note: 'After clicking “Reset”, you will receive an email with next steps',
        inputs: [{name: 'email', defaultValue: defaultEmail}],
        buttonName: 'Reset'
      }
      const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});
      const form: NgForm = await firstValueFrom(dialogRef.afterClosed())
      return form?.value?.email;
    }
    const setLoadingIfNotRespondedInMs = (ms: number) => {
      setTimeout(() => {
        if (!responded) {
          loadingDialog = this.dialogService.createLoadingDialog();
        }
      }, ms);
    }

    const email: string = await askForEmail();
    if (!email) return;

    let loadingDialog: MatDialogRef<DialogComponent> = null;
    let responded = false;
    setLoadingIfNotRespondedInMs(300);

    const params = new HttpParams().set('email', email);
    this.http.post(environment.backendUrl + '/oauth2/users/recover-password', {}, {params})
      .pipe(finalize(() => {
        responded = true;
        loadingDialog?.close();
      }))
      .subscribe({
        next: () => {
          this.passwordRecoveryTimeout = 15;
          const interval = setInterval(() => {
            if (this.passwordRecoveryTimeout) this.passwordRecoveryTimeout--;
            else clearInterval(interval);
          }, 1000);

          const dialogData: DialogData = {
            title: 'Check your email!',
            description: 'Recovery password email successfully sent!'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        },
        error: err => {
          const status = err['status'];
          const description = status === 404
            ? `Account does not exist`
            : status === 403
              ? `Account is not activated`
              : `Try again later.`;
          const dialogData: DialogData = {
            title: `Cannot recover password`,
            description
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        }
      });
  }

  recoverPassword(password: string, token: string) {
    const params = new HttpParams().set('token', token).set('password', password);
    return this.http.post(environment.backendUrl + '/oauth2/users/recover-password', {}, {params});
  }

  logout() {
    this.user.set(null);
    this.tokenInfo.set(null);
    afterNextRender(() => {
      localStorage?.removeItem("tokenInfo");
    }, {injector: this.injector});
    this.router.navigate(['/', 'account', 'login']);
  }

  errorsOnPasswordValidation(password: string) {
    const errorMessages = [];
    if (password.length < 8) errorMessages.push('Password must be at least 8 characters long');
    if (!/([A-Z])/.test(password)) errorMessages.push('Password must contain Uppercase letters');
    if (!/([a-z])/.test(password)) errorMessages.push('Password must contain Lowercase letters');
    if (!/(?=.*\d)/.test(password)) errorMessages.push('Password must contain digits');
    return errorMessages;
  }



  private authUser(tokenInfo: TokenInfo) {
    this.tokenInfo.set(tokenInfo);
    let decodedToken: JwtDecoded | GoogleJwtDecoded = this.getDecodedAccessToken(tokenInfo.access_token);
    let tokenTimeoutInMs = decodedToken.exp * 1000 - (new Date()).getTime();

    this.setTokenRefresh(tokenTimeoutInMs);
    this.setAutoLogout(tokenTimeoutInMs);

    afterNextRender(() => {
      localStorage?.setItem("tokenInfo", JSON.stringify(tokenInfo));
    }, {injector: this.injector});

    const email = decodedToken.iss.includes('google') ? decodedToken.email : decodedToken.sub.split(':')[2];

    const user: User = {
      name: decodedToken.name,
      lastname: decodedToken.lastname,
      email,
      roles: decodedToken.realm_access?.['roles'],
    }

    this.user.set(user);
    afterNextRender(() => {
      let url = window.location.href;
      if(url.includes('register') || url.includes('login')) this.router.navigate(['/', 'account']);
    }, {injector: this.injector});
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
          .subscribe({
            next: tokenInfo => this.authUser(tokenInfo),
            error: err => {
              console.error(err['status'], err);
              const data: DialogData = {
                title: 'Session refresh went wrong',
                description: `Please, try to login again. Your session will be inactive in 2 minutes`
              }
              this.dialog.open(DialogComponent, {data});
            }
          });
      }
    }, tokenTimeoutInMs - 120_000);
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
