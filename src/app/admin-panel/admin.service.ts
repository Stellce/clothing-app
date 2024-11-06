import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  addToLandingPage(ids: string) {
    let params = new HttpParams().set('ids', ids);
    return this.http.post(environment.backendUrl + '/catalog/items/landing-page', {params});
  }

  deleteFromLandingPage(ids: string) {
    let params = new HttpParams().set('ids', ids);
    return this.http.delete(environment.backendUrl + '/catalog/items/landing-page', {params});
  }
}
