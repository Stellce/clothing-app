import {Component, Input} from '@angular/core';
import {ItemModel} from "../item.model";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item: ItemModel;

  protected readonly Math = Math;
}
