import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterModel} from "./filter.model";
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

  getItems(gender: 'male' | 'female' | 'children', categoryId: number) {
    this.http.get<ResponseModel>(`http://localhost:8765/items/gender/${gender}/category/${categoryId}`).subscribe( data => {
      this.items = [...data.content];
      this.itemsUpdated.next([...data.content]);
      console.log(data)
    })
  }

  getItemsByFilter(gender: 'male' | 'female' | 'children', categoryId: number, filter: FilterModel) {
    let filterParams = new HttpParams();
    for (let [param, value] of Object.entries(filter)) {
      if (Array.isArray(value)) value = value.join(',');
      filterParams = filterParams.append(param, value);
    }

    this.http
      .get<ResponseModel>(
        `http://localhost:8765/items/gender/${gender}/category/${categoryId}`,
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
