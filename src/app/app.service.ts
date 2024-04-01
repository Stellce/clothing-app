import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel, FilterReady} from "./list-items/filter/filter.model";
import {Item} from "./list-items/item/item.model";
import {of, Subject, switchMap, take} from "rxjs";
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
  items$ = new Subject<Item[]>;
  itemsBySubcategories: Item[][] = <Item[][]>[];
  subcategories$ = new Subject<string[]>();
  page: number = 0;
  page$ = new Subject<number>();
  isLastPage$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  requestSubcategories() {
    return this.http.get<{id: number, name: string}[]>(
      this.backendUrl + `/catalog/categories/${this._categoryId}/subcategories`
    ).pipe(take(1), switchMap(subcategories => {
      let subcategoriesNames = subcategories.map(subcategory => subcategory.name);
      return of(subcategoriesNames);
    }))
  }

  requestItems(gender: string, categoryId: string, subcategoryId?: string) {
    this._gender = gender;
    this._categoryId = categoryId;

    let params = new HttpParams()
      .append('gender', gender.toUpperCase())
      .append('categoryId', categoryId)
      .append('pageSize', 24);
    if(subcategoryId) params = params.append('subcategoryId', subcategoryId);
    console.log(params)
    return this.http.get<ResponseItems>(
      environment.backendUrl + `/catalog/items`,
      {params: params}
    ).pipe(take(1), switchMap(resItems => {
      return of(resItems.content);
    }))
  }

  requestItemImages(itemId: string) {
    return this.http.get<{imageId: string, image: string}[]>(
      environment.backendUrl + `/catalog/items/${itemId}/images`
    );
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
        `http://localhost:8765/items/gender/${this._gender}/category/${this._categoryId}`,
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

  // requestItemsBySubcategory(subcategoryId: string) {
  //   let url: string = environment.backendUrl + `/catalog/items`;
  //
  //   if (subcategoryId) url += `/subcategory/${subcategoryId}`;
  //
  //   this.http.get<ResponseItems>(url).subscribe(data => {
  //     this.itemsBySubcategories[subcategoryId] = [...data.content];
  //     this.items$.next([...data.content]);
  //   })
  // }



}
