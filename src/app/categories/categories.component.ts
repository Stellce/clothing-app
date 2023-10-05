import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit{

  categories: string[] = [
    'T_SHIRTS',
    'SHIRTS',
    'TROUSERS',
    'SHORTS',
    'HOODIES_AND_SWEATSHIRTS',
    'SWEATERS',
    'COATS',
    'JACKETS',
    'SHOES',
    'UNDERWEAR',
    'SOCKS'
  ]
  testPath: string = './assets/categories/men/SHIRTS.png'
  childGenders: string[] = ['boys', 'girls']
  gender: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      this.gender = url[0].path;
    })
    // console.log(this.gender);
  }

  getCategoryImagePath(category: string) {
    return `assets/categories/${this.gender}/${category}.png`
  }
}
