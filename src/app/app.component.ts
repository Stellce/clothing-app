import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'cloth-app';

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}
  ngOnInit() {
    this.iconRegistry.addSvgIcon('Favorites', this.sanitizer.bypassSecurityTrustResourceUrl('assets/navbar/Favorites.svg'))
  }
}
