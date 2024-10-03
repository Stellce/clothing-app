import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { FirstLetterUpperCasePipe } from 'src/app/pipes/first-letter-upper-case.pipe';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, NavbarComponent, FirstLetterUpperCasePipe]
})
export class HeaderComponent implements OnInit{
  svgExtension = '.svg';
  links = ['Search', 'Account', 'Favorites', 'Cart'];
  tabIcon: string;
  isProductPage: boolean = false;
  tabIcons: string[] = [
    'search', 'account', 'favorites', 'cart'
  ]

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      this.tabIcon = this.tabIcons.find(n => e.url.includes(n.toLowerCase())) || null;
      this.isProductPage = e.url.includes('product') || e.url.includes('dashboard');
    })
  }
}
