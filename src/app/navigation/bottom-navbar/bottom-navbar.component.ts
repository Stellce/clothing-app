import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent {
  constructor(private authService: AuthService) {}

  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Dashboard', 'Search', 'Account', 'Favorites', 'Cart'];

  buildLink(link: string): string {
    return link === 'Account' && !this.authService.user ? 'register' : link;
  }
}
