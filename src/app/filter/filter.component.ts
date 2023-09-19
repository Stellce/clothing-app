import { Component } from '@angular/core';
import {FilterModel} from "../filter.model";
import {ItemModel} from "../item.model";
import {NgForm} from "@angular/forms";
import {AppService} from "../app.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  filters: FilterModel = {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sortBy: ['popularity', 'price from lowest', 'price from highest', 'newest'],
    types: ['type1', 'type2', 'type3'],
    brands: ['Adidas', 'Puma', 'Nike']
  }

  filtersSelected: {sizes: string[], brands: string[]} = {
    sizes: [],
    brands: []
  }
    constructor(private appService: AppService) {}

  onSubmitForm(form: NgForm) {
    let filter: FilterModel = {
      priceFrom: form.value.priceFrom,
      priceTo: form.value.priceTo,
      sortBy: form.value.sortBy,
      types: form.value.types,
      ...this.filtersSelected
    }
    this.appService.getAll(filter);
    console.log(filter);
    this.appService.getAll();
  }

  test(event: any) {
    console.log(event);
  }

  changeFilter(filterType: string, filter: string) {
    if (filterType === 'size') {
      const sizeIndex = this.filtersSelected.sizes.indexOf(filter);
      if ( sizeIndex < 0) {
        this.filtersSelected.sizes.push(filter);
      } else {
        this.filtersSelected.sizes.splice(sizeIndex, 1);
      }
    } else if (filterType === 'brand') {
      const brandIndex = this.filtersSelected.brands.indexOf(filter);
      if (brandIndex < 0) {
        this.filtersSelected.brands.push(filter);
      } else {
        this.filtersSelected.brands.splice(brandIndex, 1);
      }
    }
    console.log(this.filtersSelected);
  }
}
