import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../auth/auth.service";

export const employeeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.user().roles && (authService.user().roles.includes('EMPLOYEE') || authService.user().roles?.includes('ADMIN'));
}
