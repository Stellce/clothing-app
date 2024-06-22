import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import { BottomNavbarComponent } from './navigation/bottom-navbar/bottom-navbar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, BottomNavbarComponent]
})
export class AppComponent implements OnInit{
  title = 'cloth-app';

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}
  ngOnInit() {
    this.iconRegistry.addSvgIcon('Favorites', this.sanitizer.bypassSecurityTrustResourceUrl('assets/navbar/Favorites.svg'))
  }
}
