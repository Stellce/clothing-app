import {ChangeDetectionStrategy, Component, OnInit, Signal, signal, viewChild, WritableSignal} from '@angular/core';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDrawer, MatSidenavModule} from "@angular/material/sidenav";
import {MatTabChangeEvent, MatTabsModule} from "@angular/material/tabs";
import {ActivatedRoute} from "@angular/router";
import {ItemsService} from "../../item/items.service";
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FilterComponent} from './filter/filter.component';
import {Filter} from "./filter/filter.model";
import {ItemCardComponent} from './item-card/item-card.component';
import {ItemCard} from "./item-card/item-card.model";
import {ItemsParamsRequest} from "./item-card/req/items-params-request.model";
import {PaginatorComponent} from './paginator/paginator.component';
import {CategoriesService} from "../categories.service";
import {catchError, map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {Subcategory} from "../subcategory.model";

@Component({
    selector: 'app-list-items',
    templateUrl: './list-items.component.html',
    styleUrls: ['./list-items.component.scss'],
    imports: [MatSidenavModule, FilterComponent, BreadcrumbComponent, MatRippleModule, MatProgressSpinnerModule, MatTabsModule, ItemCardComponent, PaginatorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemsComponent implements OnInit {
  drawer = viewChild.required<MatDrawer>('drawer');
  items: Signal<ItemCard[]>;
  subcategories: Signal<Subcategory[]>;
  itemsParamsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  page: WritableSignal<{number: number, last: boolean}> = signal<{number: number, last: boolean}>({number: 0, last: false});

  constructor(
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.setPageUpdateListener();
    this.subcategories = toSignal(this.categoriesService.subcategoriesList$);
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.setItemsParamsRequest();
    this.setSubcategories();
    this.requestItems();
  }

  loadItemsBySubcategory(event: MatTabChangeEvent) {
    this.isLoading.set(true);
    if(event.tab.textLabel === 'All') return this.requestItems();
    let subcategory = this.subcategories()
      .find(subcategory =>
        subcategory.name.toLowerCase() === event.tab.textLabel.toLowerCase()
      );
    if(subcategory) this.itemsParamsRequest.subcategoryId = subcategory.id;
    this.requestItems();
  }

  filterItems(filter: Filter) {
    this.isLoading.set(true);
    let itemsRequest: ItemsParamsRequest = {
      ...this.itemsParamsRequest,
      ...filter
    };
    this.itemsService.requestItems(itemsRequest).subscribe();
    this.drawer().close();
  }

  changePage(pageNumber: number) {
    this.isLoading.set(true);
    this.itemsService.changePage(pageNumber).subscribe();
  }

  private setPageUpdateListener() {
    this.items = toSignal(this.itemsService.page$.pipe(map(page => {
      this.page.set({ number: page.number, last: page.last });
      this.isLoading.set(false);
      return page.content;
    })));
  }

  private setSubcategories() {
    if (!this.itemsParamsRequest.categoryId) return;
    this.categoriesService.requestSubcategories(this.itemsParamsRequest.categoryId);
  }

  private setItemsParamsRequest() {
    let params = this.activatedRoute.snapshot.params;
    this.itemsParamsRequest.gender = params['gender'];
    this.itemsParamsRequest.categoryId = params['categoryId'];
  }

  private requestItems() {
    this.itemsService.requestItems(this.itemsParamsRequest).pipe(
      catchError(
        (err, caught) => {
        console.error('Error on requesting items', err);
        return caught;
        }
      )
    ).subscribe();
  }
}
