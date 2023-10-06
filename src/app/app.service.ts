import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel, FilterReady} from "./filter.model";
import {ItemModel} from "./item.model";
import {Subject, Subscription} from "rxjs";
import {ResponseModel} from "./response.model";
import {Category} from "./list-items/category.model";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  itemsUpdated = new Subject<ItemModel[]>;
  items: ItemModel[];
  categoryId: number;
  category: string;
  gender: string;
  backendUrl: string = 'http://localhost:8765';
  brandsUpdated = new Subject<{id: number, name: string}[]>()
  // categoriesUpdated = new Subject<any>();
  getItemsSub: Subscription;
  categories: Category[];

  constructor(private http: HttpClient) {}

  getCategories() {
    let genderParam = new HttpParams();
    this.gender = this.normalizeGender(this.gender);
    genderParam = genderParam.append('gender', this.gender);
    return this.http
      .get<Category[]>(
        this.backendUrl + '/items/categories',
        {params: genderParam}
      )
  }

  getBrands() {
    this.http.get<{id: number, name: string}[]>(this.backendUrl + `/items/brands`).subscribe(brands => {
      this.brandsUpdated.next(brands);
    })
  }

  getItems() {
    // this.categoryId = this.categories.find(category => category.name === this.category)!.id;
    this.getCategories().subscribe(categories => {
      this.categoryId = categories.find(category => category.name === this.category)!.id;
      console.log(this.categoryId);

      let url: string;
      let childGender = this.gender === 'boys' ? 'male' : 'female';
      if(this.gender === 'boys' || this.gender === 'girls') {
        url = this.backendUrl + `/items/age-group/children/gender/${childGender}/category/${this.categoryId}`;
      } else {
        url = this.backendUrl + `/items/gender/${this.gender}/category/${this.categoryId}`
      }
      this.http.get<ResponseModel>(url).subscribe( data => {
        this.items = [...data.content];
        console.log(data)
        this.itemsUpdated.next([...data.content]);
      })
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
        `http://localhost:8765/items/gender/${this.gender}/category/${this.categoryId}`,
        {
          params: filterParams
        }
      ).subscribe( data => {
      this.items = [...data.content];
      this.itemsUpdated.next([...data.content]);
    })
  }

  private normalizeGender(gender: string) {
    if (gender === 'men') return 'male';
    if (gender === 'women') return 'female';
    return gender;
  }

}
