import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {FieldToTextPipe} from 'src/app/shared/pipes/field-to-text';
import {NavbarComponent} from '../navbar/navbar.component';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, NavbarComponent, FieldToTextPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnChanges{
  isProductPage: WritableSignal<boolean> = signal(false);
  location: WritableSignal<string> = signal<string>('');
  tabIcon: WritableSignal<string> = signal('');
  tabIcons: string[] = [
    'search', 'account', 'favorites', 'cart', 'orders', 'employee-panel'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      console.log(e.url);
      this.tabIcon.set(this.tabIcons.find(n => e.url.includes(n.toLowerCase())) || null);
      this.isProductPage.set(e.url.includes('product') || e.url.includes('landing') || e.url === '/');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setLocation();
  }

  private setLocation() {
    const href = window.location.href.split('/');
    this.location.set(href[href.length - 1].split('?')[0]);
  }
}
