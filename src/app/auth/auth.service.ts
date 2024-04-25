import { Injectable } from '@angular/core';
import {User} from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  constructor() { }

  get user() {
    return this._user;
  }

  logout() {

  }
}
