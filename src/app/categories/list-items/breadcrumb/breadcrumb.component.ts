import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CategoriesService } from "../../categories.service";
import {FieldToTextPipe} from "../../../shared/pipes/field-to-text";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    imports: [RouterLink, FieldToTextPipe]
})
export class BreadcrumbComponent implements OnInit{
  @Input() default: {name: string, path: string[]}[];
  @Input() itemName: string;
  homeLink: {name: string, path: string[]};
  links: {name: string, path: string[]}[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.links.push({name: 'Landing', path: ['/']});
    if (this.default && this.default.length) this.links = this.default;
    this.setProductLinks();
    this.homeLink = this.links[0];
    this.links.shift();
  }

  private setProductLinks() {
    this.activatedRoute.paramMap.subscribe(params => {
      const gender = params.get('gender');

      if(!gender) return;

      let path: string[] = ['/', 'products', gender];
      const genderLink = {
        name: gender.toUpperCase(),
        path: [...path]
      };

      const genderLinkIndex = this.links.findIndex(l => ['MEN', 'WOMEN'].includes(l.name.toUpperCase()));

      if (genderLinkIndex !== -1) {
        this.links[genderLinkIndex] = genderLink;
      } else {
        this.links.push(genderLink);
      }

      if (params.has('categoryId')) {
        this.categoriesService.categoriesList$.subscribe(categories => {
          if(!categories) return;

          let categoryId: string = params.get('categoryId');
          let categoryName = categories
            .find(category => category.id === categoryId).name;

          if (!this.links.some(link => link.name === categoryName)) {
            path.push(categoryId);
            this.links.push({
              name: categoryName!,
              path: this.itemName ? [...path] : []
            });
          }

          if(this.itemName) {
            this.links.push({
              name: this.itemName,
              path: []
            });
          }
        });
      }
    });
  }
}
