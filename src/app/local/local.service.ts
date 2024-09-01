import { Injectable } from "@angular/core";
import { CartItem } from "../navigation/bottom-navbar/cart/cart-item.model";
import { ItemCard } from "../categories/list-items/item-card/item-card.model";
import { LocalCartItem } from "./local-cart-item.model";

@Injectable({ providedIn: 'root' })
export class LocalService {
  
  getCartItems() {
    const cart: LocalCartItem[] = JSON.parse(localStorage.getItem("cart")) || [];
    return cart
  }
  
  addToCart(itemId: LocalCartItem) {
    const cart: LocalCartItem[] = this.getCartItems();
    cart.push(itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartItem(localCartItem: LocalCartItem) {
    const cart: LocalCartItem[] = this.getCartItems();
    const itemIndex = cart.findIndex(i => i.id === localCartItem.id);
    cart[itemIndex] = localCartItem;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  getFavoritesIds() {
    const favorites: string[] = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites;
  }

  addToFavorites(itemId: string) {
    const favorites: string[] = this.getFavoritesIds();
    favorites.push(itemId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  removeFromFavorites(itemId: string) {
    let favorites: string[] = this.getFavoritesIds();
    favorites = favorites.filter(id => id !== itemId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}