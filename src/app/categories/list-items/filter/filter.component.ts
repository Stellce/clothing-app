import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {Filter} from "./filter.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../categories.service";
import {ItemsService} from "../item-card/items.service";
import {FilterService} from "./filter.service";
import {AllowedFilters} from "./allowed-filters.model";
import {SelectedFilters} from "./selected-filters.model";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit{
  @ViewChildren('checkboxes') checkboxes: QueryList<MatCheckbox>;
  @Output() filter = new EventEmitter<Filter>();
  filters: AllowedFilters;
  form: FormGroup;
  selectedFilters: SelectedFilters;
  // resetCheckboxes = false;
  constructor(
    public filterService: FilterService,
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {
    this.filters = filterService.allowedFilters;
    this.selectedFilters = filterService.selectedFilters
  }

  ngOnInit() {
    this.form = new FormGroup({
      priceFrom: new FormControl(''),
      priceTo: new FormControl(''),
      sizes: new FormControl(''),
      sortBy: new FormControl('')
    });

    let categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.categoriesService.requestCategories().subscribe(categories => {
      let categoryName = categories
        .find(c => c.id === categoryId)?.name.toUpperCase();
      if(categoryName === 'SHOES' || categoryName === 'SOCKS') {
        this.filters.sizes = this.filterService.sizesShoes;
      } else {
        this.filters.sizes = this.filterService.sizesClothes;
      }
    })
    this.itemsService.requestBrands().subscribe(brands => {
      this.filters.brands = brands;
    });
  }

  onSubmitFilter() {
    console.log('form', this.form);
    let priceRange = this.form.value['priceTo'] ?
      [this.form.value['priceFrom'] || 0, this.form.value['priceTo']].join(",") : '';
    let filter: Filter = {
      priceRange: priceRange,
      sort: this.form.value.sortBy,
    }
    Object.entries(this.selectedFilters).forEach(([k,v]) => {
      if (v.length) filter[k as keyof Filter] = v.join(",");
    });
    this.filter.emit(filter);
  }

  changeFilter(filterType: 'colors' | 'brands' | 'seasons' | 'materials', changeTo: string) {
    const filterIndex = this.selectedFilters[filterType]?.indexOf(changeTo);
    // console.log('filterIndex', filterIndex);
    const NOT_FOUND = -1;
    filterIndex === NOT_FOUND ?
      this.selectedFilters[filterType].push(changeTo) :
      this.selectedFilters[filterType].splice(filterIndex, 1);
  }

  getFilterName(filterName: string) {
    filterName = filterName.split(/_/).join(" ").toLowerCase();
    return filterName[0].toUpperCase() + filterName.slice(1);
  }

  resetForm() {
    this.selectedFilters = this.filterService.selectedFilters;
    this.checkboxes.toArray().forEach(el => {
      el.checked = false;
    });
    this.form.reset();
    this.onSubmitFilter();
  }
}
