import {Component, model, ModelSignal, OnInit, signal} from '@angular/core';
import {OrderRes} from "../order-res.model";
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, DatePipe, NgStyle} from "@angular/common";
import {ItemsService} from "../../item/items.service";

@Component({
  selector: 'app-order-item-bar',
  standalone: true,
  imports: [RouterLink, NgStyle, DatePipe, CurrencyPipe],
  templateUrl: './order-item-bar.component.html',
  styleUrl: './order-item-bar.component.scss'
})
export class OrderItemBarComponent implements OnInit{
  order: ModelSignal<OrderRes> = model.required<OrderRes>();
  selectedImage: string = null;
  showMoreItems = signal<boolean>(false);

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
    if (!this.selectedImage && images) this.selectedImage = images[0].image;
  }
}
