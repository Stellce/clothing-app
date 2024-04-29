import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../categories.service";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit{
  link: {name?: string, path?: string[]}[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.link = [{
        name: params.get('gender').toUpperCase() || '',
        path: ['/', 'products', params.get('gender')]
      }];
      if (params.has('categoryId')) {
        this.categoriesService.requestCategories().subscribe(categories => {
          let categoryName = categories
            .find(category => category.id === params.get('categoryId')).name;
          this.link.push({
            name: categoryName!,
            path: ['/', 'products', params.get('gender'), params.get('categoryId')]
          });
        });
      }
    });
  }
}
