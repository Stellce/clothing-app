import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemCard } from 'src/app/categories/list-items/item-card/item-card.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesUrl = environment.backendUrl + '/customers/wishlist';
  constructor(private http: HttpClient) {}

  getItems() {
    return this.http.get<ItemCard[]>(this.favoritesUrl);
  }

  addItem(id: string) {
    const params = new HttpParams({ fromObject: { id } });
    return this.http.post(this.favoritesUrl, {}, { params });
  }

  removeItem(id: string) {
    const params = new HttpParams({ fromObject: { id } });
    return this.http.delete(this.favoritesUrl, { params });
  }

  clear() {
    return this.http.delete(this.favoritesUrl + '/clear');
  }
}
