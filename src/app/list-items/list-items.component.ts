import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ItemModel} from "../item.model";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Category} from "../categories/category.model";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListItemsComponent implements OnInit{
  items: ItemModel[] = [];
  itemsSub: Subscription;
  subcategories: string[] = [];
  subcategoriesSub: Subscription;
  constructor(
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    this.itemsSub = this.appService.$items.subscribe((items: ItemModel[]) => {
        this.items = items;
      });

    this.subcategoriesSub = this.appService.$subcategories.subscribe(subcategories => {
      this.subcategories = subcategories;
    });

    let params = this.activatedRoute.snapshot.params;
    let gender = params['gender'];
    let category = params['category'];

    this.appService.requestItems(gender, category);
    this.appService.requestSubcategories();
  }

  loadItems(event: MatTabChangeEvent) {
    this.items = <ItemModel[]>[];
    let subcategoryId = event.index;
    this.appService.$page.next(0);
    this.appService.$isLastPage.next(false);
    this.appService.page = 0;
    this.appService.requestItemsBySubcategory(subcategoryId);
  }
}
