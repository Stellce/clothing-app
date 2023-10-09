import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ItemModel} from "../item.model";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Category} from "./category.model";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListItemsComponent implements OnInit, OnDestroy{
  gender: string;
  items: ItemModel[] = [];
  itemsSub: Subscription;
  categories: Category[];
  categoriesSub: Subscription;
  category: string;
  subcategories: string[] = [];
  subcategoriesSub: Subscription;
  constructor(
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    let url = this.activatedRoute.snapshot.url;

    this.itemsSub = this.appService.itemsUpdated.subscribe((items: ItemModel[]) => {
        this.items = items;
      });

    this.subcategoriesSub = this.appService.subcategoriesUpdated.subscribe(subcategories => {
      this.subcategories = subcategories;
    });

    this.gender = url[0].path;
    this.appService.gender = url[0].path;

    this.category = url[1].path;
    this.appService.category = url[1].path;

    this.appService.getItems();
    this.appService.getSubcategories();
  }

  loadItems(event: MatTabChangeEvent) {
    this.items = <ItemModel[]>[];
    let subcategoryId = event.index;
    this.appService.pageUpdated.next(0);
    this.appService.isLastPageUpdate.next(false);
    this.appService.page = 0;
    this.appService.getItemsBySubcategory(subcategoryId);
  }

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
    // this.categoriesSub.unsubscribe();
    // this.subcategoriesSub.unsubscribe();
  }
}
