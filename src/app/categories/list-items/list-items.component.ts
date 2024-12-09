import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
  WritableSignal
} from '@angular/core';
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
import {DialogData} from "../../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-list-items',
    templateUrl: './list-items.component.html',
    styleUrls: ['./list-items.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatSidenavModule, FilterComponent, BreadcrumbComponent, MatRippleModule, MatProgressSpinnerModule, MatTabsModule, ItemCardComponent, PaginatorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemsComponent implements OnInit{
  drawer = viewChild.required<MatDrawer>('drawer');
  items: WritableSignal<ItemCard[]> = signal<ItemCard[]>([]);
  subcategories: WritableSignal<{id: string; name: string}[]> = signal<{id: string; name: string}[]>([]);
  itemsParamsRequest: ItemsParamsRequest = {} as ItemsParamsRequest;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  page: WritableSignal<{number: number, last: boolean}> = signal<{number: number, last: boolean}>({number: 0, last: false});
  constructor(
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.itemsService.page$.subscribe(page => {
      if(!page) return;
      this.isLoading.set(false);
      this.items.set(page.content);
      this.page.set({ number: page.number, last: page.last });
    });

    let params = this.activatedRoute.snapshot.params;
    this.itemsParamsRequest.gender = params['gender'];
    this.itemsParamsRequest.categoryId = params['categoryId'];

    this.isLoading.set(true);
    this.categoriesService.requestSubcategories(this.itemsParamsRequest.categoryId).subscribe({
      next: subcategories => {
        this.subcategories.set(subcategories);
      },
      error: err => {
        const data: DialogData = {
          title: `Error on requesting subcategories`,
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
    this.requestItems();
  }

  loadItemsBySubcategory(event: MatTabChangeEvent) {
    this.isLoading.set(true);
    this.items.set([]);
    if(event.tab.textLabel === 'All') return this.requestItems();
    let subcategory = this.subcategories()
      .find(subcategory =>
        subcategory.name.toLowerCase() === event.tab.textLabel.toLowerCase()
      );
    if(subcategory) this.itemsParamsRequest.subcategoryId = subcategory.id;
    this.requestItems();
  }

  private requestItems() {
    this.itemsService.requestItems(this.itemsParamsRequest).subscribe({
      next: page => {
        this.isLoading.set(false);
        this.page.set({ number: page.number, last: page.last });
        this.items.set(page.content);
      },
      error: err => {
        const data: DialogData = {
          title: `Error on requesting items`,
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  filterItems(filter: Filter) {
    let itemsRequest: ItemsParamsRequest = {
      ...this.itemsParamsRequest,
      ...filter
    };
    this.itemsService.requestItems(itemsRequest).subscribe();
    this.drawer().close();
  }

  changePage(pageNumber: number) {
    this.itemsService.changePage(pageNumber).subscribe(page => {
      this.items.set(page.content);
      this.page.set({ number: page.number, last: page.last });
    });
  }
}
