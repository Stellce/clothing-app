import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemCard } from "./item-card.model";
import { RouterLink } from '@angular/router';
import { NgIf, PercentPipe, CurrencyPipe, NgStyle, NgForOf } from '@angular/common';
import { FavoritesService } from 'src/app/navigation/bottom-navbar/favorites/favorites.service';
import { LocalService } from 'src/app/local/local.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, PercentPipe, CurrencyPipe, NgStyle, NgForOf]
})
export class ItemCardComponent {
  @Input() item: ItemCard;
  @Input() isBreadcrumbResolved: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService
  ) {}

  onFavoriteToggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.item.metadata.onWishList) {
      if (this.authService.user) {
        this.favoritesService.removeItem(this.item.id).subscribe({next: () => this.item.metadata.onWishList = true, error: () => {}})
      } else {
        this.localService.removeFromFavorites(this.item.id);
      }
    } else {
      if (this.authService.user) {
        this.favoritesService.addItem(this.item.id).subscribe({next: () => this.item.metadata.onWishList = true, error: () => {}});
      } else {
        this.localService.addToFavorites(this.item.id);
      }
    }
      
  }

  getLinkToItem() {
    return this.isBreadcrumbResolved ? [this.item.id] : ['/', 'product', this.item.id];
  }

  protected readonly Math = Math;
}
