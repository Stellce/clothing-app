import { Component } from '@angular/core';
import {FilterModel} from "../filter.model";
import {NgForm} from "@angular/forms";
import {AppService} from "../app.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  filters = {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['red', 'green', 'blue', 'pink', 'purple'],
    sort: [
      {
        name: 'popularity',
        value: 'popularity'
      },
      {
        name: 'price from lowest',
        value: 'price_asc'
      },
      {
        name: 'price from highest',
        value: 'price_desc'
      },
      {
        name: 'new',
        value: 'newest'
      }
    ],
    subcategories: ['JEANS', 'JOGGERS', 'SPORT', 'SANDALS', 'SNEAKERS', 'BOOTS'],
    brands: ['Adidas', 'Puma', 'Nike']
  };

  filtersSelected: {sizes: string[], brands: string[]} = {
    sizes: [],
    brands: []
  }
    constructor(private appService: AppService) {}

  onSubmitFilter(form: NgForm) {
    let filter: FilterModel = {
      priceFrom: form.value.priceFrom,
      priceTo: form.value.priceTo,
      sortBy: form.value.sortBy,
      ...this.filtersSelected
    }
    this.appService.getItemsFaked(filter);
    console.log(filter);
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
    // console.log(this.filtersSelected);
  }
}
