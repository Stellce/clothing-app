import {Component, input, InputSignal} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {FavoritesService} from "../../navigation/navbar/favorites/favorites.service";
import {LocalService} from "../../local/local.service";
import {NgStyle} from "@angular/common";
import {ItemCard} from "../../categories/list-items/item-card/item-card.model";

@Component({
  selector: 'app-add-to-favorites',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './add-to-favorites.component.html',
  styleUrl: './add-to-favorites.component.scss'
})
export class AddToFavoritesComponent {
  item: InputSignal<ItemCard> = input.required<ItemCard>();

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

  addToFavorites() {
    if (this.authService.user()) {
      this.favoritesService.addItem(this.item().id).subscribe({next: () => this.item().metadata.onWishList = true, error: () => {}});
    } else {
      this.localService.addToFavorites(this.item().id);
      this.item().metadata.onWishList = true;
    }
  }

  removeFromFavorites() {
    if (this.authService.user()) {
      this.favoritesService.removeItem(this.item().id).subscribe({next: () => this.item().metadata.onWishList = true, error: () => {}})
    } else {
      this.localService.removeFromFavorites(this.item().id);
      this.item().metadata.onWishList = false;
    }
  }
}
