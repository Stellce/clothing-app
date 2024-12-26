import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {ItemsService} from "../../item/items.service";
import {ItemCardComponent} from '../../categories/list-items/item-card/item-card.component';
import {FavoritesService} from './favorites.service';
import {ItemCard} from 'src/app/categories/list-items/item-card/item-card.model';
import {LocalService} from 'src/app/shared/local/local.service';
import {AuthService} from 'src/app/auth/auth.service';
import {forkJoin, Subscription} from 'rxjs';
import {ItemDetails} from "../../item/item.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog} from "@angular/material/dialog";
import {DialogData} from "../../shared/dialog/dialog-data.model";
import {DialogComponent} from "../../shared/dialog/dialog.component";

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    imports: [ItemCardComponent, MatProgressSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit, OnDestroy {
  items: WritableSignal<ItemCard[]> = signal<ItemCard[]>([]);
  itemsSub: Subscription;
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  message: WritableSignal<string> = signal<string>("");

  constructor(
    private favoritesService: FavoritesService,
    private localService: LocalService,
    private authService: AuthService,
    private itemService: ItemsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.authService.user()) {
      this.loadItems();
    } else {
      this.loadLocalItems();
    }
  }

  ngOnDestroy() {
    this.itemsSub?.unsubscribe();
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
      this.items().map(item => {
        this.itemService.requestItemImages(item.id).subscribe(images => {
          this.items().find(i => i.id === item.id).images = images;
        });
      })
    }

    this.favoritesService.getItems().subscribe({
      next: items => {
        let localItems = this.localService.favoritesIds;
        const itemsNotAdded = items.length === 0 && localItems.length > 0;

        this.isLoading.set(false);
        this.items.set(items);

        if (itemsNotAdded) addItemsToServer(localItems);
        requestItemsImages();
      },
      error: err => {
        this.isLoading.set(false);
        this.message.set(`Error ${err['status']} occurred`);
        console.error(err);
      }
    });
  }

  private loadLocalItems() {
    let itemsIds: string[] = this.localService.favoritesIds;
    if (!itemsIds.length) {
      this.items.set([]);
      this.isLoading.set(false);
    }
    let items$ = itemsIds.map(itemId => this.itemService.requestItemById(itemId));
    this.itemsSub = forkJoin<ItemDetails[]>(items$).subscribe({
      next: items => {
        this.items.set(items);
        this.isLoading.set(false);
        items.forEach((item, index) => {
          this.itemService.requestItemImages(item.id).subscribe(images => {
            this.items.update(items => {
              items[index].images = images;
              console.log(items);
              return items;
            });
          });
        })
      },
      error: error => {
        console.error(error);
        this.items.set([]);
        this.message.set("Error occurred, could not load favorites. Try again later.");
        this.isLoading.set(false);
        const dialogData: DialogData = {
          title: 'Something went wrong',
          description: 'Could not load favorites',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      }
    })
  }
}
