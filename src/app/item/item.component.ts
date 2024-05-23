import {Component, OnInit} from '@angular/core';
import {ItemsService} from "./items.service";
import {Item} from "./item.model";
import {ActivatedRoute} from "@angular/router";
import {ItemParams} from "./item.params.model";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{
  item: Item;
  params: { key: string, value: string }[];
  selectedImageIndex: number = 0;
  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestItem();
  }

  private requestItem() {
    this.itemsService.requestItemById(this.route.snapshot.paramMap.get("itemId")).subscribe(item => {
      if(!item) return;
      console.log('got item', item)
      this.item = item;
      this.item.params = {
        description: this.item.description,
        sizes: this.item.sizes,
        availableSizes: this.item.availableSizes,
        color: this.item.color,
        itemCode: this.item.itemCode,
        brand: this.item.brand,
      };
      this.params = paramsPrepareForView(this.item.params);
    });
    function paramsPrepareForView(params: ItemParams) {
      let paramsKeyValue: [string, (string | string[])][] = Object.entries(params);
      return paramsKeyValue.map(([k, v]) => {
        if(typeof k !== 'string' || (typeof v !== 'string' && !Array.isArray(v)))
          return {key: '', value: ''};
        k = firstLetterToBig(k);
        if (typeof v === 'string')
          v = firstLetterToBig(v);
        if(Array.isArray(v))
          v = v.map(el => firstLetterToBig(el)).join(", ");
        return {key: k, value: v};
      });
    }
    function firstLetterToBig(word: string) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    }
  }

}
