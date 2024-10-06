import { HttpClient } from '@angular/common/http';
import {Component, HostBinding, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./auth/auth.service";
import { HeaderComponent } from './navigation/header/header.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, NavbarComponent],
    providers: [HttpClient]
})
export class AppComponent implements OnInit{
  @HostBinding('class')
  currentTheme: 'light-theme' | 'dark-theme' = 'dark-theme';

  constructor(
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.autoAuth();
  }

  onThemeChange() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
  }
}
