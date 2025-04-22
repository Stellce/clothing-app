import {CurrencyPipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CartItem} from 'src/app/tabs/cart/cart-item.model';
import {ItemsService} from "../items.service";

@Component({
    selector: 'app-item-bar',
    templateUrl: './item-bar.component.html',
    styleUrls: ['./item-bar.component.scss'],
    imports: [RouterLink, CurrencyPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemBarComponent implements OnChanges {
  cartItem: ModelSignal<CartItem> = model.required<CartItem>();
  disabled: InputSignal<boolean> = input<boolean>(false);

  constructor(
    private itemsService: ItemsService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.itemsService.requestItemImages(this.cartItem().itemId).subscribe({
      next: images => {
        if (!this.cartItem()?.images?.length) this.cartItem.update(item => ({...item, images}));
      }
    });
  }
}
