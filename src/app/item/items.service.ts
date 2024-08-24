import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, of, switchMap, take, tap} from "rxjs";
import {ItemsPage} from "../categories/list-items/item-card/res/items-page.model";
import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemsParamsRequest} from "../categories/list-items/item-card/req/items-params-request.model";
import {Order} from "./order.model";
import {ItemDetails} from "./item.model";
import {Image} from "./image.model";
import {OrderItem} from "../order-page/order-item.model";

@Injectable({providedIn: 'root'})
export class ItemsService {
  private _cachedItemsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  private _page$ = new BehaviorSubject<ItemsPage>(null);
  private pageSize = 6*4;
  private ordersItems: OrderItem[];

  constructor(private http: HttpClient) {}

  get page$() {
    return this._page$.asObservable();
  }

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    )
  }

  requestLandingPageItems() {
    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items/landing-page`
    ).pipe(take(1), switchMap(page => {
      this._page$.next(page);
      this.requestAllItemsImages(page);
      return of(page);
    }));
  }

  requestItems(itemsRequest: ItemsParamsRequest) {
    this._cachedItemsRequest = itemsRequest;
    let params = new HttpParams();
    Object.entries(itemsRequest).forEach(([k,v]) => {
      if(!v) return;
      params = params.append(k,v);
    })
    params = params.append('pageSize', this.pageSize);
    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
      {params: params}
    ).pipe(take(1), switchMap(page => {
      this._page$.next(page);
      this.requestAllItemsImages(page);
      return of(page);
    }))
  }

  requestItemImages(itemId: string) {
    return this.http.get<Image[]>(
      environment.backendUrl + `/catalog/items/${itemId}/images`
    );
  }

  requestItemById(itemId: string) {
    return this.http.get<ItemDetails>(
      environment.backendUrl + '/catalog/items/' + itemId
    );
  }

  requestBrands() {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/brands`
    )
  }

  changePage(pageNumber: number) {
    let params = new HttpParams();
    Object.entries(this._cachedItemsRequest).forEach(([k,v]) => {
      if(v) params = params.append(k, v);
    })
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', this.pageSize);

    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
      {params: params}
    ).pipe(tap(page => {
      this._page$.next(page);
      this.requestAllItemsImages(page);
    }));
  }

  addToCart(orderItem: OrderItem) {
    const cart: OrderItem[] = JSON.parse(localStorage.getItem("orders"));
    cart.push(orderItem);
    this.ordersItems = cart;
    localStorage.setItem("orders", JSON.stringify(cart));
  }

  search(search: string) {
    let headers = new HttpHeaders().append('search', search);
    return this.http.get(environment.backendUrl + '/search', {headers});
  }

  // requestFavorites() {
  //   let items: Order[] = Array(5).fill(this.mockItemBar);
  //   return of(items);
  // }

  // getLastOrder() {
  //   return of(this.mockOrder);
  // }

  // requestOrdersHistory() {
  //   let orders: Order[] = Array(5).fill(this.mockOrder);
  //   return of(orders);
  // }

  requestCartItems() {
    // let orders: Order[] = Array(5).fill(this.mockOrder);
    // return of(orders);
    return JSON.parse(localStorage.getItem("cart"));
  }

  private requestAllItemsImages(page: ItemsPage) {
    page.content.forEach(item => {
      this.requestItemImages(item.id).subscribe(images => {
        let newItem: ItemCard | undefined = page.content.find(i => i.id === item.id);
        if(newItem)
          newItem.images = images;
        this._page$.next(page);
      });
    })
  }

  private readCart() {
    this.ordersItems = JSON.parse(localStorage.getItem("orders"));
  }
}
