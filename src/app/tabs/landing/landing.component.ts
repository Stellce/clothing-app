import {afterNextRender, ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {CategoriesService} from "../../categories/categories.service";
import {Category} from "../../categories/category.model";
import {OutletComponent} from './outlet/outlet.component';
import {RouterLink} from '@angular/router';
import {UpperCasePipe} from '@angular/common';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    imports: [RouterLink, OutletComponent, UpperCasePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  categories: WritableSignal<Category[]> = signal<Category[]>(null);
  randomCategory: WritableSignal<Category> = signal<Category>(null);
  gender: 'MEN' | 'WOMEN';
  get randomCategoryImageBg() {
    return `url("data:image/png;base64,${this.randomCategory().image}")`;
  };
  constructor(
    private categoriesService: CategoriesService
  ) {
    afterNextRender(() => {
      this.categoriesService.categoriesList$.subscribe(categories => {
        if(!categories) return;
        this.randomCategory.set(categories[this.getRandomIntTo(categories.length)]);
        this.gender = this.getRandomGender();
        this.setCategoryImage(this.gender, this.randomCategory().id);
      });
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
      this.randomCategory.update(category => ({...category, image: categoriesImages[categoryId]}));
    });
  }

}
