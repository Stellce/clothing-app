import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core'
import {NavigationStart, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs';
import {NavigationService} from "../navigation.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit{
  links = {
    landing: 'Landing',
    search: 'Search',
    account: 'Account',
    favorites: 'Favorites',
    cart: 'Cart'
  };
  url: WritableSignal<string> = signal<string>('');

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
      this.url.set(e.url);
    })
  }

  buildLink(link: string): string[] {
    return this.navigationService.buildLink(link);
  }

  hasRole(role: string) {
    return this.authService.user()?.roles?.includes(role.toUpperCase());
  }
}
