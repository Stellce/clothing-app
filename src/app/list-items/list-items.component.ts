import {Component, OnInit} from '@angular/core';
import {ItemModel} from "../item.model";
import {NgForm} from "@angular/forms";
import {FilterModel} from "../filter.model";
import {AppService} from "../app.service";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit{
  items: ItemModel[] = [];
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.itemsSub.subscribe((items: ItemModel[]) => {
        this.items = items;
    })
    this.appService.getAll();
  }
}
