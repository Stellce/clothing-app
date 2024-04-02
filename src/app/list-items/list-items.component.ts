import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Item} from "./item/item.model";
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ItemsService} from "./item/items.service";
import {ItemsRequest} from "./item/items-request.model";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListItemsComponent implements OnInit{
  items: Item[] = [];
  subcategories: {id: string; name: string}[] = [];
  gender: string;
  categoryId: string;
  isLoading: boolean = false;
  constructor(
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemsService.items$.subscribe((items: Item[]) => {
      this.isLoading = false;
      this.items = items;
    });
    let params = this.activatedRoute.snapshot.params;
    this.gender = params['gender'];
    this.categoryId = params['categoryId'];

    this.isLoading = true;
    this.itemsService.requestItems({gender: this.gender, categoryId: this.categoryId}).subscribe(items => {
      this.isLoading = false;
      this.items = items;
    });
    this.itemsService.requestSubcategories(this.categoryId).subscribe(subcategories => {
      this.subcategories = subcategories;
    });
  }

  loadItemsBySubcategory(event: MatTabChangeEvent) {
    this.items = <Item[]>[];
    let subcategory = this.subcategories
      .find(subcategory =>
        subcategory.name.toLowerCase() === event.tab.textLabel.toLowerCase()
      );
    let itemsRequest: ItemsRequest = {
      gender: this.gender,
      categoryId: this.categoryId,
      subcategoryId: subcategory?.id
    }
    this.itemsService.requestItems(itemsRequest).subscribe(items => {
      this.items = items;
    });
  }
}
