import {LowerCasePipe, UpperCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {CategoriesService} from "./categories.service";
import {Category} from "./category.model";
import {BreadcrumbComponent} from './list-items/breadcrumb/breadcrumb.component';
import {toSignal} from "@angular/core/rxjs-interop";
import {map, take, tap} from "rxjs";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [BreadcrumbComponent, MatProgressSpinnerModule, RouterLink, UpperCasePipe, LowerCasePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {
  categories: WritableSignal<Category[]> = signal<Category[]>(null);
  isLoading: WritableSignal<boolean> = signal(true);
  params: Signal<Params>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.isLoading.set(true);
      this.categoriesService.categoriesList$.subscribe(categories => {
        this.categories.set(categories);
        this.isLoading.set(false);

        this.categoriesService.requestCategoriesImages(params['gender'])
          .subscribe(categoriesImages => {
            this.categories.update(categories =>
              categories.map(category => {
                category.image = categoriesImages[category.id];
                return category;
              })
            );
          });
      });
    });
  }
}
