import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent {
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Dashboard', 'Search', 'Account', 'Favorites', 'Cart'];

  constructor(private authService: AuthService) {}

  buildLink(link: string): string[] {
    let finalLink = ['/'];
    let linkPart = link === 'Account' && !this.authService.user ?
      ['account', 'register'] : [link.toLowerCase()];
    finalLink.push(...linkPart);
    return finalLink;
  }
}
