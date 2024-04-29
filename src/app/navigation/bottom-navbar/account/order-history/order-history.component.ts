import { Component } from '@angular/core';
import {Order} from "../../../../item/order.model";
import {ItemsService} from "../../../../item/items.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  items: Order[];
  constructor(private itemsService: ItemsService, private location: Location) {}
  ngOnInit() {
    this.itemsService.requestOrders().subscribe(items => {
      this.items = items;
    })
  }

  navigateBack() {
    this.location.back();
  }
}
