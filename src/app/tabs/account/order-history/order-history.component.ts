import {Component, model, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ItemBarComponent} from '../../../item/item-bar/item-bar.component';
import {MatButtonModule} from '@angular/material/button';
import {OrdersService} from "../../../order-page/orders.service";
import {OrderRes} from "../../../order-page/order-res.model";
import {OrderItemBarComponent} from "../../../order-page/order-item-bar/order-item-bar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    standalone: true,
  imports: [MatButtonModule, ItemBarComponent, OrderItemBarComponent, MatProgressSpinner]
})
export class OrderHistoryComponent implements OnInit {
  orders = model.required<OrderRes[]>();
  isLoading: boolean = true;

  constructor(private ordersService: OrdersService, private location: Location) {}

  ngOnInit() {
    this.ordersService.getOrdersForCustomer().subscribe(ordersPage => {
      const orders = ordersPage.content;
      if (orders) this.orders.set(orders);
      this.isLoading = false;
    })
  }

  navigateBack() {
    this.location.back();
  }
}
