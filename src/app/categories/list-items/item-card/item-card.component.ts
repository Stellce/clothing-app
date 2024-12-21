import {CurrencyPipe, NgStyle, PercentPipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnDestroy,
  OnInit
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from 'src/app/auth/auth.service';
import {LocalService} from 'src/app/shared/local/local.service';
import {ItemCard} from "./item-card.model";
import {AddToFavoritesComponent} from "../../../item/add-to-favorites/add-to-favorites.component";
import {ItemsService} from "../../../item/items.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  standalone: true,
  imports: [RouterLink, PercentPipe, CurrencyPipe, NgStyle, AddToFavoritesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent implements OnInit, OnDestroy {
  item: ModelSignal<ItemCard> = model.required<ItemCard>();
  isBreadcrumbResolved: InputSignal<boolean> = input();
  imagesSubscription: Subscription;

  constructor(
    private localService: LocalService,
    private authService: AuthService,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    if (!this.authService.user() && this.isOnLocalWishlist(this.item())) {
      this.item.update(item => ({...item, metadata: {...item.metadata, onWishList: true}}));
    }
    this.imagesSubscription = this.itemsService.requestItemImages(this.item().id).subscribe({
      next: images => {
        this.item.update(item => ({...item, images}))
      },
      error: err => {
        console.error(err);
      }
    });
  }

  ngOnDestroy() {
    this.imagesSubscription?.unsubscribe();
  }

  getLinkToItem() {
    return this.isBreadcrumbResolved() ? [this.item().id] : ['/', 'product', this.item().id];
  }

  private isOnLocalWishlist(item: ItemCard) {
    let id = this.localService.favoritesIds?.indexOf(item.id);
    return id !== -1
  }

  protected readonly Math = Math;
}
