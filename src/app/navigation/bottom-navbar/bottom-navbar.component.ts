import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {NavigationService} from "../navigation.service";

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent {
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Dashboard', 'Search', 'Account', 'Favorites', 'Cart'];

  constructor(
    private navigationService: NavigationService
  ) {}

  buildLink(link: string): string[] {
    return this.navigationService.buildLink(link);
  }
}
