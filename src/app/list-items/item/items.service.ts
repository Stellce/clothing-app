import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Category} from "../category.model";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class ItemsService {
  gender: string;
  categoryId: string;

  constructor(private http: HttpClient) {}
  requestCategories(gender: string) {
    let url = environment.backendUrl + '/catalog/categories';
    return this.http.get<Category[]>(
      url,
      {params: new HttpParams().append('gender', gender)}
    )
  }
}
