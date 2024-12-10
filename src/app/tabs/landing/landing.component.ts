import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../categories/categories.service";
import {Category} from "../../categories/category.model";
import { OutletComponent } from './outlet/outlet.component';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    standalone: true,
    imports: [RouterLink, OutletComponent, UpperCasePipe]
})
export class LandingComponent implements OnInit{
  categories: Category[];
  randomCategory: Category;
  gender: 'MEN' | 'WOMEN';
  constructor(
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.categoriesService.categoriesList$.subscribe(categories => {
      if(!categories) return;
      this.randomCategory = categories[this.getRandomIntTo(categories.length)];
      this.gender = this.getRandomGender();
      this.setCategoryImage(this.gender, this.randomCategory.id);
    });
  }

  private getRandomGender() {
    let randomInt = Math.floor(Math.random()*2);
    return randomInt === 1 ? 'MEN' : 'WOMEN';
  }

  private getRandomIntTo(to: number) {
    return Math.floor(Math.random()*to);
  }

  private setCategoryImage(gender: string, categoryId: string) {
    this.categoriesService.requestCategoriesImages(gender).subscribe(categoriesImages => {
      this.randomCategory.image = categoriesImages[categoryId];
    });
  }

}
