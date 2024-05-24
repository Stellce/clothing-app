import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  items: Order[];
  constructor(private itemsService: ItemsService) {}
  ngOnInit() {
    this.itemsService.requestCartItems().subscribe(items => {
      this.items = items;
    })
  }
}
