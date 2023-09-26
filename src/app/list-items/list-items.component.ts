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
  categories: string[] = [
    'T_SHIRTS',
    'SHIRTS',
    'TROUSERS',
    'SHORTS',
    'HOODIES_AND_SWEATSHIRTS',
    'SWEATERS',
    'COATS',
    'JACKETS',
    'SHOES',
    'UNDERWEAR',
    'SOCKS'
  ]
  category: string;
  constructor(
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {}


  ngOnInit() {
    let url = this.activatedRoute.snapshot.url;

    this.appService.gender =
      url[0].path === 'men' ? 'male' :
        url[0].path === 'women' ? 'female' : 'children';
    this.appService.categoryId = this.categories.indexOf(url[1].path) + 1;

    this.gender = url[0].path;
    this.category = url[1].path;

    this.appService.category = this.category;

    this.itemsSub = this.appService.itemsUpdated
      .subscribe((items: ItemModel[]) => {
        this.items = items;
      })
    this.appService.getItems();
  }

  handlePageEvent(e: PageEvent) {
    e.pageIndex;
  }

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
  }
}
