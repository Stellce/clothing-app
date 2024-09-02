import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../item/order.model";
import {CurrencyPipe, DatePipe, NgIf, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ItemDetails} from "../../item/item.model";
import {ItemsService} from "../../item/items.service";
import { CartItem } from 'src/app/navigation/bottom-navbar/cart/cart-item.model';
import { LocalCartItem } from 'src/app/local/local-cart-item.model';
import { MatMiniFabButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/navigation/bottom-navbar/cart/cart.service';
import { LocalService } from 'src/app/local/local.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe, NgIf, MatMiniFabButton, MatError, MatIcon]
})
export class ItemBarComponent implements OnInit{
  @Input() cartItem: CartItem;

  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private cartService: CartService,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    this.itemsService.requestItemImages(this.cartItem.itemId).subscribe(images => this.cartItem.images = images);
  }

  addMore(n: number) {
    let res = n + this.cartItem.quantity;
    let isPositiveRes = ((res) > 0);
    let isValidQuantity = isPositiveRes && this.getCurrentQuantityMax() >= res;
    if (!isValidQuantity) return;
    if (this.authService.user) {
      this.cartService.updateItem({entryId: this.cartItem.id, quantity: this.cartItem.quantity + n, size: this.cartItem.itemSize})
    } else {
      this.localService.updateCartItem({
        id: this.cartItem.itemId,
        quantity: this.cartItem.quantity + n,
        itemSize: this.cartItem.itemSize
      });
    }
    this.cartItem.quantity += n;
  }

  quantityError() {
    return this.cartItem.quantity > this.getCurrentQuantityMax();
  }

  getCurrentQuantityMax() {
    return this.cartItem.uniqueItems.find(uitem => uitem.size === this.cartItem.itemSize).quantity
  }
}
