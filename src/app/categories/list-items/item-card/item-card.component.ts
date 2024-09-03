import { CurrencyPipe, NgForOf, NgIf, NgStyle, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalService } from 'src/app/local/local.service';
import { FavoritesService } from 'src/app/navigation/navbar/favorites/favorites.service';
import { ItemCard } from "./item-card.model";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, PercentPipe, CurrencyPipe, NgStyle, NgForOf]
})
export class ItemCardComponent implements OnInit {
  @Input() item: ItemCard = {} as ItemCard;
  @Input() isBreadcrumbResolved: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.user) return;
    let id = this.localService.favoritesIds.indexOf(this.item?.id);
    let onWishList = id !== -1;
    if (this.item && this.item.metadata) this.item.metadata.onWishList = onWishList;
  }

  onFavoriteToggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.item.metadata.onWishList) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  }

  addToFavorites() {
    if (this.authService.user) {
      this.favoritesService.addItem(this.item.id).subscribe({next: () => this.item.metadata.onWishList = true, error: () => {}});
    } else {
      this.localService.addToFavorites(this.item.id);
      this.item.metadata.onWishList = true;
    }
  }

  removeFromFavorites() {
    if (this.authService.user) {
      this.favoritesService.removeItem(this.item.id).subscribe({next: () => this.item.metadata.onWishList = true, error: () => {}})
    } else {
      this.localService.removeFromFavorites(this.item.id);
      this.item.metadata.onWishList = false;
    }
  }

  getLinkToItem() {
    return this.isBreadcrumbResolved ? [this.item.id] : ['/', 'product', this.item.id];
  }

  protected readonly Math = Math;
}
