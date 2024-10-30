import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {FieldToTextPipe} from 'src/app/pipes/field-to-text';
import {NavbarComponent} from '../navbar/navbar.component';
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
  imports: [RouterLink, NavbarComponent, FieldToTextPipe, JsonPipe]
})
export class HeaderComponent implements OnInit, OnChanges{
  tabIcon: string;
  isProductPage: boolean = false;
  tabIcons: string[] = [
    'search', 'account', 'favorites', 'cart', 'orders'
  ]
  location: string = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.tabIcon = this.tabIcons.find(n => e.url.includes(n.toLowerCase())) || null;
      this.isProductPage = e.url.includes('product') || e.url.includes('dashboard') || e.url === '/';
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setLocation();
  }

  private setLocation() {
    const href = window.location.href.split('/');
    this.location = href[href.length - 1].split('?')[0];
  }

  protected readonly window = window;
}
