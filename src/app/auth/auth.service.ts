import { Injectable } from '@angular/core';
import {User} from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  constructor() {}

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  login() {
    this.user = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@email.com'
    }
  }

  logout() {
    this.user = {} as User;
  }


}
