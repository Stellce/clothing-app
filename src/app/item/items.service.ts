import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, of, switchMap, take, tap} from "rxjs";
import {ItemsPage} from "../categories/list-items/item-card/res/items-page.model";
import {CatalogItem} from "../categories/list-items/item-card/item-card.model";
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

  constructor(private http: HttpClient) {}

  get page$() {
    return this._page$.asObservable();
  }

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    )
  }

  requestLandingPage() {
    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items/landing-page`
    ).pipe(tap(page => {
      this._page$.next(page);
      this.requestAllItemsImages(page);
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
      {params}
    ).pipe(tap(page => {
      this._page$.next(page);
      this.requestAllItemsImages(page);
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



  search(search: string) {
    let headers = new HttpHeaders().append('search', search);
    return this.http.get(environment.backendUrl + '/search', {headers});
  }


  // getLastOrder() {
  //   return of(this.mockOrder);
  // }

  // requestOrdersHistory() {
  //   let orders: Order[] = Array(5).fill(this.mockOrder);
  //   return of(orders);
  // }

  private requestAllItemsImages(page: ItemsPage) {
    page.content.forEach(contentItem => {
      this.requestItemImages(contentItem.id).subscribe(images => {
        let item: CatalogItem | undefined = page.content.find(i => i.id === contentItem.id);
        if(item) item.images = images;
        this._page$.next(page);
      });
    })
  }
}
