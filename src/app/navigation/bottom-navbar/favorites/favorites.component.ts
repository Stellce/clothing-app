import {Component, OnInit} from '@angular/core';
import {Order} from "../../../item/order.model";
import {ItemsService} from "../../../item/items.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit{
  items: Order[];
  constructor(private itemsService: ItemsService) {}
  ngOnInit() {
    this.itemsService.requestFavorites().subscribe(items => {
      this.items = items;
    })
  }
}
