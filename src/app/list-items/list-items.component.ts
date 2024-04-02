import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Item} from "./item/item.model";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ItemsService} from "./item/items.service";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListItemsComponent implements OnInit{
  items: Item[] = [];
  subcategories: { id: string; name: string }[] = [];
  gender: string;
  categoryId: string;
  constructor(
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemsService.items$.subscribe((items: Item[]) => {
        this.items = items;
    });

    let params = this.activatedRoute.snapshot.params;
    this.gender = params['gender'];
    this.categoryId = params['categoryId'];

    this.itemsService.requestItems(this.gender, this.categoryId).subscribe(items => {
      this.items = items;
      this.requestItemsImages();
    });
    this.itemsService.requestSubcategories(this.categoryId).subscribe(subcategories => {
      this.subcategories = subcategories;
    });
  }

  loadItemsBySubcategory(event: MatTabChangeEvent) {
    this.items = <Item[]>[];
    console.log(event)
    let subcategory = this.subcategories
      .find(subcategory =>
        subcategory.name.toLowerCase() === event.tab.textLabel.toLowerCase()
      );
    if(!subcategory) return;
    this.itemsService.requestItems(this.gender, this.categoryId, subcategory.id).subscribe(items => {
      this.items = items;
      this.requestItemsImages();
    });
  }

  private requestItemsImages() {
    this.items.forEach(item => {
      this.itemsService.requestItemImages(item.id).subscribe(images => {
        let newItem: Item | undefined = this.items.find(i => i.id === item.id);
        if(newItem)
          newItem.images = images.map(i => i.image);
      });
    })
  }
}
