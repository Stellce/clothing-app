import {Component, OnInit} from '@angular/core';
import {Order} from "../item/order.model";
import {OrdersService} from "./orders.service";
import {OrderReq} from "./order-req.model";

@Component({
    selector: 'app-order-page',
    templateUrl: './order-page.component.html',
    styleUrls: ['./order-page.component.scss'],
    standalone: true
})
export class OrderPageComponent implements OnInit{
  orders: Order[];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    // const orderReq: OrderReq = {
    //   itemEntries:
    // }
    // this.ordersService.createOrder(orderReq);
  }

  getDeliveryColor(deliveryStatus: string): string {
    switch (deliveryStatus) {
      case 'paid':
        return 'SeaGreen';
      case 'packaging':
        return 'DarkSeaGreen';
      case 'in transit':
        return 'DarkOrange';
      case 'delivered':
        return 'Green';
      default:
        return '';
    }
  }
}
