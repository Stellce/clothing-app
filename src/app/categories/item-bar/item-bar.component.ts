import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatError} from '@angular/material/form-field';
import {RouterLink} from '@angular/router';
import {CartItem} from 'src/app/navigation/navbar/cart/cart-item.model';
import {ItemsService} from "../../item/items.service";
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

  constructor(
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.itemsService.requestItemImages(this.cartItem.itemId).subscribe(images => this.cartItem.images = images);
  }
}
