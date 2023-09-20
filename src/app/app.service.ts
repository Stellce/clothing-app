import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterModel} from "./filter.model";
import {ItemModel} from "./item.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  items = new Subject<ItemModel[]>;
  constructor(private http: HttpClient) {}


  getAll(filter?: FilterModel) {
    const response = [150, [
      '5543', 'Name', '4553', 'true', 'photos', 'brand'
    ]]
    let item: ItemModel =
        {
          id: 450945,
          name: "Adidas Gazelle",
          price: 20,
          wlist: true,
          photos: ["assets/nizza-platform-shoes.avif"],
          brand: "Adidas",
          rating: 4.0,
          all_colors: true,
          discount: 0,
          new: false,
          popular: true
        }
    let items: ItemModel[] = Array(20).fill(item);
    console.log(items);
    this.items.next(items);
  }
}
