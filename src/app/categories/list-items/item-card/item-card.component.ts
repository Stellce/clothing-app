import {Component, Input} from '@angular/core';
import {ItemCard} from "./item-card.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() item: ItemCard;



  protected readonly Math = Math;
}
