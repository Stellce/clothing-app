import {afterRender, Inject, Injectable, OnInit, PLATFORM_ID} from "@angular/core";
import { CartItem } from "../navigation/navbar/cart/cart-item.model";
import { LocalCartItem } from "./local-cart-item.model";
import {CartService} from "../navigation/navbar/cart/cart.service";
import {isPlatformBrowser} from "@angular/common";
import {AppComponent} from "../app.component";
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";

@Injectable({ providedIn: 'root' })
export class LocalService {
  _cartItems: CartItem[] = [];
  _favoritesIds: string[] = [];

  constructor(private localStorage: LocalStorageService) {}

  get cartItems() {
    this._cartItems = JSON.parse(this.localStorage.getItem("cart")) || [];
    return this._cartItems;
  }

  getCartItems() {
    this.removeSimilar();
    return this.cartItems;
  }

  removeSimilar() {
    let cart: LocalCartItem[] = this.cartItems;
    let originItems: LocalCartItem[] = [];
    cart.forEach(cartItem => {
      let item = originItems.find(i => i.id === cartItem.id && i.itemSize === cartItem.itemSize);
      if (item) item.quantity += cartItem.quantity;
      else originItems.push(cartItem);
    });
    this.localStorage.setItem("cart", JSON.stringify(originItems));
  }

  addToCart(item: LocalCartItem) {
    const cart: LocalCartItem[] = this.cartItems;
    cart.push(item);
    this.localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartItem(localCartItem: LocalCartItem) {
    const cart: LocalCartItem[] = this.cartItems;
    const itemIndex = cart.findIndex(i => i.id === localCartItem.id);
    cart[itemIndex] = localCartItem;
    this.localStorage.setItem("cart", JSON.stringify(cart));
  }

  get favoritesIds(): string[] {
    return this._favoritesIds = JSON.parse(this.localStorage.getItem("favorites")) || [];
  }

  set favoritesIds(ids: string[]) {
    this._favoritesIds = ids;
  }

  getFavoritesIds(): string[] {
    return this.favoritesIds = [...new Set(this.favoritesIds)];
  }

  addToFavorites(itemId: string) {
    const favorites: string[] = this.favoritesIds;
    favorites.push(itemId);
    this.localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  removeFromFavorites(itemId: string) {
    let favorites: string[] = this.favoritesIds;
    favorites = favorites.filter(id => id !== itemId);
    this.localStorage.setItem("favorites", JSON.stringify(favorites));
  }



}
