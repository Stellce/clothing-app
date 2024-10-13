import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from "@angular/router";
import { ItemsService } from "../../../item/items.service";
import { CategoriesService } from "../../categories.service";
import { AllowedFilters } from "./allowed-filters.model";
import { CheckboxComponent } from './checkbox/checkbox.component';
import { Filter } from "./filter.model";
import { FilterService } from "./filter.service";
import { SelectedFilters } from "./selected-filters.model";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatSelectModule, MatOptionModule, MatExpansionModule, MatCheckboxModule, MatDividerModule, CheckboxComponent]
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
    this.categoriesService.categoriesList$.subscribe(categories => {
      if(!categories) return;
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
