import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../categories.service";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit{
  params: {gender?: string, categoryId?: string};
  link: {name?: string, path?: string}[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.params = this.activatedRoute.snapshot.params;

    this.link = [
      {
        name: this.params.gender?.toUpperCase(),
        path: this.params.gender
      },
    ];
    if (this.params.categoryId) {
      this.categoriesService.requestCategories().subscribe(categories => {
        let categoryName = categories
          .find(category => category.id === this.params.categoryId)?.name;
        this.link.push({
          name: categoryName!,
          path: this.params.gender + '/' + this.params.categoryId!
        });
      });
    }
  }

  protected readonly Object = Object;
}
