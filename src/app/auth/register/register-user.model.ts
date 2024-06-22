import {LoginUser} from "../login/login-user.model";

export interface RegisterUser extends LoginUser {
  firstname: string,
  surname: string,
  isAdult: boolean,
}
