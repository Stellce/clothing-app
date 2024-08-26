import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return !!authService.user;
}
