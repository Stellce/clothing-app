import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() {}

  buildLink(link: string): string[] {
    let finalLink = ['/'];
    let linkPart = [link.toLowerCase()]
    finalLink.push(...linkPart);
    return finalLink;
  }
}
