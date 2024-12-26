import {afterNextRender, inject, Injectable, Injector} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalService {
  private injector = inject(Injector);

  get favoritesIds(): string[] {
    return <string[]> [...new Set<string>(JSON.parse(localStorage?.getItem("favorites")))];
  }

  set favoritesIds(ids: string[]) {
    localStorage?.setItem("favorites", JSON.stringify(ids));
  }

  addToFavorites(itemId: string) {
    afterNextRender(() => {
      const favoritesIds = this.favoritesIds;
      favoritesIds.push(itemId);
      this.favoritesIds = favoritesIds;
    }, {injector: this.injector});
  }

  removeFromFavorites(itemId: string) {
    afterNextRender(() => {
      this.favoritesIds = this.favoritesIds.filter(id => id !== itemId);
    }, {injector: this.injector});
  }

}
