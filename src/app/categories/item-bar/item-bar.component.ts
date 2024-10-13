import { CurrencyPipe, DatePipe, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalService } from 'src/app/local/local.service';
import { CartItem } from 'src/app/navigation/navbar/cart/cart-item.model';
import { CartService } from 'src/app/navigation/navbar/cart/cart.service';
import { ItemsService } from "../../item/items.service";
import {InputQuantityComponent} from "../../item/input-quantity/input-quantity.component";

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe, MatMiniFabButton, MatError, InputQuantityComponent]
})
export class ItemBarComponent implements OnInit{
  @Input() cartItem: CartItem;
  itemLink: string[] = [];

  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private cartService: CartService,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    this.itemLink = ['/', 'product', this.cartItem.itemId];
    this.itemsService.requestItemImages(this.cartItem.itemId).subscribe(images => this.cartItem.images = images);
  }

  addMore(n: number) {
    if (this.authService.user()) {
      this.cartService.updateItem({entryId: this.cartItem.id, quantity: this.cartItem.quantity + n, size: this.cartItem.itemSize})
    } else {
      this.localService.updateCartItem({
        id: this.cartItem.itemId,
        quantity: n,
        itemSize: this.cartItem.itemSize
      });
    }
  }

  getMaxQuantity() {
    return this.cartItem.uniqueItems.find(uItem => uItem.size === this.cartItem.itemSize).quantity;
  }
}
