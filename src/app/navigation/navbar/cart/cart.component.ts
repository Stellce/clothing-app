import {Component, OnInit} from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.model';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalService } from 'src/app/local/local.service';
import { LocalCartItem } from 'src/app/local/local-cart-item.model';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { ItemDetails } from 'src/app/item/item.model';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, ItemBarComponent, AsyncPipe, NgStyle]
})
export class CartComponent implements OnInit{
  cartItems: CartItem[] = [];
  constructor(
    private cartService: CartService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService
  ) {}
  ngOnInit() {
    if (this.authService.user()) {
      this.cartService.getItems().subscribe(items => this.cartItems = items);
    } else {
      let localCartItems: LocalCartItem[] = this.localService.getCartItems();
      let localCartItems$: Observable<CartItem>[];
      localCartItems$ = localCartItems.map((localCartItem, index) => this.itemService.requestItemById(localCartItem.id).pipe(switchMap((itemDetails: ItemDetails) => {
        let item: CartItem = {
          id: '',
          itemId: itemDetails.id,
          itemName: itemDetails.name,
          itemSize: localCartItem.itemSize,
          quantity: this.setValidQuantity(itemDetails, localCartItem),
          discount: itemDetails.discount,
          itemPrice: itemDetails.price,
          itemPriceAfterDiscount: itemDetails.priceAfterDiscount,
          totalPrice: itemDetails.price * localCartItem.quantity,
          totalPriceAfterDiscount: itemDetails.price * localCartItem.quantity,
          uniqueItems: itemDetails.uniqueItems
        };
        return of (item);
      })));
      forkJoin(localCartItems$).subscribe(items => this.cartItems = items);
    }
  }

  setValidQuantity(itemDetails: ItemDetails, localCartItem: LocalCartItem) {
    let maxQuantity = this.getItemQuantity(itemDetails, localCartItem.itemSize);
    return localCartItem.quantity > maxQuantity ? maxQuantity : localCartItem.quantity
  }

  getItemQuantity(itemDetails: ItemDetails, localCartItemSize: string) {
    return itemDetails.uniqueItems.find(i => i.size === localCartItemSize).quantity;
  }
}
