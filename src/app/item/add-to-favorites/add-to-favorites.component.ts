import {ChangeDetectionStrategy, Component, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {FavoritesService} from "../../tabs/favorites/favorites.service";
import {LocalService} from "../../shared/local/local.service";
import {NgStyle} from "@angular/common";
import {ItemCard} from "../../categories/list-items/item-card/item-card.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-add-to-favorites',
    imports: [NgStyle, MatProgressSpinner],
    templateUrl: './add-to-favorites.component.html',
    styleUrl: './add-to-favorites.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToFavoritesComponent {
  item: ModelSignal<ItemCard> = model.required<ItemCard>();
  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private localService: LocalService
  ) {}

  onFavoriteToggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.item().metadata.onWishList) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  }

  private addToFavorites() {
    if (this.authService.user()) {
      this.isLoading.set(true);
      this.favoritesService.addItem(this.item().id).subscribe({
        next: () => {
          this.item.update(item => {
            item.metadata.onWishList = true;
            return item;
          });
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.localService.addToFavorites(this.item().id);
      this.item.update(item => {
        item.metadata.onWishList = true;
        return item;
      })
    }
  }

  private removeFromFavorites() {
    if (this.authService.user()) {
      this.isLoading.set(true);
      this.favoritesService.removeItem(this.item().id).subscribe({
        next: () => {
          this.item.update(item => {
            item.metadata.onWishList = false;
            return item;
          });
          this.isLoading.set(false);
        },
        error: err => {
          this.isLoading.set(false);
          console.error(err);
        }
      })
    } else {
      this.localService.removeFromFavorites(this.item().id);
      this.item.update(item => {
        item.metadata.onWishList = false;
        return item;
      })
    }
  }
}
