import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, filter, Observable, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {CatalogItem, ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemsParamsRequest} from "../categories/list-items/item-card/req/items-params-request.model";
import {Page} from "../categories/list-items/item-card/res/page.model";
import {Image} from "./image.model";
import {ItemDetails} from "./item.model";

@Injectable({providedIn: 'root'})
export class ItemsService {
  private _cachedItemsRequest: ItemsParamsRequest = null;
  private _page$: BehaviorSubject<Page<ItemCard[]>> = new BehaviorSubject<Page<ItemCard[]>>(null);
  private pageSize: number = 6*4;

  get page$() {
    return this._page$.asObservable().pipe(filter(page => !!page));
  }

  constructor(private http: HttpClient) {}

  requestLandingPage() {
    return this.http.get<Page<CatalogItem[]>>(
      environment.backendUrl + `/catalog/items/landing-page`
    );
  }

  requestItems(itemsRequest: ItemsParamsRequest) {
    this._cachedItemsRequest = itemsRequest;
    let params = new HttpParams();
    Object.entries(itemsRequest).forEach(([k,v]) => {
      if(!v) return;
      params = params.append(k,v);
    })
    params = params.append('pageSize', this.pageSize);
    return this.http.get<Page<CatalogItem[]>>(
      environment.backendUrl + `/catalog/items`,
      {params}
    ).pipe(tap(page => {
      this._page$.next(page);
    }));
  }

  requestItemImages(itemId: string): Observable<Image[]> {
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
    });
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', this.pageSize);

    return this.http.get<Page<CatalogItem[]>>(
      environment.backendUrl + `/catalog/items`,
      {params}
    ).pipe(tap(page => {
      this._page$.next(page);
    }));
  }

  search(searchPattern: string) {
    let params = new HttpParams();
    params = params.append('searchPattern', searchPattern)
    return this.http.get<Page<CatalogItem[]>>(
      environment.backendUrl + '/catalog/items',
      {params}
    ).pipe(tap(page => {
      this._page$.next(page);
    }));
  }
}
