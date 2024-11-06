import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {CatalogItem, ItemCard} from "../../../../categories/list-items/item-card/item-card.model";
import {Page} from "../../../../categories/list-items/item-card/res/page.model";
import {ItemsService} from "../../../../item/items.service";
import {ItemCardComponent} from '../../../../categories/list-items/item-card/item-card.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, ItemCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletComponent implements OnInit{
  items: WritableSignal<ItemCard[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.itemsService.requestLandingPage().subscribe({
      next: (page: Page<CatalogItem[]>) => {
        this.isLoading.set(false);
        this.items.set(page.content);
      },
      error: (err: any) => console.log(err)
    });
  }

}
