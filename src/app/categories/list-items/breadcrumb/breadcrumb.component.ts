import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CategoriesService } from "../../categories.service";
import {FieldToTextPipe} from "../../../pipes/field-to-text";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: true,
  imports: [RouterLink, FieldToTextPipe]
})
export class BreadcrumbComponent implements OnInit{
  @Input() default: {name: string, path: string[]}[];
  @Input() itemName: string;
  firstLink: {name: string, path: string[]};
  links: {name: string, path: string[]}[] = [
    {name: 'Dashboard', path: ['/']}
  ];
  afterLinks: {name: string, path: string[]}[] = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    if (this.default) this.links = this.default;
    this.setProductLinks();
    this.firstLink = this.links[0];
    this.links = this.links.slice(1);
  }

  private setProductLinks() {
    this.activatedRoute.paramMap.subscribe(params => {
      if(!params.get('gender')) return;

      let path: string[] = ['/', 'products', params.get('gender')];
      this.links.push({
        name: params.get('gender').toUpperCase(),
        path: [...path]
      });
      if (params.has('categoryId')) {
        this.categoriesService.categoriesList$.subscribe(categories => {
          if(!categories) return;

          let categoryId: string = params.get('categoryId');
          let categoryName = categories
            .find(category => category.id === categoryId).name;

          path.push(categoryId);
          this.links.push({
            name: categoryName!,
            path: [...path]
          });
          if(this.itemName) {
            this.links.push({
              name: this.itemName,
              path: null
            });
          }
        });
      }
    });
  }
}
