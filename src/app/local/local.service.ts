import { Injectable } from "@angular/core";
import { CartItem } from "../navigation/navbar/cart/cart-item.model";
import { LocalCartItem } from "./local-cart-item.model";

@Injectable({ providedIn: 'root' })
export class LocalService {
  _cartItems: CartItem[] = [];
  _favoritesIds: string[] = [];

  get cartItems() {
    this._cartItems = JSON.parse(localStorage.getItem("cart")) || [];
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
    localStorage.setItem("cart", JSON.stringify(originItems));
  }

  addToCart(item: LocalCartItem) {
    const cart: LocalCartItem[] = this.cartItems;
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartItem(localCartItem: LocalCartItem) {
    const cart: LocalCartItem[] = this.cartItems;
    const itemIndex = cart.findIndex(i => i.id === localCartItem.id);
    cart[itemIndex] = localCartItem;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  get favoritesIds(): string[] {
    return this._favoritesIds = JSON.parse(localStorage.getItem("favorites")) || [];
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
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  removeFromFavorites(itemId: string) {
    let favorites: string[] = this.favoritesIds;
    favorites = favorites.filter(id => id !== itemId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

}
