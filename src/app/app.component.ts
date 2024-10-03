import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIcon, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./auth/auth.service";
import { HeaderComponent } from './navigation/header/header.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, NavbarComponent, MatIcon],
    providers: [HttpClient]
})
export class AppComponent implements OnInit{
  title = 'cloth-app';
  icons = [
    'account',
    'arrow_back',
    'arrow_down',
    'cart', 
    'favorites', 
    'Google__G__logo',
    'logo_dark',
    'logo',
    'logout',
    'search',
    'visibility_off',
    'visibility',
    
  ]
  
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`));
    })
  }
  ngOnInit() {
    this.authService.autoAuth();
  }
}
