import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel, FilterReady} from "./list-items/filter/filter.model";
import {ItemModel} from "./list-items/item/item.model";
import {Subject} from "rxjs";
import {Category} from "./categories/category.model";
import {environment} from "../environments/environment";
import {ResponseItems} from "./list-items/item/response-items.model";


@Injectable({
  providedIn: 'root'
})
export class AppService {
  backendUrl = environment.backendUrl;
  private _gender: string;
  private _categoryId: string;
  // items: ItemModel[];
  items$ = new Subject<ItemModel[]>;
  itemsBySubcategories: ItemModel[][] = <ItemModel[][]>[];
  category: string;
  categories: Category[];
  brands$ = new Subject<{id: number, name: string}[]>();
  subcategories$ = new Subject<string[]>();
  page: number = 0;
  page$ = new Subject<number>();
  isLastPage$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  requestSubcategories() {
    this.http.get<{id: number, name: string}[]>(
      this.backendUrl + `/items/categories/${this.category}/subcategories`
    ).subscribe(subcategories => {
      let subcategoriesNames = subcategories.map(subcategory => subcategory.name);
      this.subcategories$.next(subcategoriesNames);
    })
  }

  requestItems(gender: string, categoryId: string) {
    this._gender = gender;
    this._categoryId = categoryId
    this.http.get<ResponseItems>(
      environment.backendUrl + `/items/gender/${gender}/category/${categoryId}`
    ).subscribe( data => {
      this.items$.next([...data.content]);
      this.itemsBySubcategories[0] = [...data.content];
    })
  }

  requestItemsByFilter(filter: FilterModel) {
    let filterReady: FilterReady = {
      sort: filter.sortBy,
      priceRange: (filter.priceFrom || filter.priceTo) ? [filter.priceFrom, filter.priceTo].join(",") : undefined,
      sizes: filter.sizes,
      colors: filter.colors,
      brands: filter.brands,
      season: filter.season,
      materials: filter.materials,
      rating: filter.rating
    }
    console.log(filterReady);

    let filterParams = new HttpParams();
    for (let [param, value] of Object.entries(filterReady)) {
      if (!value || value.length === 0) continue;
      if (Array.isArray(value)) value = value.join(',');
      filterParams = filterParams.append(param, value);
    }
    console.log(filterParams);

    this.http
      .get<ResponseItems>(
        `http://localhost:8765/items/gender/${this._gender}/category/${this.category}`,
        {
          params: filterParams
        }
      ).subscribe( data => {
      this.items$.next([...data.content]);
    })
  }

  requestPage(pageNum: number) {
    let url: string = environment.backendUrl + `/items/gender/${this._gender}/category/${this._categoryId}`;

    let pageParams = new HttpParams();
    if(!(pageNum < 0 && this.page === 0)) this.page += pageNum;
    pageParams = pageParams.append('page', this.page);

    this.http.get<ResponseItems>(url, {params: pageParams}).subscribe(data => {
      console.log(data);
      this.items$.next([...data.content]);
      this.page$.next(this.page);
      this.isLastPage$.next(data.last);
    })
  }

  requestItemsBySubcategory(subcategoryId: number) {
    if (this.itemsBySubcategories[subcategoryId])
      return this.items$.next(this.itemsBySubcategories[subcategoryId]);

    let url: string = environment.backendUrl + `/items/gender/${this._gender}/category/${this._categoryId}`;

    if (subcategoryId) url += `/subcategory/${subcategoryId}`;

    this.http.get<ResponseItems>(url).subscribe(data => {
      this.itemsBySubcategories[subcategoryId] = [...data.content];
      this.items$.next([...data.content]);
    })
  }

  requestBrands() {
    this.http.get<{id: number, name: string}[]>(this.backendUrl + `/items/brands`).subscribe(brands => {
      this.brands$.next(brands);
    })
  }

}
