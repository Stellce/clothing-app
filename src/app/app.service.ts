import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel, FilterReady} from "./filter.model";
import {ItemModel} from "./item.model";
import {Subject} from "rxjs";
import {ResponseModel} from "./response.model";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  itemsUpdated = new Subject<ItemModel[]>;
  items: ItemModel[];
  categoryId: number;
  gender: 'male' | 'female' | 'children';

  constructor(private http: HttpClient) {}

  getItems() {
    this.http.get<ResponseModel>(`http://localhost:8765/items/gender/${this.gender}/category/${this.categoryId}`).subscribe( data => {
      this.items = [...data.content];
      this.itemsUpdated.next([...data.content]);
      console.log(data)
    })
  }

  getItemsByFilter(filter: FilterModel) {
    let filterReady: FilterReady = {
      sort: filter.sortBy || undefined,
      priceRange: [filter.priceFrom, filter.priceTo].join(",") || undefined,
      sizes: filter.sizes || undefined,
      colors: filter.colors || undefined,
      brands: filter.brands || undefined,
      season: filter.season || undefined,
      materials: filter.materials || undefined,
      rating: filter.rating || undefined
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
      console.log(data)
    })
  }

}
