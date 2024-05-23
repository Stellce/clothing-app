import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {NavigationService} from "../navigation.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Search', 'Account', 'Favorites', 'Cart'];

  constructor(
    private navigationService: NavigationService
  ) {}
  buildLink(link: string): string[] {
    return this.navigationService.buildLink(link);
  }
}
