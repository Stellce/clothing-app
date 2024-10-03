import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private authService: AuthService
  ) { }

  buildLink(link: string): string[] {
    let finalLink = ['/'];
    let linkPart = link === 'Account' && !this.authService.user() ?
      ['account', 'register'] : [link.toLowerCase()];
    finalLink.push(...linkPart);
    return finalLink;
  }
}
