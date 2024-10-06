import {Component, OnInit} from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import { ItemCardComponent } from '../../../categories/list-items/item-card/item-card.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FavoritesService } from './favorites.service';
import { ItemCard } from 'src/app/categories/list-items/item-card/item-card.model';
import { LocalService } from 'src/app/local/local.service';
import { AuthService } from 'src/app/auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, ItemCardComponent, NgStyle]
})
export class FavoritesComponent implements OnInit{
  items: ItemCard[] = [];
  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService
  ) {}
  ngOnInit() {
    if (this.authService.user()) {
      this.favoritesService.getItems().subscribe(items => this.items = items);
    } else {
      let itemsIds = this.localService.getFavoritesIds();
      let items$ = itemsIds.map((itemId, index) => this.itemService.requestItemById(itemId));
      forkJoin(items$).subscribe(items => {
        this.items = items;
        items.forEach((item, index) => {
          this.itemService.requestItemImages(item.id).subscribe(images => {
            this.items[index].images = images;
          })
        })
        // item.metadata.onWishList = true;
        // this.items[index] = item;

      })
    }
  }
}
