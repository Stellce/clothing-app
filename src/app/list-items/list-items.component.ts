import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from "../item.model";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit, OnDestroy{
  items: ItemModel[] = [];
  itemsSub: Subscription;
  gender: string;
  categories: string[];
  category: string;
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
    // this.appService.categoryId = this.categories.indexOf(categoryPath) + 1;

    this.itemsSub = this.appService.itemsUpdated
      .subscribe((items: ItemModel[]) => {
        this.items = items;
      });
    this.appService.getItems();
  }

  handlePageEvent(e: PageEvent) {
    e.pageIndex;
  }

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
  }
}
