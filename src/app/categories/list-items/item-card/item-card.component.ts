import { CurrencyPipe, NgStyle, PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalService } from 'src/app/local/local.service';
import { FavoritesService } from 'src/app/navigation/navbar/favorites/favorites.service';
import { ItemCard } from "./item-card.model";
import {AddToFavoritesComponent} from "../../../item/add-to-favorites/add-to-favorites.component";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  standalone: true,
  imports: [RouterLink, PercentPipe, CurrencyPipe, NgStyle, AddToFavoritesComponent]
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
    if (this.authService.user()) return;
    let id = this.localService.favoritesIds.indexOf(this.item?.id);
    let onWishList = id !== -1;
    if (this.item && this.item.metadata) this.item.metadata.onWishList = onWishList;
  }

  getLinkToItem() {
    return this.isBreadcrumbResolved ? [this.item.id] : ['/', 'product', this.item.id];
  }

  protected readonly Math = Math;
}
