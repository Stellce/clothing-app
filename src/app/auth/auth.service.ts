import { Injectable } from '@angular/core';
import {User} from "./user.model";
import {LoginUser} from "./login/login-user.model";
import {RegisterUser} from "./register/register-user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  private _token: string = '';
  constructor(
    private http: HttpClient,
    private router: Router
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
    this.user = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@email.com'
    }
    this.router.navigate(['/', 'account']);
  }

  logout() {
    this.user = {} as User;
    this.router.navigate(['/', 'login']);
  }


}
