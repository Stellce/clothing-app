import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Category} from "./category.model";
import {CategoriesService} from "./categories.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
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

      this.categoriesService.requestCategories()
        .subscribe(categories => {
          this.isLoading = false;
          this.categories = categories;

          this.categoriesService.requestCategoriesImages(this.gender)
            .subscribe(categoriesImages => {
              Object.entries(categoriesImages).forEach(([categoryId, image]) => {
                categories.find(category => category.id === categoryId)!.image = image;
              });
            })
        });
    })
  }
}
