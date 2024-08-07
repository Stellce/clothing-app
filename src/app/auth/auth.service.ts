import { Injectable } from '@angular/core';
import {User} from "./user.model";
import {LoginUser} from "./login/login-user.model";
import {RegisterUser} from "./register/register-user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DialogData} from "../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogData} from "../dialogs/error-dialog/error-dialog-data.model";
import {NgForm} from "@angular/forms";
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  private _token: string = '';
  usersUrl = environment.backendUrl + '/users';
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  get token() {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  login(loginUser: LoginUser) {
    this.user = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@email.com'
    }
    this.token = 'token'
    this.router.navigate(['/', 'account']);
  }

  register(registerUser: RegisterUser) {
    // this.user = {
    //   name: 'John',
    //   surname: 'Doe',
    //   email: 'john.doe@email.com'
    // }
    // this.router.navigate(['/', 'account']);

    return this.http.post(this.usersUrl + '/registration/customer', registerUser).pipe(tap(res => {
      let dialogData: DialogData = {title: 'Registration completed!', description: 'Please, check your email'};
      this.dialog.open(DialogComponent, {data: dialogData});
    }));
  }

  logout() {
    this.user = null;
    this.router.navigate(['/', 'account', 'login']);
  }

  activate(token: string) {
    return this.http.post(environment.backendUrl + '/keycloak/users/activate?token=' + token, {}).pipe(tap(res => {
      let dialogData: DialogData = {
        title: 'Welcome!',
        description: 'Account activated!'
      }
      this.dialog.open(DialogComponent, {data: dialogData})
    }));
  }

  openDialog() {
    let dialogData: DialogData = {
      title: 'Title',
      description: 'Description'
    }
    this.dialog.open(DialogComponent, {data: dialogData});
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

  openErrorDialog(errorCode: string) {
    let dialogData: ErrorDialogData = {
      title: 'Title',
      description: 'Description',
      errorCode
    }
    this.dialog.open(DialogComponent, {data: dialogData});
  }

}
