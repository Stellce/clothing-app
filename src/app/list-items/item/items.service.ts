import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {of, Subject, switchMap, take, tap} from "rxjs";
import {ItemsPage} from "./response-items.model";
import {FilterModel, FilterReady} from "../filter/filter.model";
import {Item} from "./item.model";

@Injectable({providedIn: 'root'})
export class ItemsService {
  private _gender: string;
  private _categoryId: string;
  items$ = new Subject<Item[]>();

  constructor(private http: HttpClient) {}

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    )
  }

  requestItems(gender: string, categoryId: string, subcategoryId?: string, pageNumber?: string) {
    this._gender = gender;
    this._categoryId = categoryId;

    let params = new HttpParams()
      .append('gender', gender.toUpperCase())
      .append('categoryId', categoryId)
      .append('pageSize', 24);
    if(subcategoryId) params = params.append('subcategoryId', subcategoryId);
    if(pageNumber) params = params.append('pageNumber', pageNumber);
    return this.http.get<ItemsPage>(
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

  requestBrands() {
    return this.http.get<{id: number, name: string}[]>(
      environment.backendUrl + `/catalog/brands`
    )
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

    filterParams = filterParams
      .append('gender', this._gender)
      .append('categoryId', this._categoryId);

    this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
        {
          params: filterParams
        }
      ).subscribe( data => {
      this.items$.next(data.content);
    })
  }

  changePage(pageNumber: number) {
    let pageParams = new HttpParams();
    pageParams = pageParams.append('pageNumber', pageNumber);

    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
      {params: pageParams}).pipe(tap(page => {
      this.items$.next(page.content);
    }));
  }
}
