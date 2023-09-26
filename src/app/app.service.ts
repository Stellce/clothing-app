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
  category: string;
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
      sort: filter.sortBy,
      priceRange: [filter.priceFrom, filter.priceTo].join(","),
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
      console.log(data)
    })
  }

}
