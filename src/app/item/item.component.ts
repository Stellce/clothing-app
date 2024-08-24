import {Component, OnInit} from '@angular/core';
import {ItemsService} from "./items.service";
import {ItemDetails} from "./item.model";
import {ActivatedRoute} from "@angular/router";
import {ItemParams} from "./item.params.model";
import {Image} from "./image.model";
import { ReviewsComponent } from './reviews/reviews.component';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../categories/list-items/breadcrumb/breadcrumb.component';
import {NgIf, NgFor, NgClass, CurrencyPipe, NgStyle} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {OrderItem} from "../order-page/order-item.model";
import {UniqueItem} from "../categories/list-items/item-card/item-card.model";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    standalone: true,
  imports: [NgIf, BreadcrumbComponent, NgFor, NgClass, MatButtonModule, ReviewsComponent, CurrencyPipe, MatFormFieldModule, MatInputModule, FormsModule, NgStyle]
})
export class ItemComponent implements OnInit{
  item: ItemDetails;
  selectedUniqueItem: UniqueItem;
  count: number = 1;
  params: { key: string, value: string }[];
  selectedImageIndex: number = 0;
  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestItem();
  }

  setUniqueItemBySize(size: string) {
    this.selectedUniqueItem = this.item.uniqueItems.find(item => item.size === size)
  }

  addToCart() {
    if (this.count > this.selectedUniqueItem.quantity) return;
    const orderItem: OrderItem = {
      itemId: this.item.id,
      quantity: this.count,
      size: this.selectedUniqueItem.size
    }
    this.itemsService.addToCart(orderItem);
  }

  orderNow() {
    // this.itemsService.orderNow();
  }

  sizeString(size: string): string {
    let split = size.split("X");
    let splitNoEmpty = split.filter(Boolean).toString();
    let numOfXes = split.length - splitNoEmpty.length;
    return size.length > 2 ? numOfXes + "X" + splitNoEmpty : size;
  }

  private requestItem() {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    this.itemsService.requestItemById(itemId).subscribe((item: ItemDetails) => {
      if(!item) return;
      this.item = item;
      console.log(item)
      this.selectedUniqueItem = item.uniqueItems.find(i => i.quantity > 0);
      this.item.params = {
        description: this.item.description,
        color: this.item.color,
        brand: this.item.brand,
        quantity: this.selectedUniqueItem.quantity
      };
      // this.params = paramsPrepareForView(this.item.params);
      this.itemsService.requestItemImages(item.id).subscribe((images: Image[]) => {
        this.item.images = images;
      })
    });
  }

}
