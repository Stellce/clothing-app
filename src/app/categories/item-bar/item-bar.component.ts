import {Component, Input} from '@angular/core';
import {ItemBar} from "./item-bar.model";

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss']
})
export class ItemBarComponent {
  @Input() item: ItemBar;

}
