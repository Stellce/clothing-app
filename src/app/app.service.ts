import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel, FilterReady} from "./filter.model";
import {ItemModel} from "./item.model";
import {Subject} from "rxjs";
import {ResponseModel} from "./response.model";
import {Category} from "./list-items/category.model";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  backendUrl: string = 'http://localhost:8765';

  gender: string;
  // items: ItemModel[];
  itemsUpdated = new Subject<ItemModel[]>;
  itemsBySubcategories: ItemModel[][] = <ItemModel[][]>[];
  category: string;
  categories: Category[];
  brandsUpdated = new Subject<{id: number, name: string}[]>();
  subcategoriesUpdated = new Subject<string[]>();
  page: number = 0;
  pageUpdated = new Subject<number>();
  isLastPageUpdate = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getCategories() {
    let genderParam = new HttpParams();
    genderParam = genderParam.append('gender', this.gender);
    return this.http
      .get<Category[]>(
        this.backendUrl + '/items/categories',
        {params: genderParam}
      )
  }

  getSubcategories() {
      this.http
        .get<{id: number, name: string}[]>(
          this.backendUrl + `/items/categories/${this.category}/subcategories`
        ).subscribe(subcategories => {
          let subcategoriesNames = subcategories.map(subcategory => subcategory.name);
          this.subcategoriesUpdated.next(subcategoriesNames);
        })
  }

  getItems() {
    let url: string = this.buildUrl();
    this.http.get<ResponseModel>(url).subscribe( data => {
      this.itemsUpdated.next([...data.content]);
      this.itemsBySubcategories[0] = [...data.content];
    })
  }

  getItemsByFilter(filter: FilterModel) {
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
    console.log(filterReady)

    let filterParams = new HttpParams();
    for (let [param, value] of Object.entries(filterReady)) {
      if (!value || value.length === 0) continue;
      if (Array.isArray(value)) value = value.join(',');
      filterParams = filterParams.append(param, value);
    }
    console.log(filterParams)

    this.http
      .get<ResponseModel>(
        `http://localhost:8765/items/gender/${this.gender}/category/${this.category}`,
        {
          params: filterParams
        }
      ).subscribe( data => {
      this.itemsUpdated.next([...data.content]);
    })
  }

  updatePage(changePage: number) {
    this.getCategories().subscribe(categories => {
      this.categories = categories;
      let url: string = this.buildUrl();

      let pageParams = new HttpParams();
      if(!(changePage < 0 && this.page === 0)) this.page += changePage;
      pageParams = pageParams.append('page', this.page);

      this.http.get<ResponseModel>(url, {params: pageParams}).subscribe( data => {
        console.log(data);
        this.itemsUpdated.next([...data.content]);
        this.pageUpdated.next(this.page);
        this.isLastPageUpdate.next(data.last);
      })
    })
  }

  getItemsBySubcategory(subcategoryId: number) {
    if (this.itemsBySubcategories[subcategoryId]) {
      this.itemsUpdated.next(this.itemsBySubcategories[subcategoryId]);
      return;
    }

    this.getCategories().subscribe(categories => {
      this.categories = categories;
      let url: string = this.buildUrl();

      if (subcategoryId) url += `/subcategory/${subcategoryId}`;

      this.http.get<ResponseModel>(url).subscribe( data => {
        this.itemsBySubcategories[subcategoryId] = [...data.content];
        this.itemsUpdated.next([...data.content]);
      })
    })
  }

  getBrands() {
    this.http.get<{id: number, name: string}[]>(this.backendUrl + `/items/brands`).subscribe(brands => {
      this.brandsUpdated.next(brands);
    })
  }

  private buildUrl() {
    let url;

    if(this.gender === 'boys' || this.gender === 'girls') {
      let childGender = this.gender === 'boys' ? 'male' : 'female';
      url = this.backendUrl + `/items/age-group/children/gender/${childGender}/category/${this.category}`;
    } else {
      url = this.backendUrl + `/items/gender/${this.gender}/category/${this.category}`
    }
    return url;
  }

}
