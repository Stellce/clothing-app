import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

  constructor(private http: HttpClient) {}


  getItemsFaked(filter?: FilterModel) {
    const response = [150, [
      '5543', 'Name', '4553', 'true', 'photos', 'brand'
    ]]
    let item =
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
    this.itemsUpdated.next(items);
  }

  getItems(gender: 'male' | 'female' | 'children', categoryId: number) {
    console.log("Gender/categoryId");
    console.log(gender, categoryId);

    return this.getItemsFaked();

    // this.http.get<ResponseModel>(`localhost:8000/items/gender/${this.gender}/category/${this.categoryId}`).subscribe( data => {
    //   this.items = [...data.content];
    //   this.itemsUpdated.next([...data.content]);
    //   // console.log(data)
    // })

    // list-item checks gender and category, maybe filter, sends req to service, receives data
  }

}
