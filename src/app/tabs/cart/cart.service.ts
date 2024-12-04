import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { CartItem } from "./cart-item.model";
import { UpdateCartItemReq } from "./req/update-cart-req.model";
import { AddCartReq } from "./req/add-cart-req.model";
import {AddCartRes} from "./res/add-cart-res.model";

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartUrl = environment.backendUrl + '/orders/cart';
  cartItems: CartItem[];
  constructor(private http: HttpClient) {}

  getItems() {
    return this.http.get<CartItem[]>(this.cartUrl);
  }

  addItem(cartItem: AddCartReq) {
    return this.http.post<AddCartRes>(this.cartUrl, cartItem);
  }

  updateItem(cartItem: UpdateCartItemReq) {
    let params = new HttpParams();
    Object.entries(cartItem).forEach(([k, v]) => {
      if (!v) return;
      params = params.append(k, v);
    });
    return this.http.put(this.cartUrl, {}, { params });
  }

  removeEntry(entryId: string) {
    let params = new HttpParams().set('entryId', entryId);
    return this.http.delete(this.cartUrl, { params });
  }

  clear() {
    return this.http.delete(this.cartUrl + '/clear');
  }
}
