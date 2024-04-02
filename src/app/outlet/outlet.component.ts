import {Component, OnInit} from '@angular/core';
import {ItemsService} from "../list-items/item/items.service";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit{
  items: any;

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.itemsService.items$.subscribe(items => this.items = items);
    // this.appService.requestOutlet();
  }
}
