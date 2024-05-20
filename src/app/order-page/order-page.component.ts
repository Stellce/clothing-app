import {Component, OnInit} from '@angular/core';
import {Order} from "../item/order.model";
import {ItemsService} from "../item/items.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit{
  orders: Order[];

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.itemsService
  }
}
