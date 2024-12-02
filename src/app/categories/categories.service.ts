import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, map} from "rxjs";
import {environment} from "../../environments/environment";
import {Category} from "./category.model";
import {FieldToTextPipe} from "../pipes/field-to-text";
import {DialogData} from "../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private _categoriesList$: BehaviorSubject<Category[]> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private fieldToTextPipe: FieldToTextPipe,
    private dialog: MatDialog
  ) {}

  get categoriesList$() {
    if(!this._categoriesList$.value) this.requestCategories();
    return this._categoriesList$.asObservable();
  }
  requestCategories() {
    return this.http.get<Category[]>(
      environment.backendUrl + '/catalog/categories'
    ).subscribe({
      next: categories => this._categoriesList$.next(categories),
      error: err => {
        const data: DialogData = {
          title: `Unable to load categories`,
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  requestCategoriesImages(gender: string) {
    return this.http.get<{[categoryId: string]: string}>(
      environment.backendUrl + '/catalog/categories/images',
      {params: new HttpParams().append('gender', gender)}
    )
  }

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    ).pipe(map(subcategories => {
      return subcategories.map(subcategory => {
        return {...subcategory, name: this.fieldToTextPipe.transform(subcategory.name)};
      })
    }));
  }
}
