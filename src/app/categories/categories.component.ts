import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Category} from "../list-items/category.model";
import {ItemsService} from "../list-items/item/items.service";

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
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.gender = params['gender'];

      this.itemsService.requestCategories(this.gender)
        .subscribe(categories => {
          this.isLoading = false;
          this.categories = categories;
        });
    })
  }
}
