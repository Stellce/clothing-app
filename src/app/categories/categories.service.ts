import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Category} from "./category.model";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private _categoriesList$: BehaviorSubject<Category[]> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}
  get categoriesList$() {
    if(!this._categoriesList$.value) this.requestCategories();
    return this._categoriesList$.asObservable();
  }
  requestCategories() {
    return this.http.get<Category[]>(
      environment.backendUrl + '/catalog/categories'
    ).subscribe(categories => this._categoriesList$.next(categories));
  }

  requestCategoriesImages(gender: string) {
    return this.http.get<{[categoryId: string]: string}>(
      environment.backendUrl + '/catalog/categories/images',
      {params: new HttpParams().append('gender', gender)}
    )
  }
}
