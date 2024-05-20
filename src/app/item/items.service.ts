import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, of, switchMap, take, tap} from "rxjs";
import {ItemsPage} from "../categories/list-items/item-card/res/items-page.model";
import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemsParamsRequest} from "../categories/list-items/item-card/req/items-params-request.model";
import {Order} from "./order.model";
import {Item} from "./item.model";

@Injectable({providedIn: 'root'})
export class ItemsService {
  private _cachedItemsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  private _page$ = new BehaviorSubject<ItemsPage>(null);
  private pageSize = 6*4;

  private mockItemBar: Order = {
    id: 'asd',
    name: 'Air 2',
    images: [
      '/assets/test/test (1).jpg',
      '/assets/test/test (2).jpg',
      '/assets/test/test (3).jpg',
      '/assets/test/test (4).jpg',
      '/assets/test/test (5).jpg',
    ],
    price: 12.99,
    brand: 'Nike',
    discount: 25,
    isNew: true,
    isOnWishList: true,
    isPopular: true,
    priceAfterDiscount: 10.99
  }
  private mockOrder: Order = {
    ...this.mockItemBar,
    deliveryStatus: 'packaging',
    orderDate: '01.01.2024'
  }
  private mockItem: Item = {
    ...this.mockItemBar,
    params: {
      materials: ['WOOL'],
      brand: 'SpeedFinch',
      colors: ['red', 'green', 'blue'],
      model: 'Speed 2.0'
    },
    reviews: []
  }

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
    return this.http.get<{imageId: string, image: string}[]>(
      environment.backendUrl + `/catalog/items/${itemId}/images`
    );
  }

  requestItemById(itemId: string) {
    // Test
    // this._item$.next(this.mockItem);
    return of(this.mockItem);

    // return this.http.get<Item>(
    //   environment.backendUrl + itemId
    // ).pipe(take(1), tap(item => this._item$.next(item)));
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

  search(search: string) {
    let headers = new HttpHeaders().append('search', search);
    return this.http.get(environment.backendUrl + '/search', {headers});
  }

  requestFavorites() {
    let items: Order[] = Array(5).fill(this.mockItemBar);
    return of(items);
  }

  getLastOrder() {
    return of(this.mockOrder);
  }

  requestOrdersHistory() {
    let orders: Order[] = Array(5).fill(this.mockOrder);
    return of(orders);
  }

  requestCartItems() {
    let orders: Order[] = Array(5).fill(this.mockOrder);
    return of(orders);
  }

  private requestAllItemsImages(page: ItemsPage) {
    page.content.forEach(item => {
      this.requestItemImages(item.id).subscribe(images => {
        let newItem: ItemCard | undefined = page.content.find(i => i.id === item.id);
        if(newItem)
          newItem.images = images.map(i => i.image);
        this._page$.next(page);
      });
    })
  }
}
