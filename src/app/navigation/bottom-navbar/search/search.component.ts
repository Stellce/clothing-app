import { Component } from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import { ListItemsComponent } from '../../../categories/list-items/list-items.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [FormsModule, MatIconModule, NgIf, ListItemsComponent]
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
