import {Component} from '@angular/core';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent {
  srcPrefics = 'assets/navbar/';
  svgExtension = '.svg';
  links = ['Dashboard', 'Search', 'Account', 'Favorites', 'Cart'];
}
