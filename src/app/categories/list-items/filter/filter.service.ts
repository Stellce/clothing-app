import {Injectable} from "@angular/core";
import {AllowedFilters} from "./allowed-filters.model";
import {SelectedFilters} from "./selected-filters.model";

@Injectable({providedIn: "root"})
export class FilterService {
  private _allowedFilters: AllowedFilters = {
    colors: ['black', 'white', 'red', 'yellow', 'green', 'blue', 'violet', 'grey', 'multi'],
    sizes: [],
    sort: [
      {
        name: 'popularity',
        value: 'popularity'
      },
      {
        name: 'price from lowest',
        value: 'price_asc'
      },
      {
        name: 'price from highest',
        value: 'price_desc'
      },
      {
        name: 'newest',
        value: 'newest'
      }
    ],
    brands: [{id: '', name: ''}],
    seasons: ['WINTER', 'SPRING', 'SUMMER', 'AUTUMN', 'MULTISEASON'],
    materials: ['DENIM', 'LEATHER', 'WOOL', 'COTTON', 'ARTIFICIAL_LEATHER', 'SYNTHETICS']
  };
  private _selectedFilters: SelectedFilters = {
    brands: [],
    colors: [],
    seasons: [],
    materials: []
  };
  private _sizesClothes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  private _sizesShoes: string[] = [];

  get allowedFilters() {
    return this._allowedFilters;
  }

  get sizesClothes() {
    return this._sizesClothes;
  }

  get selectedFilters() {
    return this._selectedFilters;
  }

  get sizesShoes() {
    for (let i=30;i<=46;i++) {
      this._sizesShoes.push(String(i));
    }
    return this._sizesShoes;
  }
}
