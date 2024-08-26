import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../item/order.model";
import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ItemDetails} from "../../item/item.model";
import {ItemsService} from "../../item/items.service";

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe]
})
export class ItemBarComponent implements OnInit {
  @Input() order: Order;
  item0: ItemDetails;

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.itemsService.requestItemById(this.order.itemEntries[0]?.itemId)
      .subscribe(item => this.item0 = item);
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
