import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {CategoriesService} from "../../categories/categories.service";
import {Category} from "../../categories/category.model";
import {take} from "rxjs";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit{
  url: UrlSegment[];
  params: {gender?: string, categoryId?: string};
  i = 0;
  link: {name: string, path: string}[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.url = this.activatedRoute.snapshot.url;
    this.params = this.activatedRoute.snapshot.params;
    console.log(this.url, this.params);

    this.link = [
      {name: this.params.gender!.toUpperCase(), path: this.params.gender!},
    ];
    if (this.params.categoryId) {
      this.categoriesService.requestCategories().subscribe(categories => {
        console.log(categories)
        let categoryName = categories
          .find(category => category.id === this.params.categoryId)?.name;
        this.link.push({
          name: categoryName!,
          path: this.params.gender + '/' + this.params.categoryId!
        })
      });
    }

  }

  test(s: string) {
    console.log(s)
  }

  generateLink(length: number) {
    let link = "";
    // console.log(this.url, this.i);
    this.i++;
    for(let i = 0; i<=length; i++) {
      link += '/' + this.url[i].path;
    }
    // this.generateByParams();
    // console.log(link);
    return link;
  }

  generateByParams() {
    this.categoriesService.requestCategories().subscribe(categories => {
      let categoryName = categories
        .find(category => category.id === this.params.categoryId)?.name;
      let link = '/' + this.params.gender + '/' + categoryName;
      console.log(link);
      return link;
    });
  }

  protected readonly Object = Object;
}
