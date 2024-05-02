import {Component, OnInit} from '@angular/core';
import {ItemsService} from "./items.service";
import {Item} from "./item.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{
  item: Item;
  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemsService.item$.subscribe(item => this.item = item);
    if(!this.item) this.itemsService.requestItemById(this.route.snapshot.paramMap.get("itemId"));
  }
}
