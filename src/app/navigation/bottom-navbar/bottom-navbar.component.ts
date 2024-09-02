import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {NavigationService} from "../navigation.service";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-bottom-navbar',
    templateUrl: './bottom-navbar.component.html',
    styleUrls: ['./bottom-navbar.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, MatIcon, RouterLinkActive]
})
export class BottomNavbarComponent {
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  // links = ['Dashboard', 'Search', 'Account', 'Favorites', 'Cart'];
  links = {
    dashboard: 'Dashboard', 
    search: 'Search', 
    account: 'Account', 
    favorites: 'Favorites', 
    cart: 'Cart'
  };

  constructor(
    private navigationService: NavigationService
  ) {}

  buildLink(link: string): string[] {
    return this.navigationService.buildLink(link);
  }
}
