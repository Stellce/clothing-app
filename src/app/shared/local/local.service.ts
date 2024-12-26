import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalService {

  get favoritesIds(): string[] {
    return <string[]> [...new Set<string>(JSON.parse(localStorage?.getItem("favorites")))];
  }

  set favoritesIds(ids: string[]) {
    localStorage?.setItem("favorites", JSON.stringify(ids));
  }

  addToFavorites(itemId: string) {
    const favoritesIds = this.favoritesIds;
    favoritesIds.push(itemId);
    this.favoritesIds = favoritesIds;
  }

  removeFromFavorites(itemId: string) {
    this.favoritesIds = this.favoritesIds.filter(id => id !== itemId);
  }

}
