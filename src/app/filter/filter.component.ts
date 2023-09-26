import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FilterModel} from "../filter.model";
import {NgForm} from "@angular/forms";
import {AppService} from "../app.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{
  filters = {
    colors: ['red', 'green', 'blue', 'pink', 'purple'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
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
    subcategories: ['JEANS', 'JOGGERS', 'SPORT'],
    brands: ['Adidas', 'Puma', 'Nike']
  };

  sizesCloth = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  sizesShoes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  subcategoriesCloth = ['JEANS', 'JOGGERS', 'SPORT'];
  subcategoriesShoes = ['SANDALS', 'SNEAKERS', 'BOOTS'];

  filtersSelected: {sizes: string[], brands: string[]} = {
    sizes: [],
    brands: []
  }
  @Output() closeDrawer = new EventEmitter<void>();
    constructor(private appService: AppService) {}

  ngOnInit() {
      if(this.appService.category.toUpperCase() === 'SHOES') {
        this.filters.sizes = this.sizesShoes;
        this.filters.subcategories = this.subcategoriesShoes;
      } else {
        this.filters.sizes = this.sizesCloth;
        this.filters.subcategories = this.subcategoriesCloth;
      }
  }

  onSubmitFilter(form: NgForm) {
    let filter: FilterModel = {
      priceFrom: form.value.priceFrom,
      priceTo: form.value.priceTo,
      sortBy: form.value.sortBy,
      ...this.filtersSelected
    }
    this.appService.getItemsByFilter(filter);
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

  onCloseDrawer() {
    this.closeDrawer.emit();
  }
}
