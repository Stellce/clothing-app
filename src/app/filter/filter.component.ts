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
    colors: ['black', 'white', 'red', 'yellow', 'green', 'blue', 'violet', 'grey', 'multi'],
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
    brands: [{id: 0, name: ''}]
  };

  sizesCloth = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  sizesShoes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  subcategoriesCloth = ['JEANS', 'JOGGERS', 'SPORT'];
  subcategoriesShoes = ['SANDALS', 'SNEAKERS', 'BOOTS'];

  filtersSelected: {colors: string[], sizes: string[], brands: string[]} = {
    colors: [],
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
    this.appService.getBrands().subscribe(brands => {
      this.filters.brands = brands;
    });
  }

  getColorOfColorFilter(color: string) {
    let rainbow = 'linear-gradient(90deg, rgba(55,4,4,1) 0%, rgba(106,10,96,1) 16%, rgba(11,11,110,1) 30%, rgba(29,155,181,1) 45%, rgba(20,143,83,1) 59%, rgba(16,143,10,1) 72%, rgba(194,219,23,1) 83%, rgba(182,97,14,1) 100%);'
    if (color === 'multi') return rainbow;
    return color;
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
    } else if (filterType === 'colors') {
      const colorIndex = this.filtersSelected.colors.indexOf(filter);
      if(colorIndex < 0) {
        this.filtersSelected.colors.push(filter);
      } else {
        this.filtersSelected.colors.splice(colorIndex, 1);
      }
    }
    // console.log(this.filtersSelected);
  }

  onCloseDrawer() {
    this.closeDrawer.emit();
  }
}
