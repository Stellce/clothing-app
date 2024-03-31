import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Category} from "./category.model";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  requestCategories() {
    return this.http.get<Category[]>(
      environment.backendUrl + '/catalog/categories'
    )
  }

  requestCategoriesImages(gender: string) {
    return this.http.get<{[categoryId: string]: string}>(
      environment.backendUrl + '/catalog/categories/images',
      {params: new HttpParams().append('gender', gender)}
      )
  }
}
