import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, filter, map, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {Category} from "./category.model";
import {FieldToTextPipe} from "../shared/pipes/field-to-text";
import {Subcategory} from "./subcategory.model";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private _categoriesList$: BehaviorSubject<Category[]> = new BehaviorSubject(null);
  private _subcategoriesList$: BehaviorSubject<Subcategory[]> = new BehaviorSubject(null);
  private isCategoriesRequestPending: boolean = false;
  private isSubcategoriesRequestPending: boolean = false;

  constructor(
    private http: HttpClient,
    private fieldToTextPipe: FieldToTextPipe
  ) {}

  get categoriesList$() {
    if(!this._categoriesList$.value && !this.isCategoriesRequestPending) {
      this.requestCategories();
      this.isCategoriesRequestPending = true;
    }
    return this._categoriesList$.asObservable();
  }
  get subcategoriesList$() {
    if(!this._subcategoriesList$.value && !this.isSubcategoriesRequestPending) {
      this.requestCategories();
      this.isSubcategoriesRequestPending = true;
    }
    return this._subcategoriesList$.asObservable();
  }
  requestCategories() {
    return this.http.get<Category[]>(
      environment.backendUrl + '/catalog/categories'
    )
      .pipe(
        filter(c => !!c),
        tap(() => this.isCategoriesRequestPending = false)
      )
      .subscribe({
        next: categories => {
          this._categoriesList$.next(categories);
        },
        error: err => {
          console.error(err);
        }
      });
  }

  requestCategoriesImages(gender: string) {
    return this.http.get<{[categoryId: string]: string}>(
      environment.backendUrl + '/catalog/categories/images',
      {params: new HttpParams().append('gender', gender.toLowerCase())}
    ).pipe(filter(i => !!i));
  }

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    ).pipe(
      tap(() => this.isCategoriesRequestPending = false),
      map(subcategories => {
        return subcategories.map(subcategory => {
          return {...subcategory, name: this.fieldToTextPipe.transform(subcategory.name)};
        })
      })
    )
    .subscribe({
      next: subcategories => {
        this._subcategoriesList$.next(subcategories);
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
