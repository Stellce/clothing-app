import {afterRender, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  isBrowser: boolean = false;
  localStorage: any = {
    getItem: () => JSON.stringify(''),
    setItem: () => JSON.stringify('')
  };
  constructor() {
    afterRender(() => {
      this.localStorage = localStorage;
    })
  }

  getItem(itemName: string) {
    return this.localStorage.getItem(itemName);
  }

  setItem(itemName: string, value: string) {
    this.localStorage.setItem(itemName, value);
  }

  removeItem(itemName: string) {
    this.localStorage.removeItem(itemName)
  }
}
