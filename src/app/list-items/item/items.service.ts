import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, of, switchMap, take, tap} from "rxjs";
import {ItemsPage} from "./res/items-page.model";
import {Item} from "./item.model";
import {ItemsParamsRequest} from "./req/items-params-request.model";

@Injectable({providedIn: 'root'})
export class ItemsService {
  private _cachedItemsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  private _items$ = new BehaviorSubject<Item[]>([]);

  constructor(private http: HttpClient) {}

  get items$() {
    return this._items$.asObservable();
  }

  requestSubcategories(category: string) {
    return this.http.get<{id: string, name: string}[]>(
      environment.backendUrl + `/catalog/categories/${category}/subcategories`
    )
  }

  requestItems(itemsRequest: ItemsParamsRequest) {
    this._cachedItemsRequest = itemsRequest;
    let params = new HttpParams();
    console.log('itemsRequest', itemsRequest);
    Object.entries(itemsRequest).forEach(([k,v]) => {
      if(!v) return;
      console.log(k, v)
      params = params.append(k,v);
    })
    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
      {params: params}
    ).pipe(take(1), switchMap(itemsPage => {
      let items = itemsPage.content;
      this._items$.next(items);
      this.requestAllItemsImages(items);
      return of(items);
    }))
  }

  requestItemImages(itemId: string) {
    return this.http.get<{imageId: string, image: string}[]>(
      environment.backendUrl + `/catalog/items/${itemId}/images`
    );
  }

  requestBrands() {
    return this.http.get<{id: number, name: string}[]>(
      environment.backendUrl + `/catalog/brands`
    )
  }

  changePage(pageNumber: number) {
    let pageParams = new HttpParams();
    Object.entries(this._cachedItemsRequest).forEach(([k,v]) => {
      if(v) pageParams.append(k, v);
    })
    pageParams = pageParams.append('pageNumber', pageNumber);

    return this.http.get<ItemsPage>(
      environment.backendUrl + `/catalog/items`,
      {params: pageParams}
    ).pipe(tap(page => {
      let items = page.content;
      this._items$.next(items);
      this.requestAllItemsImages(items);
    }));
  }

  private requestAllItemsImages(items: Item[]) {
    items.forEach(item => {
      this.requestItemImages(item.id).subscribe(images => {
        let newItem: Item | undefined = items.find(i => i.id === item.id);
        if(newItem)
          newItem.images = images.map(i => i.image);
        this._items$.next(items);
      });
    })
  }
}
