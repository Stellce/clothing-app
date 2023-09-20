import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from "../item.model";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit, OnDestroy{
  items: ItemModel[] = [];
  itemsSub: Subscription;
  constructor(private appService: AppService) {}


  ngOnInit() {
    this.itemsSub = this.appService.items.subscribe((items: ItemModel[]) => {
        this.items = items;
    })
    this.appService.getAll();
  }
  ngOnDestroy() {
    this.itemsSub.unsubscribe();
  }
}
