import {HttpClient} from '@angular/common/http';
import {afterNextRender, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/auth.service";
import {HeaderComponent} from './navigation/header/header.component';
import {NavbarComponent} from './navigation/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [HeaderComponent, RouterOutlet, NavbarComponent],
    providers: [HttpClient]
})
export class AppComponent {

  constructor(
    private authService: AuthService
  ) {
    afterNextRender(() => {
      this.authService.autoAuth();
    })
  }
}
