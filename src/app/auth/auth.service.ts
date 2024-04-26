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

  login(loginUser: LoginUser) {
    this.user = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@email.com'
    }
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
  }


}
