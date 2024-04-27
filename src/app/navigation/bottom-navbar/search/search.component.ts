import { Component } from '@angular/core';
import {ItemsService} from "../../../item/items.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  search: string = '';
  isLoading: boolean = false;
  wasSearched: boolean = false;
  constructor(
    private itemsService: ItemsService
  ) {}
  onSearch() {
    console.log("Searching...");
    this.wasSearched = true;
    this.isLoading = true;
    this.itemsService.search(this.search)
      .subscribe(() => this.isLoading = false);
  }
}
