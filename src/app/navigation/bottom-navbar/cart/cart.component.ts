import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { NgFor, NgIf } from '@angular/common';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.model';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalService } from 'src/app/local/local.service';
import { LocalCartItem } from 'src/app/local/local-cart-item.model';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, ItemBarComponent]
})
export class CartComponent implements OnInit{
  items: CartItem[] = [];
  constructor(
    private cartService: CartService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService
  ) {}
  ngOnInit() {
    if (this.authService.user) {
      this.cartService.getItems().subscribe(items => {
        this.items = items;
      });
    } else {
      let localCartItems: LocalCartItem[] = this.localService.getCartItems();
      localCartItems.forEach((localCartItem, index) => this.itemService.requestItemById(localCartItem.id).subscribe(itemDetails => {
        let item: CartItem = {
          id: '',
          itemId: itemDetails.id,
          itemName: itemDetails.name,
          itemSize: localCartItem.itemSize,
          quantity: localCartItem.quantity,
          discount: itemDetails.discount,
          itemPrice: itemDetails.price,
          itemPriceAfterDiscount: itemDetails.priceAfterDiscount,
          totalPrice: itemDetails.price * localCartItem.quantity,
          totalPriceAfterDiscount: itemDetails.price * localCartItem.quantity,
          uniqueItems: itemDetails.uniqueItems
        };
        this.items[index] = item;
      }));
    }
  }
}
