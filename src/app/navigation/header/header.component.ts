import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {NavigationService} from "../navigation.service";
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [RouterLink, NgFor]
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
