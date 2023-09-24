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
  gender: 'male' | 'female' | 'children';
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
  categoryId: number;
  constructor(
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {}


  ngOnInit() {
    let url = this.activatedRoute.snapshot.url;

    this.gender =
      url[0].path === 'men' ? 'male' :
        url[0].path === 'women' ? 'female' : 'children';
    this.categoryId = this.categories.indexOf(url[1].path) + 1;

    this.appService.gender = this.gender;
    this.appService.categoryId = this.categoryId;

    this.itemsSub = this.appService.itemsUpdated
      .subscribe((items: ItemModel[]) => {
        this.items = items;
      })
    this.appService.getItems(this.gender, this.categoryId);
  }

  handlePageEvent(e: PageEvent) {
    e.pageIndex;
  }

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
  }
}
