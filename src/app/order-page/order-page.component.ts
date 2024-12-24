import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {OrdersService} from "./orders.service";
import {ActivatedRoute} from "@angular/router";
import {OrderRes} from "./order-res.model";
import {OrderItemBarComponent} from "./order-item-bar/order-item-bar.component";
import {ItemBarComponent} from "../item/item-bar/item-bar.component";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDivider} from "@angular/material/divider";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  imports: [
    OrderItemBarComponent,
    ItemBarComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatProgressSpinner,
    MatDivider,
    CurrencyPipe
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPageComponent implements OnInit{
  order: WritableSignal<OrderRes> = signal<OrderRes>(null);
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    this.ordersService.getOrderById(orderId).subscribe(order => {
      this.isLoading.set(false);
      this.order.set({...order});
    })
  }
}
