import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";
import { ItemCardComponent } from '../../../categories/list-items/item-card/item-card.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    standalone: true,
    imports: [NgFor, ItemCardComponent]
})
export class FavoritesComponent implements OnInit{
  items: Order[];
  constructor(private itemsService: ItemsService) {}
  ngOnInit() {
    this.itemsService.requestFavorites().subscribe(items => {
      this.items = items;
    })
  }
}
