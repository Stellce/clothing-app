import { Component } from '@angular/core';
import {Order} from "../../../../item/order.model";
import {ItemsService} from "../../../../item/items.service";
import { Location, NgFor } from '@angular/common';
import { ItemBarComponent } from '../../../../categories/item-bar/item-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgFor, ItemBarComponent]
})
export class OrderHistoryComponent {
  items: Order[];
  constructor(private itemsService: ItemsService, private location: Location) {}
  ngOnInit() {
    // this.itemsService.requestOrdersHistory().subscribe(items => {
    //   this.items = items;
    // })
  }

  navigateBack() {
    this.location.back();
  }
}
