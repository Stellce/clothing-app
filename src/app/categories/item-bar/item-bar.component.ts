import {Component, Input} from '@angular/core';
import {ItemBar} from "../../item/order.model";
import { NgStyle, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-item-bar',
    templateUrl: './item-bar.component.html',
    styleUrls: ['./item-bar.component.scss'],
    standalone: true,
    imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe]
})
export class ItemBarComponent {
  @Input() item: ItemBar;

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
