import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterModel} from "./filter.model";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {}

  getAll(filter?: FilterModel) {
    const response = [150, [
      '5543', 'Name', '4553', 'true', 'photos', 'brand'
    ]]
  }
}
