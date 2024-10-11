import { CurrencyPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth/auth.service';
import { BreadcrumbComponent } from '../categories/list-items/breadcrumb/breadcrumb.component';
import { UniqueItem } from '../categories/list-items/item-card/item-card.model';
import { LocalService } from '../local/local.service';
import { CartService } from '../navigation/navbar/cart/cart.service';
import { FieldToTextPipe } from '../pipes/field-to-text';
import { Image } from "./image.model";
import { ItemDetails } from "./item.model";
import { ItemsService } from "./items.service";
import { ReviewsComponent } from './reviews/reviews.component';
import {AddToFavoritesComponent} from "./add-to-favorites/add-to-favorites.component";
import {MatRipple} from "@angular/material/core";
import {InputQuantityComponent} from "./input-quantity/input-quantity.component";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    standalone: true,
  imports: [NgIf, BreadcrumbComponent, NgFor, NgClass, MatButtonModule, ReviewsComponent, CurrencyPipe, MatFormFieldModule, MatInputModule, FormsModule, NgStyle, FieldToTextPipe, AddToFavoritesComponent, MatRipple, InputQuantityComponent]
})
export class ItemComponent implements OnInit{
  item: ItemDetails;
  selectedUniqueItem: UniqueItem;
  quantity: number = 1;
  params: { key: string, value: string }[] = [];
  selectedImageIndex: number = 0;
  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private localService: LocalService
  ) {}

  ngOnInit() {
    this.requestItem();
  }

  setUniqueItem(uniqueItem: UniqueItem) {
    this.selectedUniqueItem = uniqueItem;
    if (this.quantity > uniqueItem.quantity) this.quantity = uniqueItem.quantity;
  }



  addToCart() {
    if (this.quantity > this.selectedUniqueItem.quantity) return;
    if (this.authService.user()) {
      this.cartService.addItem({
        itemId: this.item.id,
        quantity: this.quantity,
        size: this.selectedUniqueItem.size
      });
    } else {
      this.localService.addToCart({
        id: this.item.id,
        quantity: this.quantity,
        itemSize: this.selectedUniqueItem.size
      });
    }
  }

  orderNow() {
    // this.itemsService.orderNow();
  }

  sizeString(size: string): string {
    let split = size.split("X");
    let splitNoEmpty = split.filter(Boolean).toString();
    let numOfXes = split.length - splitNoEmpty.length;
    return size.length > 2 ? numOfXes + "X" + splitNoEmpty : size;
  }

  private requestItem() {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    this.itemsService.requestItemById(itemId).subscribe((item: ItemDetails) => {
      if(!item) return;
      this.item = item;
      this.selectedUniqueItem = item.uniqueItems.find(i => i.quantity > 0);
      this.item.params = {
        color: this.item.color,
        brand: this.item.brand
      };
      Object.entries(this.item.params).forEach(([key, value]) => this.params.push({key, value}))
      this.itemsService.requestItemImages(item.id).subscribe((images: Image[]) => {
        this.item.images = images;
      })
    });
  }

}
