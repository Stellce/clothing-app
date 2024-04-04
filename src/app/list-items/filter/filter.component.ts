import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Filter} from "./filter.model";
import {NgForm} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../categories/categories.service";
import {ItemsService} from "../item/items.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None
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
        name: 'newest',
        value: 'newest'
      }
    ],
    brands: [{id: 0, name: ''}]
  };

  sizesClothes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  sizesShoes: string[] = [];

  filtersSelected: {colors: string[], sizes: string[], brands: string[]} = {
    sizes: [],
    brands: [],
    colors: []
  }

  @Output()filter = new EventEmitter<Filter>();
    constructor(
      private itemsService: ItemsService,
      private activatedRoute: ActivatedRoute,
      private categoriesService: CategoriesService
    ) {}
  private setShoeSizes() {
      for (let i=30;i<=46;i++) {
        this.sizesShoes.push(String(i));
      }
  }

  ngOnInit() {
    let categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.categoriesService.requestCategories().subscribe(categories => {
      let categoryName = categories
        .find(c => c.id === categoryId)?.name.toUpperCase();
      if(categoryName === 'SHOES' || categoryName === 'SOCKS') {
        this.setShoeSizes();
        this.filters.sizes = this.sizesShoes;
      } else {
        this.filters.sizes = this.sizesClothes;
      }
    })
    this.itemsService.requestBrands().subscribe(brands => {
      this.filters.brands = brands
    });
  }

  onSubmitFilter(form: NgForm) {
    console.log(form)
    let filter: Filter = {
      priceRange: form.value['priceTo'] ?
        [form.value['priceFrom'] || 0, form.value['priceTo']].join(",") : '',
      sortBy: form.value.sortBy,
    }
    Object.entries(this.filtersSelected).forEach(([k,v]) => {
      if (v.length) filter[k as keyof Filter] = v.join(",");
    });
    this.filter.emit(filter);
  }

  changeFilter(filterType: 'colors' | 'brands' | 'sizes', filter: string) {
    const filterIndex = this.filtersSelected[filterType].indexOf(filter);
    const NOT_FOUND = -1;
    filterIndex === NOT_FOUND ?
      this.filtersSelected[filterType].push(filter) :
      this.filtersSelected[filterType].splice(filterIndex, 1);
    console.log(this.filtersSelected);
  }
}
