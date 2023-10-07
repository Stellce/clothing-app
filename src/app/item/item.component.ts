import {Component, Input, OnInit} from '@angular/core';
import {ItemModel} from "../item.model";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{
  @Input() item: ItemModel;
  ngOnInit() {

  }

  protected readonly Math = Math;
}
