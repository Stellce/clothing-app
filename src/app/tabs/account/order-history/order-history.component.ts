import {ChangeDetectionStrategy, Component, model, OnInit, signal, WritableSignal} from '@angular/core';
import {Location} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {OrdersService} from "../../../order-page/orders.service";
import {OrderRes} from "../../../order-page/order-res.model";
import {OrderItemBarComponent} from "../../../order-page/order-item-bar/order-item-bar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    imports: [MatButtonModule, OrderItemBarComponent, MatProgressSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  orders = signal<OrderRes[]>(null);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  constructor(private ordersService: OrdersService, private location: Location) {}

  ngOnInit() {
    this.ordersService.getOrdersForCustomer().subscribe(ordersPage => {
      const orders = ordersPage.content;
      if (orders) this.orders.set(orders);
      this.isLoading.set(false);
    })
  }

  navigateBack() {
    this.location.back();
  }
}
