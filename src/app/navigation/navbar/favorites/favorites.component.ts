import {Component, OnInit} from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import { ItemCardComponent } from '../../../categories/list-items/item-card/item-card.component';
import { NgStyle } from '@angular/common';
import { FavoritesService } from './favorites.service';
import { ItemCard } from 'src/app/categories/list-items/item-card/item-card.model';
import { LocalService } from 'src/app/local/local.service';
import { AuthService } from 'src/app/auth/auth.service';
import { forkJoin } from 'rxjs';
import {ItemDetails} from "../../../item/item.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    standalone: true,
  imports: [ItemCardComponent, NgStyle, MatProgressSpinner]
})
export class FavoritesComponent implements OnInit{
  items: ItemCard[] = null;
  isLoading: boolean = true;

  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService
  ) {}

  ngOnInit() {
    if (this.authService.user()) {
      this.loadItems();
    } else {
      this.loadLocalItems();
    }
  }

  private loadItems() {
    const addItemsToServer = (localItems: string[]) => {
      let favoritesIdsUploading$ = localItems.map(lItemId => {
        return this.favoritesService.addItem(lItemId);
      });
      forkJoin(favoritesIdsUploading$).subscribe({
        next: () => console.log('Favorite Items uploaded'),
        error: e => console.log(e)
      });
    }
    const requestItemsImages = () => {
      this.items.map(item => {
        this.itemService.requestItemImages(item.id).subscribe(images => {
          this.items.find(i => i.id === item.id).images = images;
        });
      })
    }

    this.favoritesService.getItems().subscribe(items => {
      let localItems = this.localService.getFavoritesIds();
      const itemsNotAdded = items.length === 0 && localItems.length > 0;

      this.isLoading = false;
      this.items = items;

      if (itemsNotAdded) addItemsToServer(localItems);
      requestItemsImages();
    });
  }

  private loadLocalItems() {
    let itemsIds = this.localService.getFavoritesIds();
    let items$ = itemsIds.map(itemId => this.itemService.requestItemById(itemId));
    forkJoin<ItemDetails[]>(items$).subscribe(items => {
      this.items = items;
      this.isLoading = false;
      items.forEach((item, index) => {
        this.itemService.requestItemImages(item.id).subscribe(images => {
          this.items[index].images = images;
        });
      });
    })
  }
}
