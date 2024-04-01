import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Category} from "./category.model";
import {take, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private _categoriesList: Category[] = [];
  constructor(private http: HttpClient) {}
  get categoriesList() {
    return this._categoriesList;
  }
  requestCategories() {
    return this.http.get<Category[]>(
      environment.backendUrl + '/catalog/categories'
    ).pipe(take(1), tap(categories => this._categoriesList = categories));
  }

  requestCategoriesImages(gender: string) {
    return this.http.get<{[categoryId: string]: string}>(
      environment.backendUrl + '/catalog/categories/images',
      {params: new HttpParams().append('gender', gender)}
      )
  }
}
