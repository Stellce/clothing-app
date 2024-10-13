import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { FieldToTextPipe } from 'src/app/pipes/field-to-text';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [RouterLink, NavbarComponent, FieldToTextPipe]
})
export class HeaderComponent implements OnInit{
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
      this.isProductPage = e.url.includes('product') || e.url.includes('dashboard') || e.url === '/';
    })
  }
}
