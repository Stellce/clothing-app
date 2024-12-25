import {ChangeDetectionStrategy, Component, model, ModelSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {OrderRes} from "../order-res.model";
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, DatePipe, NgStyle} from "@angular/common";
import {ItemsService} from "../../item/items.service";
import {FieldToTextPipe} from "../../shared/pipes/field-to-text";

@Component({
    selector: 'app-order-item-bar',
    imports: [RouterLink, NgStyle, DatePipe, CurrencyPipe, FieldToTextPipe],
    templateUrl: './order-item-bar.component.html',
    styleUrl: './order-item-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemBarComponent implements OnInit{
  order: ModelSignal<OrderRes> = model.required<OrderRes>();
  selectedImage: WritableSignal<string> = signal<string>(null);
  showMoreItems: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private itemsService: ItemsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.order().itemEntries.forEach((itemEntry, index) => {
      if (index > 8) return;
      this.itemsService.requestItemImages(itemEntry.itemId).subscribe(images => {
        const updatedEntries = this.order().itemEntries;
        updatedEntries.find(entry => entry.id === itemEntry.id).images = images;
        this.order.update(order => ({...order, itemEntries: updatedEntries}));

        this.setDefaultImage();
      })
    });
  }

  getDeliveryColor(orderStatus: string) {
    return 'cyan';
  }

  onNavigate(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (targetElement.nodeName !== 'IMG' && targetElement.className !== 'images-carousel' || this.order().itemEntries.length === 1) {
      this.router.navigate(['/', 'orders', this.order().id]);
    }
  }

  onShowChange() {
    this.showMoreItems.update(v => !v);
  }

  private setDefaultImage() {
    const images = this.order()?.itemEntries[0]?.images;
    if (!this.selectedImage() && images) this.selectedImage.set(images[0].url);
  }
}
