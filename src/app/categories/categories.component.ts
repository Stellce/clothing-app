import { LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.model";
import { BreadcrumbComponent } from './list-items/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [BreadcrumbComponent, MatProgressSpinnerModule, RouterLink, UpperCasePipe, LowerCasePipe]
})
export class CategoriesComponent implements OnInit{
  categories: Category[];
  gender: string;
  isLoading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.gender = params['gender'];

      this.categoriesService.categoriesList$
        .subscribe(categories => {
          if(!categories) return
          this.isLoading = false;
          this.categories = categories;

          this.categoriesService.requestCategoriesImages(this.gender)
            .subscribe(categoriesImages => {
              if(!categoriesImages) return;
              categories = categories.map(category => {
                category.image = categoriesImages[category.id];
                return category;
              });
            });
        });
    })
  }
}
