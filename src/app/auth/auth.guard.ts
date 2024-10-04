import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (!!authService.user()) {
    return true
  } else {
    const router = inject(Router);
    router.navigate(['account','register'], {queryParams: route.queryParams});
    return false
  }

}
