import {Component, OnInit} from '@angular/core';
import {ItemsService} from "../list-items/item-card/items.service";
import {ItemCard} from "../list-items/item-card/item-card.model";
import {ItemsPage} from "../list-items/item-card/res/items-page.model";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit{
  items: ItemCard[];
  isLoading: boolean = true;

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.itemsService.page$.subscribe(page => this.getItems(page));
    this.itemsService.requestLandingPageItems().subscribe(page => this.getItems(page));
  }

  getItems(page: ItemsPage) {
    this.isLoading = false;
    this.items = page.content;
  }
}
