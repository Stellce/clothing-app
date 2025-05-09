import {CurrencyPipe, NgStyle, PercentPipe} from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component, computed, inject, Injector,
  input,
  InputSignal,
  OnDestroy,
  OnInit, Signal,
  signal,
  WritableSignal
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
    imports: [RouterLink, PercentPipe, CurrencyPipe, NgStyle, AddToFavoritesComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent implements OnInit, OnDestroy {
  itemWithoutImages: InputSignal<ItemCard> = input.required<ItemCard>();
  item: WritableSignal<ItemCard> = signal<ItemCard>(null);
  isBreadcrumbResolved: InputSignal<boolean> = input();
  imagesSubscription: Subscription;
  private injector = inject(Injector);
  linkToItem: Signal<string[]> = signal([]);

  constructor(
    private localService: LocalService,
    private authService: AuthService,
    private itemsService: ItemsService
  ) {
    afterNextRender(() => {
      this.linkToItem = computed(() =>
        window.location.href.includes('product') ? [this.item().id] : ['/', 'product', this.item().id]
      );
    })
  }

  ngOnInit(): void {
    this.item.set(this.itemWithoutImages());
    this.imagesSubscription = this.itemsService.requestItemImages(this.item().id).subscribe({
      next: images => {
        this.item.update(item => ({...item, images}));
      },
      error: err => {
        console.error(err);
      }
    });
    afterNextRender(() => {
      if (!this.authService.user() && this.isOnLocalWishlist(this.item())) {
        this.item.update(item => {
          item.metadata.onWishList = true;
          return item;
        });
      }
    }, {injector: this.injector});
  }

  ngOnDestroy() {
    this.imagesSubscription?.unsubscribe();
  }

  private isOnLocalWishlist(item: ItemCard) {
    let id = this.localService.favoritesIds?.indexOf(item.id);
    return id !== -1
  }

  protected readonly Math = Math;
}
