import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemCard} from "./item-card.model";
import { RouterLink } from '@angular/router';
import { NgIf, PercentPipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-item-card',
    templateUrl: './item-card.component.html',
    styleUrls: ['./item-card.component.scss'],
    standalone: true,
    imports: [NgIf, RouterLink, PercentPipe, CurrencyPipe]
})
export class ItemCardComponent {
  @Output() favoritesChanged = new EventEmitter<boolean>();
  @Input() item: ItemCard;
  @Input() isFavorite: boolean = false;
  @Input() isBreadcrumbResolved: boolean = false;

  onFavoritesChange() {
    // Test
    // if(this.item.id === '61bbe332-a7bd-45fb-b41c-6db31c850515') this.item = {...this.item, discount: 0};
    //
    this.isFavorite = !this.isFavorite;
    this.favoritesChanged.next(this.isFavorite);
  }

  getLinkToItem() {
    return this.isBreadcrumbResolved ? [this.item.id] : ['/', 'product', this.item.id];
  }

  protected readonly Math = Math;
}
