import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CatalogItem, ItemCard} from "../../../categories/list-items/item-card/item-card.model";
import {Page} from "../../../categories/list-items/item-card/res/page.model";
import {ItemsService} from "../../../item/items.service";
import {ItemCardComponent} from '../../../categories/list-items/item-card/item-card.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, ItemCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletComponent implements OnInit, OnDestroy {
  items: WritableSignal<ItemCard[]> = signal([]);
  itemsSub: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.itemsSub = this.itemsService.requestLandingPage().subscribe({
      next: (page: Page<CatalogItem[]>) => {
        this.isLoading.set(false);
        this.items.set(page.content);
        console.log(page.content);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.log(err)
      }
    });
  }

  ngOnDestroy() {
    this.itemsSub?.unsubscribe();
  }

}
