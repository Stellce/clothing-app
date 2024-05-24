import { Component } from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import {Item} from "../../../item/item.model";
import {ItemCard} from "../../../categories/list-items/item-card/item-card.model";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  search: string = '';
  isLoading: boolean = false;
  wasSearched: boolean = false;
  items: ItemCard[];
  constructor(
    private itemsService: ItemsService
  ) {}
  onSearch() {
    console.log("Searching...");
    this.wasSearched = true;
    this.isLoading = true;
    this.itemsService.search(this.search).subscribe(items => {
      this.isLoading = false;
      this.items = items;
    });
  }
}
