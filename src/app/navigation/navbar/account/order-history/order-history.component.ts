import { Component } from '@angular/core';
import {Order} from "../../../../item/order.model";
import {ItemsService} from "../../../../item/items.service";
import { Location } from '@angular/common';
import { ItemBarComponent } from '../../../../categories/item-bar/item-bar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    standalone: true,
    imports: [MatButtonModule, ItemBarComponent]
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
