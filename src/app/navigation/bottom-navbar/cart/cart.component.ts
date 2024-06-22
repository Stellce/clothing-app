import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: true,
    imports: [NgFor, ItemBarComponent]
})
export class CartComponent implements OnInit{
  items: Order[];
  constructor(private itemsService: ItemsService) {}
  ngOnInit() {
    this.itemsService.requestFavorites().subscribe(items => {
      this.items = items;
    })
  }
}
