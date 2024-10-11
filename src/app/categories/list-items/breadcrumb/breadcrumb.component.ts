import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CategoriesService } from "../../categories.service";
import {FieldToTextPipe} from "../../../pipes/field-to-text";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: true,
  imports: [RouterLink, NgIf, NgFor, FieldToTextPipe]
})
export class BreadcrumbComponent implements OnInit{
  @Input()itemName: string;
  links: {name: string, path: string[]}[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if(!params.get('gender')) return;
      let path: string[] = ['/', 'products', params.get('gender')];
      this.links = [];
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
              path: []
            });
          }
        });
      }
    });
  }

  isLast(i: number) {
    return i === this.links.length - 1;
  }
}
