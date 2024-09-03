import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { FirstLetterUpperCasePipe } from 'src/app/pipes/first-letter-upper-case.pipe';
import { NavbarComponent } from '../navbar/navbar.component';
import { TabIcon } from '../tab-icon.model';
import { tabIcons } from '../tab.icons';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, NavbarComponent, MatIcon, FirstLetterUpperCasePipe]
})
export class HeaderComponent implements OnInit{
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Search', 'Account', 'Favorites', 'Cart'];
  tabIcon: TabIcon;
  isProductPage: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      this.tabIcon = tabIcons.find(n => e.url.includes(n.name.toLowerCase())) || null;
      this.isProductPage = e.url.includes('product') || e.url.includes('dashboard');
    })
  }
}
