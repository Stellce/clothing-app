import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppService} from "../app.service";
import {Category} from "../list-items/category.model";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit{

  categories: Category[];
  childGenders: string[] = ['boys', 'girls']
  gender: string;
  isLoading: boolean;

  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.url.subscribe(url => {
      this.gender = url[0].path;
      this.appService.gender = this.gender;

      this.appService.getCategories()
        .subscribe(categories => {
          this.isLoading = false;
          this.categories = categories;
          console.log(categories)
        });
    })
  }

  onCategorySelect(categoryId: number) {
    this.appService.categoryId = categoryId;
  }

}
