import {afterRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/auth.service";
import {HeaderComponent} from './navigation/header/header.component';
import {NavbarComponent} from './navigation/navbar/navbar.component';
import {LocalStorageService} from "./local/local-storage.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  @HostBinding('class')
  currentTheme: 'light-theme' | 'dark-theme' = 'dark-theme';

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    // afterRender(() => {
    //   this.authService.autoAuth();
    //   changeDetectionRef.markForCheck();
    // })
  }
  ngOnInit() {
    if (this.localStorage.isBrowser) {
      this.authService.autoAuth();
    }
  }

  onThemeChange() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
  }
}
