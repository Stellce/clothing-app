import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ListItemsComponent} from '../../categories/list-items/list-items.component';
import {ItemsService} from "../../item/items.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [FormsModule, ListItemsComponent]
})
export class SearchComponent {
  search: string = '';

  constructor(
    private itemsService: ItemsService
  ) {}

  onSearch() {
    this.itemsService.search(this.search).subscribe();
  }
}
