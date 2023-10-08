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
    this.categories = this.appService.categories;

    let url = this.activatedRoute.snapshot.url;
    let genderPath = url[0].path
    let categoryPath = url[1].path;

    if (url[0].path === 'children') {
      genderPath = url[1].path;
      categoryPath = url[2].path;
    }

    this.gender = genderPath;
    this.category = categoryPath;
    this.appService.gender = this.gender;

    if (this.gender === 'men') {
      this.appService.gender = 'male';
    } else if (this.gender === 'women') {
      this.appService.gender = 'female';
    }
    this.appService.category = categoryPath.toUpperCase();

    this.itemsSub = this.appService.itemsUpdated
      .subscribe((items: ItemModel[]) => {
        this.items = items;
      });
    this.subcategoriesSub = this.appService.subcategoriesUpdated.subscribe(subcategories => {
      this.subcategories = subcategories;
    });
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

  log(event: MatTabChangeEvent) {
    console.log(event);
  }

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
    // this.categoriesSub.unsubscribe();
    // this.subcategoriesSub.unsubscribe();
  }
}
