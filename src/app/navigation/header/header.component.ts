import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Search', 'Account', 'Favorites', 'Cart'];

  constructor(private authService: AuthService) {}
  buildLink(link: string): string {
    return link === 'Account' && !this.authService.user ? 'register' : link;
  }
}
