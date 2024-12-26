import {ChangeDetectionStrategy, Component, Signal, signal, WritableSignal} from '@angular/core';
import {ItemCard} from "../../../categories/list-items/item-card/item-card.model";
import {ItemsService} from "../../../item/items.service";
import {ItemCardComponent} from '../../../categories/list-items/item-card/item-card.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {finalize, map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-outlet',
    templateUrl: './outlet.component.html',
    styleUrls: ['./outlet.component.scss'],
    imports: [MatProgressSpinnerModule, ItemCardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletComponent {
  items: Signal<ItemCard[]>;
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(
    private itemsService: ItemsService
  ) {
    this.items = toSignal(this.itemsService.requestLandingPage()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        map(page => page.content)
      ));
  }
}
