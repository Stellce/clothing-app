import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationService } from "../navigation.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, RouterLinkActive, NgClass]
})
export class NavbarComponent implements OnInit{
  links = {
    dashboard: 'Dashboard',
    search: 'Search',
    account: 'Account',
    favorites: 'Favorites',
    cart: 'Cart'
  };
  url: string = '';

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      this.url = e.url;
    })
  }

  buildLink(link: string): string[] {
    return this.navigationService.buildLink(link);
  }
}
