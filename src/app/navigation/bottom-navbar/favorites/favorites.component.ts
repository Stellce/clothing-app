import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";
import { ItemCardComponent } from '../../../categories/list-items/item-card/item-card.component';
import { NgFor } from '@angular/common';
import { FavoritesService } from './favorites.service';
import { ItemCard } from 'src/app/categories/list-items/item-card/item-card.model';
import { LocalService } from 'src/app/local/local.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    standalone: true,
    imports: [NgFor, ItemCardComponent]
})
export class FavoritesComponent implements OnInit{
  items: ItemCard[];
  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService
  ) {}
  ngOnInit() {
    if (this.authService.user) {
      this.favoritesService.getItems().subscribe(items => this.items = items);
    } else {
      let itemsIds = this.localService.getFavoritesIds();
      itemsIds.forEach((itemId, index) => this.itemService.requestItemById(itemId).subscribe(item => this.items[index] = item));
    }
  }
}
