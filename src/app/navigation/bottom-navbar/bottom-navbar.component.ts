import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {NavigationService} from "../navigation.service";
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-bottom-navbar',
    templateUrl: './bottom-navbar.component.html',
    styleUrls: ['./bottom-navbar.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink]
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
