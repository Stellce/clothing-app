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
  itemsSub: Subscription;
  subcategories: string[] = [];
  subcategoriesSub: Subscription;
  constructor(
    private appService: AppService,
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.appService.items$.subscribe((items: Item[]) => {
        this.items = items;
    });

    this.appService.subcategories$.subscribe(subcategories => {
      this.subcategories = subcategories;
    });

    let params = this.activatedRoute.snapshot.params;
    let gender = params['gender'];
    let categoryId = params['categoryId'];

    this.appService.requestItems(gender, categoryId).subscribe(items => {
      this.items = items;
      this.items.forEach(item => {
        this.appService.requestItemImages(item.id).subscribe(images => {
          // console.log(itemImages)
          let newItem: Item | undefined = this.items.find(i => i.id === item.id);
          if(newItem)
            newItem.images = images.map(i => i.image);
          console.log(newItem)
        });
      })
    });
    this.itemsService.requestSubcategories(categoryId).subscribe(subcategories => {
      console.log(subcategories)
    });
  }

  loadItems(event: MatTabChangeEvent) {
    this.items = <Item[]>[];
    let subcategoryId = event.index;
    this.appService.page$.next(0);
    this.appService.isLastPage$.next(false);
    this.appService.page = 0;
    this.appService.requestItemsBySubcategory(subcategoryId);
  }
}
