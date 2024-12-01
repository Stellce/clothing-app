import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateItem} from "../item/item.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  addToLandingPage(ids: string) {
    let params = new HttpParams().set('ids', ids);
    return this.http.post(environment.backendUrl + '/catalog/items/landing-page', {params});
  }

  deleteFromLandingPage(ids: string) {
    let params = new HttpParams().set('ids', ids);
    return this.http.delete(environment.backendUrl + '/catalog/items/landing-page', {params});
  }

  createItem(item: CreateItem) {
    return this.http.post(environment.backendUrl + '/catalog/items', item);
  }

  updateItem(itemId: string, item: CreateItem) {
    return this.http.post(environment.backendUrl + '/catalog/items/' + itemId, item);
  }

  deleteItem(itemId: string) {
    return this.http.delete(environment.backendUrl + '/catalog/items?itemId=' + itemId);
  }
}
