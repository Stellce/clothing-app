import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../item/order.model";
import {CurrencyPipe, DatePipe, NgIf, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ItemDetails} from "../../item/item.model";
import {ItemsService} from "../../item/items.service";
import { CartItem } from 'src/app/navigation/bottom-navbar/cart/cart-item.model';
import { LocalCartItem } from 'src/app/local/local-cart-item.model';

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe, NgIf]
})
export class ItemBarComponent implements OnInit{
  @Input() item: CartItem;

  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {
    this.itemsService.requestItemImages(this.item.itemId).subscribe(images => this.item.images = images);
  }
}
