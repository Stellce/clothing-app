import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common';
import {ChangeDetectionStrategy, Component, input, InputSignal, model, ModelSignal, OnInit} from '@angular/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatError} from '@angular/material/form-field';
import {RouterLink} from '@angular/router';
import {CartItem} from 'src/app/tabs/cart/cart-item.model';
import {ItemsService} from "../items.service";
import {InputQuantityComponent} from "../input-quantity/input-quantity.component";

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe, MatMiniFabButton, MatError, InputQuantityComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemBarComponent implements OnInit {
  cartItem: ModelSignal<CartItem> = model.required<CartItem>();
  disabled: InputSignal<boolean> = input<boolean>(false);

  constructor(
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.itemsService.requestItemImages(this.cartItem().itemId).subscribe({
      next: images => this.cartItem.update(item => ({...item, images}))
    });
  }
}
