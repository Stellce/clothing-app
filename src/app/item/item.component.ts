import {Component, OnInit} from '@angular/core';
import {ItemsService} from "./items.service";
import {ItemDetails} from "./item.model";
import {ActivatedRoute} from "@angular/router";
import {Image} from "./image.model";
import { ReviewsComponent } from './reviews/reviews.component';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../categories/list-items/breadcrumb/breadcrumb.component';
import {NgIf, NgFor, NgClass, CurrencyPipe, NgStyle} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {OrderItem} from "../order-page/order-item.model";
import { UniqueItem } from '../categories/list-items/item-card/item-card.model';
import { CartItem } from '../navigation/bottom-navbar/cart/cart-item.model';
import { CartService } from '../navigation/bottom-navbar/cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { LocalService } from '../local/local.service';
import { LocalCartItem } from '../local/local-cart-item.model';

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
  quantity: number = 1;
  params: { key: string, value: string }[];
  selectedImageIndex: number = 0;
  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private localService: LocalService
  ) {}

  ngOnInit() {
    this.requestItem();
  }

  setUniqueItem(uniqueItem: UniqueItem) {
    this.selectedUniqueItem = uniqueItem;
  }

  addToCart() {
    if (this.quantity > this.selectedUniqueItem.quantity) return;
    const item: CartItem = {
      itemId: this.item.id,
      quantity: this.quantity,
      itemSize: this.selectedUniqueItem.size,
      ...this.item,
      itemName: this.item.name,
      itemPrice: this.item.price,
      itemPriceAfterDiscount: this.item.priceAfterDiscount,
      totalPrice: this.item.price * this.quantity,
      totalPriceAfterDiscount: this.item.priceAfterDiscount * this.quantity
    }
    if (this.authService.user) {
      this.cartService.addItem(item);
    } else {
      this.localService.addToCart(item as LocalCartItem);
    }
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
